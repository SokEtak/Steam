<?php

namespace App\Http\Controllers;

use App\Http\Requests\BookLoan\BookLoanRequest;
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
            'statuses' => ['processing', 'returned', 'canceled'], // Pass status options
        ]);
    }

    public function store(BookLoanRequest $request)
    {
        // Get validated data with extras
        $validated = $request->validatedWithExtras();

        // Create the book loan
        BookLoan::create($validated);

        // Update book availability since status is always processing
        Book::where('id', $validated['book_id'])->update(['is_available' => false]);

        return redirect()
            ->route('bookloans.index')
            ->with('message', 'Book loan created successfully.');
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
            'statuses' => ['processing', 'returned', 'canceled'], // Pass status options
        ]);
    }

    public function update(BookLoanRequest $request, BookLoan $bookloan)
    {
        $validated = $request->validatedWithExtras();

        // Update the loan including status
        $bookloan->update($validated);

        // Update book availability if loan is canceled or returned
        in_array($bookloan->status, ['canceled', 'returned']) &&
        Book::where('id', $bookloan->book_id)->update(['is_available' => true]);

        return redirect()
            ->route('bookloans.show', $bookloan)
            ->with('message', 'Book loan updated successfully.');
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
