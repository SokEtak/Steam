<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Book; // Ensure your Book model is imported
use Illuminate\Support\Facades\Auth;

class LibraryController extends Controller
{
    /**
     * Display the Global Physical Library.
     */
    public function globalLibrary(Request $request)
    {
        $books = Book::active("physical", "global")->inRandomOrder()->get();
        // Get user's preferred language or session/default language
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
    }

    /**
     * Display the Local Physical Library.
     */
    public function localLibrary()
    {
        $books = Book::active("physical", "local")->inRandomOrder()->get();

        return Inertia::render('Client/Library/Index', [
            'books' => $books,
            'scope' => 'local',
        ]);
    }

    /**
     * Display the Global E-book Library.
     */
    public function globalEbooks()
    {
        try {
            $books = Book::active("ebook", "global")->inrandomorder()->get();
            return Inertia::render('Client/Library/Index', [
                'books' => $books,
                'bookType' => 'ebook',
            ]);
        } catch (\Illuminate\Auth\Access\AuthorizationException $e) {
            return Inertia::render('Error', ['status' => 403, 'message' => $e->getMessage()]);
        }
    }

    /**
     * Show a single book and its details.
     */
    public function show(Book $book)
    {
        // Fetch related books logic
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

        // Increment view count if the user is not the book's owner
        if ($book->user_id !== Auth::id()){ // Use Auth::id() for cleaner check
            $book->view += 1;
            $book->save();
        }

        return Inertia::render('Client/Library/Show', [
            // Ensure you are using Auth::user() and not auth()->user() multiple times
            'book' => $book->load('user', 'category', 'subcategory', 'shelf', 'subject', 'grade', 'bookcase', 'campus')->toArray(),
            'lang' => app()->getLocale(),
            'authUser' => Auth::user() ? [
                'name' => Auth::user()->name,
                'email' => Auth::user()->email,
                'avatar' => Auth::user()->avatar ?? null,
                'isVerified' => Auth::user()->isVerified ?? false,
            ] : null,
            'relatedBooks' => $relatedBooks,
        ]);
    }
}
