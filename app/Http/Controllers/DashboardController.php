<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\BookLoan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        // Restrict access to role_id = 2 or 3
        if (!in_array(Auth::user()->role_id, [2, 3])) {
            abort(403, 'Unauthorized access to dashboard.');
        }
        return Inertia::render('dashboard');
    }

    /**
     * Display the dashboard with book counts.
     */
    public function index(Request $request)
    {
        // Restrict access to role_id = 2 or 3 or other role that can access
        if (!in_array(Auth::user()->role_id, [2, 3])) {
            abort(403, 'Unauthorized access to dashboard.');
        }

        // Determine the campus ID for the active scope based on the user's role
        $campusId = Auth::user()->role_id == 2 ? Auth::user()->campus_id : null;

        // Get counts for e-books, physical books, missing books, and deleted books
        $ebookCount = Book::active('ebook')->count();
        $physicalBookCount = Book::active('physical')->count();
        $missingBookCount = Book::active('miss')->count();

        // Get count of books currently on loan (status = processing)
        $bookLoansCount = BookLoan::active($campusId)
            ->where('status', 'processing')
            ->count();

        return Inertia::render('dashboard', [
            'bookStats' => [
                'ebookCount' => $ebookCount,
                'physicalBookCount' => $physicalBookCount,
                'missingBookCount' => $missingBookCount,
                'bookLoansCount' => $bookLoansCount,
            ],
            'role_id' => Auth::user()->role_id,
        ]);
    }
}
