<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;

class UserController extends Controller
{
    public function show(User $user)
    {
        return Inertia::render('Users/Show', [
            'user' => $user->only('id', 'name', 'email', 'created_at', 'updated_at'),
            'flash' => [
                'message' => session('message'),
            ],
        ]);
    }
}
