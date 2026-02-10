<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {   
        $admin=User::create([
            'name' => 'Sin Viroth',
            'email' => 'sinviroth@diu.edu.kh',
            'password' => bcrypt('password123'),
            'campus_id' => 1,

        ]);
        $admin->assignRole('admin');
        User::factory()->count(10)->create();
    }
}
