<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\EventOrganizer;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrganizerController extends Controller
{
    public function index()
    {
        $organizers = EventOrganizer::withCount('events')->get();
        return Inertia::render('Admin/Organizers/Index', [
            'auth' => [
                'user' => auth()->user(),
            ],
            'organizers' => $organizers
        ]);
    }

    public function show(EventOrganizer $organizer)
    {
        $organizer->load('events');
        return Inertia::render('Admin/Organizers/Show', [
            'auth' => [
                'user' => auth()->user(),
            ],
            'organizer' => $organizer
        ]);
    }

    public function destroy(EventOrganizer $organizer)
    {
        $organizer->delete();
        return redirect()->route('admin.organizers.index')->with('success', 'Event organizer deleted successfully.');
    }
} 