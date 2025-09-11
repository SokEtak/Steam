<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Http;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {

        $response = Http::get('http://127.0.0.1:8000/api/v1/users');

        return Inertia::render('Users/Index', [
            'users' => $response->json(),
        ]);
    }
}
