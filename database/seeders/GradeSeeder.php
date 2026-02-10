<?php

namespace Database\Seeders;

use App\Models\Grade;
use Illuminate\Database\Seeder;

class GradeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Grade::create(['name' => 'Associate Program']);
        Grade::create(['name' => 'Bachelor Degree']);
        Grade::create(['name' => 'Master Degree']);
        Grade::create(['name' => 'Doctorate Degree']);
    }
}
