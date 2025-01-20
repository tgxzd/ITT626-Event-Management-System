<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $query = Event::with('organizer')
            ->where('status', 'active')
            ->latest();

        if ($request->has('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        $events = $query->get();
        
        // Add available spots and registration status for each event
        $events = $events->map(function ($event) {
            $isRegistered = $event->isUserRegistered(auth()->id());
            $availableSpots = $event->availableSpots;
            
            return array_merge($event->toArray(), [
                'is_registered' => $isRegistered,
                'available_spots' => $availableSpots
            ]);
        });

        return Inertia::render('Dashboard', [
            'auth' => [
                'user' => auth()->user(),
            ],
            'events' => $events,
            'filters' => [
                'search' => $request->search,
            ],
        ]);
    }
} 