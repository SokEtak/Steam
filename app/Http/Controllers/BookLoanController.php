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
            ->active($this->userCampusId())
            ->get();

        return Inertia::render('BookLoans/Index', [
            'bookloans' => $bookloans,
        ]);
    }

    public function create()
    {
        if ($redirect = $this->shouldRedirectIfNotStudent()) {
            return $redirect;
        }

        return Inertia::render('BookLoans/Create', [
            'books' => Book::active('physical')->get(),
            'users' => $this->getLoanableUsers(),
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
        if ($this->isDeleted($bookloan)) {
            return abort(404);
        }

        return Inertia::render('BookLoans/Show', [
            'loan' => $bookloan->load(['book', 'user']),
        ]);
    }

    public function edit(BookLoan $bookloan)
    {
        if ($this->isDeleted($bookloan)) {
            return abort(404);
        }

        if ($redirect = $this->shouldRedirectIfNotStudent()) {
            return $redirect;
        }

        return Inertia::render('BookLoans/Edit', [
            'loan' => $bookloan,
            'books' => Book::active(null)->get(),
            'users' => $this->getLoanableUsers(),
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
            $bookloan->is_deleted
                ? $bookloan->delete()
                : $bookloan->update(['is_deleted' => true]);

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
            return redirect()->back()->with('flash', [
                'error' => "Failed to $action book loan: " . $e->getMessage()
            ]);
        }
    }

    // 🔁 Reusable helper methods

    protected function shouldRedirectIfNotStudent()
    {
        return Auth::check() && Auth::user()->role_id != 2
            ? redirect()->route('bookloans.index')
            : null;
    }

    protected function userCampusId()
    {
        return Auth::user()->campus_id;
    }

    protected function isDeleted(BookLoan $bookloan)
    {
        return $bookloan->is_deleted === 1;
    }

    protected function getLoanableUsers()
    {
        return User::loaners($this->userCampusId())->get()->toArray();
    }
}
