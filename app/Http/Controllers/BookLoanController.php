<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\BookLoan;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class BookLoanController extends Controller
{
    public function index()
    {
        $bookloans = BookLoan::with(['book', 'user'])
            ->active()
            ->get();
        return Inertia::render('BookLoans/Index', [
            'bookloans' => $bookloans,
        ]);
    }

    public function create()
    {
        $campus_id = Auth::user()->campus_id;
        return Inertia::render('BookLoans/Create', [
            'books' => Book::active(null)->get(),
            'users' => User::loaners(2,$campus_id)->get()->toArray()
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
        $campus_id = Auth::user()->campus_id;
        $books = Book::active(null)->get();
        $users = User::loaners(2,$campus_id)->get()->toArray();
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
        return $this->handleBookLoanOperation(function () use ($bookloan) {
            if (!$bookloan->is_deleted) {
                // Soft delete: set is_deleted to true
                $bookloan->update(['is_deleted' => true]);
            } else {
                // Hard delete: permanently remove the record
                $bookloan->delete();
            }

            return redirect()
                ->route('bookloans.index')
                ->with('message', 'Book loan deleted successfully.');
        }, 'delete');
    }

    private function handleBookLoanOperation(callable $operation, string $action): RedirectResponse
    {
        try {
            return $operation();
        } catch (\Exception $e) {
            return redirect()->back()->with('flash', ['error' => "Failed to $action book loan: " . $e->getMessage()]);
        }
    }
}
