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
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use Laravel\Socialite\Facades\Socialite;


//Socialite Practice
use App\Http\Controllers\AuthController;

// Google Authentication
Route::get('/auth/google', [AuthController::class, 'googleRedirect'])->name('auth.google');
Route::get('/auth/google/callback', [AuthController::class, 'googleCallback']);

// Facebook Authentication
Route::get('/auth/facebook', [AuthController::class, 'facebookRedirect'])->name('auth.facebook');
Route::get('/auth/facebook/callback', [AuthController::class, 'facebookCallback']);

// Note: You must ensure you have a route named 'home'
// and that you have a route for 'Auth::login($user)' to land on.
Route::get( '/',function(){
    $bookCount = Book::where([
        'is_deleted'=>'0',
        'type'=>'physical'
    ])->count();
    $ebookCount = Book::where([
        'is_deleted'=>'0',
        'type'=>'ebook'
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
    return Inertia::render('Client/Library/DashboardType');
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
Route::get('/global/library', function (Request $request) {
    $books = Book::active("physical","global")->inRandomOrder()->get();

    $lang = $request->user()->language ?? session('language', 'kh');

    // Optionally, allow language to be set via query parameter
    if ($request->has('lang') && in_array($request->query('lang'), ['en', 'kh'])) {
        $lang = $request->query('lang');
        session(['language' => $lang]); // Persist in session
    }
    return Inertia::render('Client/Library/Index', [
        'books' => $books,
        'scope' => 'global',
        'lang' => $lang,
    ]);
})->middleware('auth')->name('global library');

//for local library
Route::get('/local/library', function () {
    $books = Book::active("physical","local")->inRandomOrder()->get();
    return Inertia::render('Client/Library/Index', [
        'books' => $books,
        'scope' => 'local',
    ]);
})->middleware('auth')->name('local library');

// For global eBook library
Route::get('/e-library', function () {
    try {
        $books = Book::globalEbooks()->inrandomorder()->get();
//        dd($books->toArray());
        return Inertia::render('Client/Library/Index', [
            'books' => $books,
            'bookType' => 'ebook',
        ]);
    } catch (\Illuminate\Auth\Access\AuthorizationException $e) {
        return Inertia::render('Error', ['status' => 403, 'message' => $e->getMessage()]);
    }
})->middleware('auth')->name('global e-library');

//Show Library
Route::get('/library/{book}', function (Book $book) {
    // Fetch related books
    $relatedBooks = Book::query()
        ->where(function ($query) use ($book) {
            $query->where('category_id', $book->category_id)
                ->orWhere('user_id', $book->user_id);
        })
        ->where('id', '!=', $book->id)
        ->where('is_deleted', false)
        ->inRandomOrder()
        ->take(10)
        ->with(['user', 'category', 'subcategory', 'shelf', 'subject', 'grade'])
        ->get()
        ->map(function ($relatedBook) {
            return [
                'id' => $relatedBook->id,
                'title' => $relatedBook->title,
                'cover' => $relatedBook->cover,
                'user' => $relatedBook->user ? [
                    'name' => $relatedBook->user->name,
                    'isVerified' => $relatedBook->user->isVerified ?? false,
                ] : null,
            ];
        });
        if ($book->user_id !== Auth::user()->id){
            $book->view += 1;
            $book->save();
        }
    return Inertia::render('Client/Library/Show', [
        'book' => $book->load('user', 'category', 'subcategory', 'shelf', 'subject', 'grade', 'bookcase', 'campus')->toArray(),
        'lang' => app()->getLocale(),
        'authUser' => auth()->user() ? [
            'name' => auth()->user()->name,
            'email' => auth()->user()->email,
            'avatar' => auth()->user()->avatar ?? null,
            'isVerified' => auth()->user()->isVerified ?? false,
        ] : null,
        'relatedBooks' => $relatedBooks,
    ]);
})->middleware(['auth', 'throttle:5,2'])->name('library.show');




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
