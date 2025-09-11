<?php

use App\Http\Controllers\BookcaseController;
use App\Http\Controllers\BookController;
use App\Http\Controllers\BookLoanController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ShelvesController;
use App\Http\Controllers\SubCategoryController;
use App\Models\Book;
use App\Http\Controllers\UserController;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', fn() => Inertia::render('welcome'))->name('home');

//Protected Route
Route::middleware(['auth', 'verified', 'role:librarian'])
        ->prefix('admin/library')
        ->group(function () {
    Route::get('/dashboard', fn() => Inertia::render('dashboard'))->name('dashboard');
    Route::resources([
        'books' => BookController::class,
        'bookcases' => BookcaseController::class,
        'bookloans' => BookLoanController::class,
        'shelves' => ShelvesController::class,
        'categories' => CategoryController::class,
        'subcategories' => SubCategoryController::class,
        'users' => UserController::class,
    ]);
});

//for regular user
//at this point should create another page that can be reusable (pass books,.. as prop)
Route::get('/iconic/library',function(){
    //api practice
    try {//fix
        $response = Http::get('http://localhost:8000/api/library/v1/books');

        // Check if the request was successful
        if ($response->successful()) {
            $books = $response->json(); // Get JSON data from response
            // For debugging, dump the response
            dd($books);
        } else {
            // Handle non-2xx responses
            abort($response->status(), 'Failed to fetch books: ' . $response->reason());
        }
    } catch (\Exception $e) {
        // Handle request exceptions (e.g., network issues)
        abort(500, 'Error fetching books: ' . $e->getMessage());
    }
});

Route::get('/bmc/library',function(){
    $books = Book::select('id','title')
        ->where([
            'is_deleted'=>0,
            'campus_id'=>2,
        ])->get()->toArray();
    dd($books);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
