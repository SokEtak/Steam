<?php

use App\Http\Controllers\api\BookController;
use App\Models\Book;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;

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

//Route::get('/file/download/{book}', function (Book $book) {
//
//    // Check if the book is downloadable and has a PDF URL
//    if (!$book->downloadable || !$book->pdf_url) {
//        abort(403, 'This book is not available for download.');
//    }
//
//    // Assuming pdf_url is a path relative to the storage disk (e.g., 'public/pdfs/book123.pdf')
//    $filePath = $book->pdf_url;
//
//    // Verify the file exists in storage
//    if (!Storage::disk('public')->exists($filePath)) {
//        abort(404, 'File not found.');
//    }
//
//    // Get the full path to the file
//    $fullPath = Storage::disk('public')->path($filePath);
//
//    // Generate a safe filename (e.g., based on book title or ID)
//    $fileName = 'book_' . $book->id . '.pdf';
//
//    // Return the file as a download response
//    return response()->download($fullPath, $fileName);
//})->name('download');

//60 request per minute
Route::middleware('throttle:60,1')->apiResource('/library/v1/books',BookController::class );
//Route::apiResource('/v1/users',UserController::class );
