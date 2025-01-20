<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\EventOrganizer;
use App\Models\Event;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'totalUsers' => User::count(),
            'totalOrganizers' => EventOrganizer::count(),
            'totalEvents' => Event::count(),
        ];

        return Inertia::render('Admin/Dashboard', [
            'auth' => [
                'user' => auth()->user(),
            ],
            'stats' => $stats,
        ]);
    }
} 