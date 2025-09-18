<?php

use App\Http\Controllers\BookcaseController;
use App\Http\Controllers\BookController;
use App\Http\Controllers\BookLoanController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ShelvesController;
use App\Http\Controllers\SubCategoryController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\DashboardController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;


Route::get('/', fn() => Inertia::render('welcome'))->name('home');

//Protected Route
Route::middleware(['auth', 'verified', 'role:librarian','is_account_activated'])
    ->prefix('admin/library')
    ->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
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
//for test
Route::get('/test-r2', function () {
    try {
        Storage::disk('r2')->put('test.txt', 'Hello, R2!');
        $exists = Storage::disk('r2')->exists('test.txt');
        dd(['exists' => $exists]);
    } catch (\Exception $e) {
        dd('Error: ' . $e->getMessage());
    }
});

//unauthenticated
Route::prefix('digital/resource')->group(function () {

    Route::get('/program', function () {
        return Inertia::render('E-Books/Program');
    })->name('program');

    Route::get('/grades', function (Request $request) {
        $program = $request->query('program');

        return Inertia::render('E-Books/Grade', [
            'program' => $program,
        ]);
    })->name('grade');

    Route::get('/subjects', function (Request $request) {
        $program = $request->query('program');
        $grade = $request->query('grade');
        $subject = $request->query('subject');

        return Inertia::render('E-Books/Subject', [
            'program' => $program,
            'grade' => $grade,
            'subject' => $subject,
        ]);
    })->name('subject');

    Route::get('/lessons', function (Request $request) {
        $program = $request->query('program');
        $grade = $request->query('grade');
        $subject = $request->query('subject');

        return Inertia::render('E-Books/Lesson', [
            'subject' => $subject,
            'program' => $program,
            'grade' => $grade,
        ]);
    })->name('lesson');

});



require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
