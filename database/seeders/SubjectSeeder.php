<?php

namespace Database\Seeders;

use App\Models\Subject;
use Illuminate\Database\Seeder;

class SubjectSeeder extends Seeder
{
    public function run(): void
    {
        $subjects = [
            'English Language and Literature',
            'Khmer Studies',
            'Philosophy',
            'Law',
            'Public Administration',
            'Community Development',
            'Social Work',
            'Economics',
            'Political Science',
            'Environmental Science',
            'Statistics and Research',
            'Networking and Communication',
            'Software Engineering',
            'Mathematics',
            'Management',
            'Marketing',
            'Accounting',
            'Banking and Finance',
            'Tourism and Hospitality',
            'Entrepreneurship',
            'TESOL',
            'Community Education',
            'Educational Administration',
            'Hospitality and Tourism Management',
            'Private Laws',
            'PhD in Business Administration',
            'PhD in Finance',
            'PhD in Public Policy',
            'PhD in Education',
        ];

        foreach ($subjects as $subject) {
            Subject::create([
                'name' => $subject,
            ]);
        }
    }
}
