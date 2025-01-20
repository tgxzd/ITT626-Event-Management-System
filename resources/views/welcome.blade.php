<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ config('app.name') }}</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="antialiased">
    <div class="min-h-screen bg-gray-100">
        <!-- Navigation -->
        <nav class="bg-white shadow-lg">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between h-16">
                    <div class="flex">
                        <div class="flex-shrink-0 flex items-center">
                            <h1 class="text-xl font-bold">Event Management</h1>
                        </div>
                    </div>
                    <div class="flex items-center">
                        @if (Route::has('login'))
                            @auth
                                <a href="{{ route('profile.edit') }}" class="text-gray-700 hover:text-gray-900 px-3 py-2">Profile</a>
                                <form method="POST" action="{{ route('logout') }}">
                                    @csrf
                                    <button type="submit" class="text-gray-700 hover:text-gray-900 px-3 py-2">
                                        Log Out
                                    </button>
                                </form>
                            @else
                                <a href="{{ route('login') }}" class="text-gray-700 hover:text-gray-900 px-3 py-2">Log in</a>
                                @if (Route::has('register'))
                                    <a href="{{ route('register') }}" class="text-gray-700 hover:text-gray-900 px-3 py-2">Register</a>
                                @endif
                            @endauth
                        @endif
                    </div>
                </div>
            </div>
        </nav>

        <!-- Hero Section -->
        <div class="py-12 bg-white">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center">
                    <h2 class="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                        Welcome to Event Management
                    </h2>
                    <p class="mt-4 text-xl text-gray-500">
                        Discover and join amazing events or create your own!
                    </p>
                </div>
            </div>
        </div>
    </div>
</body>
</html> 