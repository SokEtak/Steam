<?php

use App\Http\Controllers\api\BookController;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\CategoryApiController;

Route::apiResource('categories', CategoryApiController::class);

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/login', function (Request $request) {
    $request->validate([
        'email' => 'required|email',
        'password' => 'required',
    ]);

    $user = User::where('email', $request->email)->first();

    if (! $user || ! Hash::check($request->password, $user->password)) {
        return response()->json(['message' => 'Invalid credentials'], 401);
    }

    return ['token' => $user->createToken('api-token')->plainTextToken];
});

Route::middleware('auth:sanctum')->post('/logout', function (Request $request) {
//    dd('logout');
    $request->user()->currentAccessToken()->delete();
    return ['message' => 'Logged out'];
});

//60 request per minute
Route::middleware('throttle:60,1')->apiResource('/library/v1/books',BookController::class );
//Route::apiResource('/v1/users',UserController::class );
