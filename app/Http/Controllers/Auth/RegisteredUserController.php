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
use Illuminate\Support\Facades\Storage;
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
                    $allowedDomain = 'diu.edu.kh';
                    if (!str_ends_with($value, '@' . $allowedDomain)) {
                        $fail("Only Dewey Organization's email addresses are allowed to register.");
                    }
                },
            ],
            'campus_id' => 'required|exists:campuses,id',
            'code' => 'required|exists:campuses,code',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // Max 2MB
        ]);

        $imagePath = null;
        if ($request->hasFile('avatar')) {
            try {
                // Store the file on the r2 disk with public visibility
                $imagePath = $request->file('avatar')->store('avatars', 'r2');
                // Optionally set visibility explicitly (if not configured in disk)
                Storage::disk('r2')->setVisibility($imagePath, 'public');
            } catch (\Exception $e) {
                \Log::error('Failed to upload avatar to R2: ' . $e->getMessage());
                return back()->withErrors(['avatar' => 'Failed to upload avatar. Please try again later.']);
            }
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'avatar' => $imagePath, // Store the path, generate URL dynamically when needed
            'role_id' => 1,
            'campus_id' => $request->campus_id,
        ]);

        event(new Registered($user));

        Auth::login($user);

        return redirect()->intended(route('dashboard', absolute: false));
    }
}
