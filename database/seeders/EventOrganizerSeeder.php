<?php

namespace Database\Seeders;

use App\Models\EventOrganizer;
use App\Models\Role;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class EventOrganizerSeeder extends Seeder
{
    public function run(): void
    {
        $organizerRole = Role::where('name', 'organizer')->first();

        EventOrganizer::create([
            'name' => 'Demo Organizer',
            'username' => 'demo_organizer',
            'email' => 'organizer@example.com',
            'password' => Hash::make('password'),
        ]);
    }
} 