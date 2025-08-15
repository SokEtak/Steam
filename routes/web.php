<?php

use App\Http\Controllers\BookcaseController;
use App\Http\Controllers\BookController;
use App\Http\Controllers\BookLoanController;
use App\Http\Controllers\FileController;
use App\Http\Controllers\ShelvesController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\SubCategoryController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::resource('books', BookController::class);
    Route::resource('bookcases', BookCaseController::class);
    Route::resource('bookloans', BookLoanController::class);
    Route::resource('shelves', ShelvesController::class);
    Route::resource('categories', CategoryController::class);
    Route::resource('subcategories', SubCategoryController::class);
    Route::resource('users',UserController::class);
});

Route::get('/files', [FileController::class, 'index'])->name('files.index');
Route::post('/files', [FileController::class, 'upload'])->name('files.upload');
Route::get('/files/{id}', [FileController::class, 'show'])->name('files.show');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
