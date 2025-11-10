<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\BookLoan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Handle the incoming request (single-action controller).
     */
    public function __invoke(Request $request): Response
    {
        // Restrict access to 'staff' or 'admin' roles
        if (!Auth::user()->hasAnyRole(['staff', 'admin'])) {
            abort(403, 'Unauthorized access to dashboard.');
        }

        // Redirect to index method for consistency
        return $this->index($request);
    }

    /**
     * Display the dashboard with book counts.
     */
    public function index(Request $request): Response
    {
        // Restrict access to 'staff' or 'admin' roles
        if (!Auth::user()->hasAnyRole(['staff', 'admin'])) {
            abort(403, 'Unauthorized access to dashboard.');
        }

        // Determine the campus ID for the active scope based on the user's pms
        $campusId = Auth::user()->hasRole('staff') ? Auth::user()->campus_id : null;

        // Get counts for e-books, physical books, missing books
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
            'roles' => Auth::user()->getRoleNames()->toArray(),
        ]);
    }
}
