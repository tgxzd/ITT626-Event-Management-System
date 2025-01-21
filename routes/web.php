<?php

use App\Http\Controllers\Auth\EventOrganizer\RegisteredEventOrganizerController;
use App\Http\Controllers\Auth\EventOrganizer\AuthenticatedSessionController as EventOrganizerAuthController;
use App\Http\Controllers\Auth\Admin\AuthenticatedSessionController as AdminAuthController;
use App\Http\Controllers\Auth\Admin\RegisteredAdminController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\EventOrganizer\EventController as EventOrganizerEventController;
use App\Http\Controllers\EventOrganizer\ProfileController as EventOrganizerProfileController;
use App\Http\Controllers\User\ProfileController as UserProfileController;
use App\Http\Controllers\Admin\ProfileController as AdminProfileController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\OrganizerController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/event-organizer', function () {
    return Inertia::render('EventOrganizerWelcome', [
        'auth' => [
            'user' => auth()->user(),
        ],
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('event-organizer');

Route::get('/admin', function () {
    return Inertia::render('AdminWelcome', [
        'auth' => [
            'user' => auth()->user(),
        ],
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('admin');

Route::middleware('guest:event-organizer')->group(function () {
    // Event Organizer Routes
    Route::get('event-organizer/register', [RegisteredEventOrganizerController::class, 'create'])
        ->name('event-organizer.register');
    Route::post('event-organizer/register', [RegisteredEventOrganizerController::class, 'store']);
    Route::get('event-organizer/login', [EventOrganizerAuthController::class, 'create'])
        ->name('event-organizer.login');
    Route::post('event-organizer/login', [EventOrganizerAuthController::class, 'store']);
});

Route::middleware('guest:admin')->group(function () {
    // Admin Routes
    Route::get('admin/register', [RegisteredAdminController::class, 'create'])
        ->name('admin.register');
    Route::post('admin/register', [RegisteredAdminController::class, 'store']);
    Route::get('admin/login', [AdminAuthController::class, 'create'])
        ->name('admin.login');
    Route::post('admin/login', [AdminAuthController::class, 'store']);
});

// Event Organizer Routes
Route::middleware('auth:event-organizer')->group(function () {
    Route::get('/event-organizer/dashboard', [EventOrganizerEventController::class, 'dashboard'])
        ->name('event-organizer.dashboard');

    // Event Management Routes
    Route::get('/event-organizer/events/create', [EventOrganizerEventController::class, 'create'])
        ->name('event-organizer.events.create');
    Route::post('/event-organizer/events', [EventOrganizerEventController::class, 'store'])
        ->name('event-organizer.events.store');
    Route::get('/event-organizer/events/{event}', [EventOrganizerEventController::class, 'show'])
        ->name('event-organizer.events.show');
    Route::get('/event-organizer/events/{event}/edit', [EventOrganizerEventController::class, 'edit'])
        ->name('event-organizer.events.edit');
    Route::patch('/event-organizer/events/{event}', [EventOrganizerEventController::class, 'update'])
        ->name('event-organizer.events.update');
    Route::delete('/event-organizer/events/{event}', [EventOrganizerEventController::class, 'destroy'])
        ->name('event-organizer.events.destroy');
    Route::get('/event-organizer/events/{event}/registrations', [EventOrganizerEventController::class, 'showRegistrations'])
        ->name('event-organizer.events.registrations');
    
    // Event Organizer Profile Routes
    Route::get('/event-organizer/profile', [EventOrganizerProfileController::class, 'edit'])
        ->name('event-organizer.profile.edit');
    Route::patch('/event-organizer/profile', [EventOrganizerProfileController::class, 'update'])
        ->name('event-organizer.profile.update');
    Route::delete('/event-organizer/profile', [EventOrganizerProfileController::class, 'destroy'])
        ->name('event-organizer.profile.destroy');
    
    Route::post('event-organizer/logout', [EventOrganizerAuthController::class, 'destroy'])
        ->name('event-organizer.logout');
});

// User Routes
Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');
    Route::get('/events/{event}', [App\Http\Controllers\EventController::class, 'show'])->name('events.show');
    Route::post('/events/{event}/register', [App\Http\Controllers\EventController::class, 'register'])->name('events.register');
    Route::post('/events/{event}/cancel', [App\Http\Controllers\EventController::class, 'cancelRegistration'])->name('events.cancel');

    // User Profile Routes
    Route::get('/profile', [UserProfileController::class, 'edit'])
        ->name('user.profile.edit');
    Route::patch('/profile', [UserProfileController::class, 'update'])
        ->name('user.profile.update');
    Route::delete('/profile', [UserProfileController::class, 'destroy'])
        ->name('user.profile.destroy');
});

// Admin Routes
Route::middleware(['auth:admin'])->group(function () {
    Route::get('/admin/dashboard', [\App\Http\Controllers\Admin\DashboardController::class, 'index'])
        ->name('admin.dashboard');

    // Admin Events Routes
    Route::get('/admin/events', [\App\Http\Controllers\Admin\EventController::class, 'index'])->name('admin.events.index');
    Route::get('/admin/events/{event}', [\App\Http\Controllers\Admin\EventController::class, 'show'])->name('admin.events.show');
    Route::delete('/admin/events/{event}', [\App\Http\Controllers\Admin\EventController::class, 'destroy'])->name('admin.events.destroy');

    // Admin Users Routes
    Route::get('/admin/users', [\App\Http\Controllers\Admin\UserController::class, 'index'])->name('admin.users.index');
    Route::get('/admin/users/{user}', [\App\Http\Controllers\Admin\UserController::class, 'show'])->name('admin.users.show');
    Route::delete('/admin/users/{user}', [\App\Http\Controllers\Admin\UserController::class, 'destroy'])->name('admin.users.destroy');

    // Admin Organizers Routes
    Route::get('/admin/organizers', [\App\Http\Controllers\Admin\OrganizerController::class, 'index'])->name('admin.organizers.index');
    Route::get('/admin/organizers/{organizer}', [\App\Http\Controllers\Admin\OrganizerController::class, 'show'])->name('admin.organizers.show');
    Route::delete('/admin/organizers/{organizer}', [\App\Http\Controllers\Admin\OrganizerController::class, 'destroy'])->name('admin.organizers.destroy');

    // Admin Profile Routes
    Route::get('/admin/profile', [AdminProfileController::class, 'edit'])
        ->name('admin.profile.edit');
    Route::patch('/admin/profile', [AdminProfileController::class, 'update'])
        ->name('admin.profile.update');
    Route::delete('/admin/profile', [AdminProfileController::class, 'destroy'])
        ->name('admin.profile.destroy');

    Route::post('admin/logout', [AdminAuthController::class, 'destroy'])
        ->name('admin.logout');
});

require __DIR__.'/auth.php';
