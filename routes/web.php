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

Route::get('/auth/google', function () {
    return Socialite::driver('google')
        ->scopes(['openid','email','profile'])
        ->redirect();
});

Route::get('/auth/google/callback', function () {
    $googleUser = Socialite::driver('google')
        ->stateless()
//        ->setHttpClient(new Client(['verify' => false]))//disable for production
        ->user();
//    dd($googleUser);
    $email = $googleUser->getEmail();

    // Check if email domain matches @diu.edu.kh
    if (!$email || !str_ends_with($email, '@diu.edu.kh')) {
        return response('⚠️ Danger: Only @diu.edu.kh emails are allowed!', 403);
    }

    // ✅ Allowed, proceed
    $user = User::updateOrCreate(
        ['google_id' => $googleUser->getId()],
        [
            'name' => $googleUser->getName(),
            'email' => $email,
            'avatar' => $googleUser->getAvatar(),
            'password' => Hash::make(Str::random(24)),
        ]
    );

    Auth::login($user);

    return redirect(route('home'));
});

//facebook
Route::get('/auth/facebook', function () {
    return Socialite::driver('facebook')
        ->scopes(['email'])
        ->redirect();
});

Route::get('/auth/facebook/callback', function () {
    // Get user from Facebook
    $facebookUser = Socialite::driver('facebook')
        ->stateless()
        ->setHttpClient(new Client(['verify' => false])) //disable for production
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
            'password' => Hash::make(Str::random(24)), // random hidden password
        ]
    );

    // Log the user in (session)
    Auth::login($user);

    return redirect()->route('home')->with('success', 'Welcome '.$user->name.'!');
});

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
    $books = Book::active("physical","global")->get();

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
    $books = Book::active("physical","local")->get();
    return Inertia::render('Client/Library/Index', [
        'books' => $books,
        'scope' => 'local',
    ]);
})->middleware('auth')->name('local library');

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
})->middleware('auth')->name('global e-library');

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
