<?php

namespace App\Http\Controllers\Auth\EventOrganizer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Providers\RouteServiceProvider;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Validation\ValidationException;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/EventOrganizer/Login');
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(Request $request): RedirectResponse
    {
        $field = filter_var($request->input('login'), FILTER_VALIDATE_EMAIL) ? 'email' : 'username';

        $request->validate([
            'login' => 'required|string',
            'password' => 'required|string',
        ]);

        if (Auth::guard('event-organizer')->attempt([
            $field => $request->input('login'),
            'password' => $request->input('password')
        ])) {
            $request->session()->regenerate();

            return redirect()->intended(RouteServiceProvider::EVENT_ORGANIZER_HOME);
        }

        throw ValidationException::withMessages([
            'login' => trans('auth.failed'),
        ]);
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('event-organizer')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/')->withHeaders([
            'Cache-Control' => 'no-cache, no-store, max-age=0, must-revalidate',
            'Pragma' => 'no-cache',
            'Expires' => 'Fri, 01 Jan 1990 00:00:00 GMT',
        ]);
    }
}
