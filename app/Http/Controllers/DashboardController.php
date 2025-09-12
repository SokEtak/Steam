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
        // --- End of trend calculations ---

        // Get the timeframe from the request
        $timeframe = $request->input('timeframe', 'Last 6 months');

        // Define the date range based on the timeframe
        $startDate = match ($timeframe) {
            'Last 3 months' => $phnomPenhTime->copy()->subMonths(3),
            'Last 30 days' => $phnomPenhTime->copy()->subDays(30),
            'Last 7 days' => $phnomPenhTime->copy()->subDays(7),
            'Today' => $phnomPenhTime->copy()->startOfDay(),
            default => $phnomPenhTime->copy()->subMonths(6),
        };

        // Define the grouping for the chart data
        $groupBy = match ($timeframe) {
            'Today' => 'hour',
            'Last 7 days', 'Last 30 days' => 'date',
            default => 'month',
        };

        // Fetch and prepare real data for the loan chart
        $bookLoansData = BookLoan::active($campusId)
            ->selectRaw('COUNT(*) as uv, ' . $this->getGroupByExpression($groupBy) . ' as time_unit')
            ->where('created_at', '>=', $startDate)
            ->groupBy('time_unit')
            ->orderBy('time_unit')
            ->get()
            ->map(function ($item) use ($groupBy) {
                return ['name' => $this->formatTimeUnit($item->time_unit, $groupBy), 'uv' => $item->uv];
            });

        // Fetch and prepare real data for the returns chart
        $bookReturnsData = BookLoan::active($campusId)
            ->selectRaw('COUNT(*) as uv, ' . $this->getGroupByExpression($groupBy) . ' as time_unit')
            ->where('return_date', '>=', $startDate)
            ->groupBy('time_unit')
            ->orderBy('time_unit')
            ->get()
            ->map(function ($item) use ($groupBy) {
                return ['name' => $this->formatTimeUnit($item->time_unit, $groupBy), 'uv' => $item->uv];
            });

        // Fetch and prepare data for a recent loans table
        $recentLoans = BookLoan::active($campusId)
            ->with('book', 'user')
            ->latest()
            ->take(10)
            ->get()
            ->map(function ($loan) {
                return [
                    'title' => $loan->book->title,
                    'borrower' => $loan->user->name,
                    'loan_date' => Carbon::parse($loan->created_at)->format('M d, Y'),
                    'status' => $loan->return_date ? 'Returned' : 'Loaned',
                ];
            });

        return Inertia::render('dashboard', [
            'bookStats' => [
                'ebookCount' => $ebookCount,
                'physicalBookCount' => $physicalBookCount,
                'bookLoansToday' => $bookLoansToday,
                'newBooksAddedToday' => $newBooksAddedToday,
                'bookLoansChange' => $bookLoansChange,
                'newBooksChange' => $newBooksChange,
            ],
            'bookLoansData' => $bookLoansData,
            'bookReturnsData' => $bookReturnsData,
            'recentLoans' => $recentLoans,
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

    /**
     * Helper function to get the correct SQL grouping expression.
     */
    private function getGroupByExpression($groupBy)
    {
        return match ($groupBy) {
            'hour' => 'HOUR(created_at)',
            'date' => 'DATE(created_at)',
            default => 'MONTH(created_at)',
        };
    }

    /**
     * Helper function to format the time unit for the frontend.
     */
    private function formatTimeUnit($timeUnit, $groupBy)
    {
        return match ($groupBy) {
            'hour' => "{$timeUnit}:00",
            'date' => Carbon::parse($timeUnit)->format('M d'),
            'month' => Carbon::createFromDate(null, $timeUnit, 1)->format('M'),
            default => $timeUnit,
        };
    }
}
