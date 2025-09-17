<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Campus;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(): Response
    {
        //append campus
        $campus = Campus::all(['id', 'name', 'code']);

        return Inertia::render('auth/register',['campus' => $campus]);
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {

//        dd($request->all());
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                'unique:' . User::class,
                function ($attribute, $value, $fail) {
                    // Allowed domain(s)
                    $allowedDomain = 'diu.edu.kh';

                    if (!str_ends_with($value, '@' . $allowedDomain)) {
                        $fail("Only Dewey Organization's email addresses are allowed to register.");
                    }
                },
            ],
            'campus_id' => 'required|exists:campuses,id',
            'code' => 'required|exists:campuses,code',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'avatar' => 'nullable|image|max:2048',
        ]);



        $imagePath = null;
        if ($request->hasFile('avatar')) {
            $imagePath = $request->file('avatar')->store('avatars', 's3');//change public to s3 for production
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'avatar' => $imagePath,
            'role_id' => 1,
            'campus_id' => $request->campus_id,
        ]);

        event(new Registered($user));

        Auth::login($user);

        return redirect()->intended(route('dashboard', absolute: false));
    }
}
