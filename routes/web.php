<?php

use App\Http\Controllers\BookcaseController;
use App\Http\Controllers\BookController;
use App\Http\Controllers\BookLoanController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ShelvesController;
use App\Http\Controllers\SubCategoryController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\DashboardController;
use Illuminate\Http\Request;
use App\Models\Book;
use App\Models\User;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use Laravel\Socialite\Facades\Socialite;


//Socialite Practice
use App\Http\Controllers\AuthController;

//-----OAuth------

// Google Authentication
Route::get('/auth/google', [AuthController::class, 'googleRedirect'])->name('auth.google');
Route::get('/auth/google/callback', [AuthController::class, 'googleCallback']);

// Facebook Authentication
Route::get('/auth/facebook', [AuthController::class, 'facebookRedirect'])->name('auth.facebook');
Route::get('/auth/facebook/callback', [AuthController::class, 'facebookCallback']);


Route::get('/', [HomeController::class, 'index'])->name('home');

Route::get('/library-type-dashboard', [HomeController::class, 'libraryTypeDashboard'])
    ->name('library-type-dashboard');

Route::get('admin/dashboard', [DashboardController::class, 'index'])->name('dashboard')->middleware('auth');

//-----Admin------
Route::middleware(['auth', 'verified', 'role:librarian','is_account_activated'])
    ->prefix('admin/library')
    ->group(function () {
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

//-----Library------

//for global library
use App\Http\Controllers\LibraryController;

// Global Physical Library
Route::get('/global/library', [LibraryController::class, 'globalLibrary'])
    ->middleware('auth')
    ->name('global library');

// Local Physical Library
Route::get('/local/library', [LibraryController::class, 'localLibrary'])
    ->middleware('auth')
    ->name('local library');

// Global eBook Library
Route::get('/e-library', [LibraryController::class, 'globalEbooks'])
    ->middleware('auth')
    ->name('global e-library');

// Show Library (Single Book View)
Route::get('/library/{book}', [LibraryController::class, 'show'])
    ->middleware(['auth', 'throttle:5,2'])
    ->name('library.show');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
