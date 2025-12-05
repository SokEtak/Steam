<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\BookLoan;
use App\Models\Asset;
use App\Models\School;
use App\Models\Room;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function __invoke(Request $request)
    {
        if (!Auth::user()->hasAnyRole(['staff', 'admin'])) {
            abort(403);
        }

        return $this->index($request);
    }

    public function index(Request $request)
    {
        $user     = Auth::user();
        $isAdmin  = $user->hasRole('admin');
        $campusId = $user->hasRole('staff') ? $user->campus_id : null;

        // ===================================================================
        // 1. BOOK STATS
        // ===================================================================
        $booksQuery = Book::where('is_deleted', 0)
            ->when($campusId, fn($q) => $q->where('campus_id', $campusId));

        $ebookCount        = (clone $booksQuery)->where('type', 'ebook')->count();
        $physicalBookCount = (clone $booksQuery)->where('type', 'physical')->count();
        $missingBookCount  = (clone $booksQuery)
            ->where('type', 'physical')
            ->where('is_available', false)
            ->count();

        // ===================================================================
        // 2. LOAN STATS – matches your real table
        // ===================================================================
        // Currently borrowed = due date is today or in the future
        $activeLoansQuery = BookLoan::where('is_deleted', 0)
            ->where('return_date', '>=', Carbon::today())
            ->when($campusId, fn($q) => $q->where('campus_id', $campusId));

        $bookLoansCount = $activeLoansQuery->count();

        // Overdue = due date is in the past
        $overdueLoansCount = BookLoan::where('is_deleted', 0)
            ->where('return_date', '<', Carbon::today())
            ->when($campusId, fn($q) => $q->where('campus_id', $campusId))
            ->count();

        // ===================================================================
        // 3. OTHER STATS
        // ===================================================================
        $totalAssets = Asset::when($campusId, fn($q) => $q->where('campus_id', $campusId))->count();
        $totalRooms  = Room::when($campusId, fn($q) => $q->where('campus_id', $campusId))->count();
        $totalSchools = School::count();

        // ===================================================================
        // 4. RETURN TO DASHBOARD
        // ===================================================================
        return Inertia::render('dashboard', [
            'auth' => [
                'user' => [
                    'name'  => $user->name,
                    'email' => $user->email,
                    'roles' => $user->getRoleNames()->toArray(),
                ],
            ],
            'bookStats' => [
                'ebookCount'         => $ebookCount,
                'physicalBookCount'  => $physicalBookCount,
                'missingBookCount'   => $missingBookCount,
                'bookLoansCount'     => $bookLoansCount,
                'overdueLoansCount'  => $overdueLoansCount,
            ],
            'assetStats' => [
                'totalAssets' => $totalAssets,
            ],
            'schoolStats' => [
                'totalSchools' => $totalSchools,
                'totalRooms'   => $totalRooms,
            ],
            'userStats' => [
                'totalUsers' => $isAdmin ? User::count() : 0,
            ],
        ]);
    }
}
