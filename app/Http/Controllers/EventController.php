<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\EventRegistration;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class EventController extends Controller
{
    public function index()
    {
        $events = Event::with('organizer')->get();
        return Inertia::render('Admin/Events/Index', [
            'events' => $events
        ]);
    }

    public function show(Event $event)
    {
        // Only show active events to users
        if ($event->status !== 'active') {
            abort(404);
        }

        $event->load('organizer');
        $isRegistered = $event->isUserRegistered(auth()->id());
        $availableSpots = $event->availableSpots;

        return Inertia::render('Events/Show', [
            'auth' => [
                'user' => auth()->user(),
            ],
            'event' => array_merge($event->toArray(), [
                'is_registered' => $isRegistered,
                'available_spots' => $availableSpots
            ])
        ]);
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'event_date' => 'required|date',
                'location' => 'required|string|max:255',
                'capacity' => 'required|integer|min:1',
            ]);

            Log::info('Validation passed', $validated);
            
            $organizer = Auth::guard('event-organizer')->user();
            Log::info('Current organizer', ['id' => $organizer->id]);

            $event = Event::create([
                'organizer_id' => $organizer->id,
                'title' => $validated['title'],
                'description' => $validated['description'],
                'event_date' => $validated['event_date'],
                'location' => $validated['location'],
                'capacity' => $validated['capacity']
            ]);

            Log::info('Event created', ['event' => $event]);

            return redirect()->route('event-organizer.dashboard')
                ->with('success', 'Event created successfully!');

        } catch (\Exception $e) {
            Log::error('Error creating event', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return back()
                ->withInput()
                ->withErrors(['error' => 'Failed to create event. Please try again.']);
        }
    }

    public function destroy(Event $event)
    {
        $event->delete();
        return redirect()->route('admin.events.index')->with('success', 'Event deleted successfully.');
    }

    public function register(Event $event)
    {
        // Check if event is active
        if ($event->status !== 'active') {
            return back()->withErrors(['error' => 'This event is not available for registration.']);
        }

        // Check if user is already registered
        if ($event->isUserRegistered(auth()->id())) {
            return back()->withErrors(['error' => 'You are already registered for this event.']);
        }

        // Check if event is full
        if ($event->availableSpots <= 0) {
            return back()->withErrors(['error' => 'This event is already full.']);
        }

        try {
            EventRegistration::create([
                'event_id' => $event->id,
                'user_id' => auth()->id(),
                'status' => 'registered'
            ]);

            return back()->with('success', 'Successfully registered for the event!');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to register for the event. Please try again.']);
        }
    }

    public function cancelRegistration(Event $event)
    {
        $registration = EventRegistration::where('event_id', $event->id)
            ->where('user_id', auth()->id())
            ->where('status', 'registered')
            ->first();

        if (!$registration) {
            return back()->withErrors(['error' => 'No active registration found for this event.']);
        }

        try {
            $registration->update(['status' => 'cancelled']);
            return back()->with('success', 'Successfully cancelled your registration.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to cancel registration. Please try again.']);
        }
    }
}
