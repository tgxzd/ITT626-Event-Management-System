<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        $users = User::all();
        return Inertia::render('Admin/Users/Index', [
            'auth' => [
                'user' => auth()->user(),
            ],
            'users' => $users
        ]);
    }

    public function show(User $user)
    {
        return Inertia::render('Admin/Users/Show', [
            'auth' => [
                'user' => auth()->user(),
            ],
            'user' => $user
        ]);
    }

    public function destroy(User $user)
    {
        $user->delete();
        return redirect()->route('admin.users.index')->with('success', 'User deleted successfully.');
    }
} 