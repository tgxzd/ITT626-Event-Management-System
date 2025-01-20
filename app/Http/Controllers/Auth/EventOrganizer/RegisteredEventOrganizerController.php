<?php

namespace App\Http\Controllers\Auth\EventOrganizer;

use App\Http\Controllers\Controller;
use App\Models\EventOrganizer;
use App\Providers\RouteServiceProvider;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredEventOrganizerController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/EventOrganizer/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:event_organizers',
            'email' => 'required|string|lowercase|email|max:255|unique:event_organizers',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $organizer = EventOrganizer::create([
            'name' => $request->name,
            'username' => $request->username,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        event(new Registered($organizer));

        Auth::guard('event-organizer')->login($organizer);

        return redirect(RouteServiceProvider::EVENT_ORGANIZER_HOME);
    }
}
