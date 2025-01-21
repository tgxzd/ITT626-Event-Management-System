<?php

namespace App\Http\Controllers\EventOrganizer;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class EventController extends Controller
{
    public function index()
    {
        $events = Event::where('organizer_id', Auth::id())
            ->with(['registrations' => function($query) {
                $query->where('status', 'registered')
                    ->with('user');
            }])
            ->get();
        
        return Inertia::render('EventOrganizer/Events/Index', [
            'auth' => [
                'user' => Auth::user(),
            ],
            'events' => $events
        ]);
    }

    public function show(Event $event)
    {
        // Check if the event belongs to the authenticated organizer
        if ($event->organizer_id !== Auth::id()) {
            abort(403);
        }

        return Inertia::render('EventOrganizer/Events/Show', [
            'auth' => [
                'user' => Auth::user(),
            ],
            'event' => $event
        ]);
    }

    public function edit(Event $event)
    {
        // Check if the event belongs to the authenticated organizer
        if ($event->organizer_id !== Auth::id()) {
            abort(403);
        }

        return Inertia::render('EventOrganizer/Events/Edit', [
            'auth' => [
                'user' => Auth::user(),
            ],
            'event' => $event
        ]);
    }

    public function update(Request $request, Event $event)
    {
        // Check if the event belongs to the authenticated organizer
        if ($event->organizer_id !== Auth::id()) {
            abort(403);
        }

        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'event_date' => 'required|date',
                'location' => 'required|string|max:255',
                'latitude' => 'nullable|numeric|between:-90,90',
                'longitude' => 'nullable|numeric|between:-180,180',
                'capacity' => 'required|integer|min:1',
                'status' => 'required|in:draft,active,inactive',
                'is_paid' => 'required|boolean',
                'price' => 'required_if:is_paid,true|nullable|numeric|min:0',
                'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            ]);

            $eventData = [
                'title' => $validated['title'],
                'description' => $validated['description'],
                'event_date' => $validated['event_date'],
                'location' => $validated['location'],
                'latitude' => $validated['latitude'],
                'longitude' => $validated['longitude'],
                'capacity' => $validated['capacity'],
                'status' => $validated['status'],
                'is_paid' => $validated['is_paid'],
                'price' => $validated['is_paid'] ? $validated['price'] : null,
            ];

            if ($request->hasFile('image')) {
                // Delete old image if it exists
                if ($event->image) {
                    Storage::disk('public')->delete($event->image);
                }
                
                $path = $request->file('image')->store('event-images', 'public');
                $eventData['image'] = $path;
            }

            $event->update($eventData);

            return redirect()->route('event-organizer.events.show', $event->id)
                ->with('success', 'Event updated successfully.');
        } catch (\Exception $e) {
            return redirect()->back()
                ->withInput()
                ->withErrors(['error' => 'Failed to update event. ' . $e->getMessage()]);
        }
    }

    public function destroy(Event $event)
    {
        // Check if the event belongs to the authenticated organizer
        if ($event->organizer_id !== Auth::id()) {
            abort(403);
        }

        $event->delete();

        return redirect()->route('event-organizer.events.index')
            ->with('success', 'Event deleted successfully.');
    }

    public function create()
    {
        return Inertia::render('EventOrganizer/Events/Create', [
            'auth' => [
                'user' => Auth::user(),
            ],
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
                'latitude' => 'nullable|numeric|between:-90,90',
                'longitude' => 'nullable|numeric|between:-180,180',
                'capacity' => 'required|integer|min:1',
                'is_paid' => 'required|boolean',
                'price' => 'required_if:is_paid,true|nullable|numeric|min:0',
                'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            ]);

            $eventData = [
                'organizer_id' => Auth::id(),
                'title' => $validated['title'],
                'description' => $validated['description'],
                'event_date' => $validated['event_date'],
                'location' => $validated['location'],
                'latitude' => $validated['latitude'],
                'longitude' => $validated['longitude'],
                'capacity' => $validated['capacity'],
                'is_paid' => $validated['is_paid'],
                'price' => $validated['is_paid'] ? $validated['price'] : null,
                'status' => 'draft'
            ];

            if ($request->hasFile('image')) {
                $path = $request->file('image')->store('event-images', 'public');
                $eventData['image'] = $path;
            }

            $event = Event::create($eventData);

            return to_route('event-organizer.dashboard');
        } catch (\Exception $e) {
            return redirect()->back()
                ->withInput()
                ->withErrors(['error' => 'Failed to create event. ' . $e->getMessage()]);
        }
    }

    public function dashboard()
    {
        $events = Event::where('organizer_id', Auth::id())
            ->with(['registrations' => function($query) {
                $query->where('status', 'registered')
                    ->with('user');
            }])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('EventOrganizer/Dashboard', [
            'auth' => [
                'user' => Auth::user(),
            ],
            'eventStats' => [
                'events' => $events,
            ],
        ]);
    }

    public function showRegistrations(Event $event)
    {
        // Check if the event belongs to the authenticated organizer
        if ($event->organizer_id !== Auth::id()) {
            abort(403);
        }

        $event->load(['registrations' => function($query) {
            $query->where('status', 'registered')
                ->with('user');
        }]);

        return Inertia::render('EventOrganizer/Events/Registrations', [
            'auth' => [
                'user' => Auth::user(),
            ],
            'event' => $event
        ]);
    }
} 