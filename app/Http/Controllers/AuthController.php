<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use GuzzleHttp\Client;

class AuthController extends Controller
{
    /**
     * Redirect the user to the Google authentication page.
     */
    public function googleRedirect()
    {
        return Socialite::driver('google')
            ->scopes(['openid', 'email', 'profile'])
            ->redirect();
    }

    /**
     * Handle the callback from Google authentication.
     */
    public function googleCallback()
    {
        // ⚠️ WARNING: Remove setHttpClient and the Guzzle import for production
        $googleUser = Socialite::driver('google')
            ->stateless()
//            ->setHttpClient(new Client(['verify' => false]))
            ->user();

        $email = $googleUser->getEmail();

//         Check if email domain matches @diu.edu.kh
        if (!$email || !str_ends_with($email, '@diu.edu.kh')) {
            return response('⚠️ Danger: Only @diu.edu.kh emails are allowed!', 403);
        }

        $user = User::updateOrCreate(
            ['google_id' => $googleUser->getId()],
            [
                'name' => $googleUser->getName(),
                'email' => $email,
                'avatar' => $googleUser->getAvatar(),
                'password' => Hash::make(Str::random(24)),
                'campus_id' => 1,
                'role_id' => 1,
            ]
        );

        Auth::login($user);

        return redirect()->route('home');
    }

    //need to update
    /**
     * Redirect the user to the Facebook authentication page.
     */
    public function facebookRedirect()
    {
        return Socialite::driver('facebook')
            ->scopes(['email'])
            ->redirect();
    }

    /**
     * Handle the callback from Facebook authentication.
     */
    public function facebookCallback()
    {
        // ⚠️ WARNING: Remove setHttpClient and the Guzzle import for production
        $facebookUser = Socialite::driver('facebook')
            ->stateless()
//            ->setHttpClient(new Client(['verify' => false]))
            ->user();

        // Handle missing email
        $email = $facebookUser->getEmail() ?? $facebookUser->getId().'@facebook.local';

        // Find or create local user
        $user = User::updateOrCreate(
            ['facebook_id' => $facebookUser->getId()],
            [
                'name' => $facebookUser->getName(),
                'email' => $email,
                'avatar' => $facebookUser->getAvatar(),
                'password' => Hash::make(Str::random(24)),
            ]
        );

        Auth::login($user);

        return redirect()->route('home')->with('success', 'Welcome '.$user->name.'!');
    }
}
