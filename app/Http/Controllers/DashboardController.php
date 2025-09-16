<?php
namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\BookLoan;
use Carbon\Carbon;
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
        return Inertia::render('dashboard');
    }

    /**
     * Display the dashboard.
     */
    public function index(Request $request)
    {
        // Set the timezone to match Phnom Penh (UTC+7)
        $phnomPenhTime = Carbon::now('Asia/Phnom_Penh');

        // Determine the campus ID for the active scope based on the user's role.
        $campusId = null;
        if (Auth::user()->role_id == 2) {
            $campusId = Auth::user()->campus_id;
        }

        // Get counts for e-books and physical books using the 'active' scope
        $ebookCount = Book::active('ebook')->count();
        $physicalBookCount = Book::active('physical')->count();

        // --- Calculate trends based on today vs. yesterday ---
        $todayStart = $phnomPenhTime->copy()->startOfDay();
        $todayEnd = $phnomPenhTime->copy()->endOfDay();
        $yesterdayStart = $phnomPenhTime->copy()->subDay()->startOfDay();
        $yesterdayEnd = $phnomPenhTime->copy()->subDay()->endOfDay();

        // New books added today and yesterday
        $newBooksAddedToday = Book::active(null)->whereBetween('created_at', [$todayStart, $todayEnd])->count();
        $newBooksYesterday = Book::active(null)->whereBetween('created_at', [$yesterdayStart, $yesterdayEnd])->count();
        $newBooksChange = $this->calculatePercentageChange($newBooksAddedToday, $newBooksYesterday);

        // Books loaned today and yesterday
        $bookLoansToday = BookLoan::active($campusId)
            ->whereBetween('created_at', [$todayStart, $todayEnd])
            ->whereNull('return_date')
            ->count();
        $bookLoansYesterday = BookLoan::active($campusId)
            ->whereBetween('created_at', [$yesterdayStart, $yesterdayEnd])
            ->whereNull('return_date')
            ->count();
        $bookLoansChange = $this->calculatePercentageChange($bookLoansToday, $bookLoansYesterday);

        return Inertia::render('dashboard', [
            'bookStats' => [
                'ebookCount' => $ebookCount,
                'physicalBookCount' => $physicalBookCount,
                'bookLoansToday' => $bookLoansToday,
                'newBooksAddedToday' => $newBooksAddedToday,
                'bookLoansChange' => $bookLoansChange,
                'newBooksChange' => $newBooksChange,
            ],
        ]);
    }

    /**
     * Helper function to calculate percentage change.
     */
    private function calculatePercentageChange($current, $previous)
    {
        if ($previous == 0) {
            return $current > 0 ? '+∞%' : '0%';
        }
        $change = (($current - $previous) / $previous) * 100;
        return ($change > 0 ? '+' : '') . number_format($change, 1) . '%';
    }
}
