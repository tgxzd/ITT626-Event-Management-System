<?php

namespace App\Http\Controllers\Auth\Admin;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use App\Models\Role;
use App\Providers\RouteServiceProvider;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredAdminController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Admin/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'username' => 'required|string|max:255|unique:'.Admin::class,
            'password' => ['required', 'string', 'min:4', 'confirmed'],
        ]);

        // Get the admin role
        $adminRole = Role::where('name', 'admin')->first();

        $admin = Admin::create([
            'username' => $request->username,
            'password' => Hash::make($request->password),
            'role_id' => $adminRole->id,
        ]);

        event(new Registered($admin));

        Auth::guard('admin')->login($admin);

        return redirect(RouteServiceProvider::ADMIN_HOME);
    }
}
