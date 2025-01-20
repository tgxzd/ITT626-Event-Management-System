<?php

namespace Database\Seeders;

use App\Models\Admin;
use App\Models\Role;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        $adminRole = Role::where('name', 'admin')->first();

        Admin::create([
            'username' => 'admin',
            'password' => Hash::make('admin'),
            'role_id' => $adminRole->id,
        ]);
    }
} 