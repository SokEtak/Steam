<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\BookLoan;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BookLoanController extends Controller
{
    public function index()
    {
        $bookloans = BookLoan::with(['book', 'user'])->get();
        return Inertia::render('BookLoans/Index', [
            'bookloans' => $bookloans,
        ]);
    }

    public function create()
    {
        $books = Book::all();
        $users = User::all();
        return Inertia::render('BookLoans/Create', [
            'books' => $books,
            'users' => $users,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'return_date' => 'required|date',
            'book_id' => 'required|exists:books,id',
            'user_id' => 'required|exists:users,id',
        ]);

        BookLoan::create($validated);
        return redirect()->route('bookloans.index')->with('message', 'Book loan created successfully.');
    }

    public function show(BookLoan $bookloan)
    {
        return Inertia::render('BookLoans/Show', [
            'loan' => $bookloan->load(['book', 'user']),
        ]);
    }

    public function edit(BookLoan $bookloan)
    {
        $books = Book::all();
        $users = User::all();
        return Inertia::render('BookLoans/Edit', [
            'loan' => $bookloan,
            'books' => $books,
            'users' => $users,
        ]);
    }

    public function update(Request $request, BookLoan $bookloan)
    {
        $validated = $request->validate([
            'return_date' => 'required|date',
            'book_id' => 'required|exists:books,id',
            'user_id' => 'required|exists:users,id',
        ]);

        $bookloan->update($validated);
        return redirect()->route('bookloans.show', $bookloan->id)->with('message', 'Book loan updated successfully.');
    }

    public function destroy(BookLoan $bookloan)
    {
        $bookloan->delete();
        return redirect()->route('bookloans.index')->with('message', 'Book loan deleted successfully.');
    }
}
