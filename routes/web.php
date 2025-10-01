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
use App\Models\Book;
use App\Models\User;

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get( '/',function(){
    $bookCount = Book::where([
        'is_deleted'=>'0',
        'type'=>'physical'
    ])->count();
    $ebookCount = Book::where([
        'is_deleted'=>'0',
        'type'=>'ebook  '
    ])->count();

    $userCount = User::where([
        'isActive'=>'1',
    ])->count();

    return Inertia::render('welcome',[
        'bookCount'=>$bookCount,
        'ebookCount'=>$ebookCount,
        'userCount'=>$userCount,
    ]);
})->name('home');

//render category of library type(physical:local-global,digital)
Route::get('/library-type-dashboard', function () {
    dd('library-type-dashboard');
})->name('library-type-dashboard');


Route::get('admin/dashboard', [DashboardController::class, 'index'])->name('dashboard')->middleware('auth');

//Protected Route
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

//for global library
Route::get('/global/library', function () {
    $books = Book::active("physical","global")->get();
//    dd($books->toArray());
    return Inertia::render('Client/Library/Index', [
        'books' => $books,
        'scope' => 'global',
    ]);
})->middleware('auth');

//for local library
Route::get('/local/library', function () {
    $books = Book::active("physical","local")->get();
    return Inertia::render('Client/Library/Index', [
        'books' => $books,
        'scope' => 'local',
    ]);
})->middleware('auth');

// For global eBook library
Route::get('/e-library', function () {
    try {
        $books = Book::globalEbooks()->get();
//        dd($books->toArray());
        return Inertia::render('Client/Library/Index', [
            'books' => $books,
            'bookType' => 'ebook',
        ]);
    } catch (\Illuminate\Auth\Access\AuthorizationException $e) {
        return Inertia::render('Error', ['status' => 403, 'message' => $e->getMessage()]);
    }
})->middleware('auth');

//old project
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
