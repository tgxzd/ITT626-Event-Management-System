<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EventController extends Controller
{
    public function index()
    {
        $events = Event::with('organizer')->get();
        return Inertia::render('Admin/Events/Index', [
            'auth' => [
                'user' => auth()->user(),
            ],
            'events' => $events
        ]);
    }

    public function show(Event $event)
    {
        $event->load('organizer');
        return Inertia::render('Admin/Events/Show', [
            'auth' => [
                'user' => auth()->user(),
            ],
            'event' => $event
        ]);
    }

    public function destroy(Event $event)
    {
        $event->delete();
        return redirect()->route('admin.events.index')->with('success', 'Event deleted successfully.');
    }
} 