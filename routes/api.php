<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\BookController;
use App\Http\Controllers\Api\UserController;


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

//60 request per minute
Route::middleware('throttle:60,1')->apiResource('/library/v1/books',BookController::class );
Route::apiResource('/v1/users',UserController::class );



