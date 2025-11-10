<?php

namespace App\Http\Controllers;

use App\Models\{Bookcase, Shelf};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Http\RedirectResponse;

class ShelvesController extends Controller
{
    /**
     * Display a listing of shelves.
     */
    public function index()
    {
        $shelves = Shelf::forCurrentCampusWithActiveBooks()->get();

        return Inertia::render('Shelves/Index', [
            'shelves' => $shelves,
        ]);
    }

    /**
     * Show the form for creating a new shelf.
     */
    public function create()
    {
        if ($redirect = $this->shouldRedirectIfNotStaff()) {
            return $redirect;
        }

        return Inertia::render('Shelves/Create', [
            'bookcases' => $this->getBookcasesForCampus(),
        ]);
    }

    /**
     * Display the specified shelf.
     */
    public function show(Shelf $shelf)
    {
        if (!$this->belongsToUserCampus($shelf)) {
            return abort(404, 'Not Found');
        }

        if ($redirect = $this->shouldRedirectIfNotStaff()) {
            return $redirect;
        }

        $shelf->loadActiveBooks();

        return Inertia::render('Shelves/Show', [
            'shelf' => $shelf,
        ]);
    }

    /**
     * Store a newly created shelf.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'code' => 'required|string|max:10',
            'bookcase_id' => [
                'required',
                'exists:bookcases,id',
                function ($attribute, $value, $fail) {
                    if (!$this->bookcaseBelongsToUserCampus($value)) {
                        $fail('The selected bookcase does not belong to your campus.');
                    }
                },
            ],
        ]);

        Shelf::create($validated + ['campus_id' => Auth::user()->campus_id]);

        return redirect()->route('shelves.index')->with('message', 'Shelf created successfully.');
    }

    /**
     * Show the form for editing a shelf.
     */
    public function edit(Shelf $shelf)
    {
        if (!$this->belongsToUserCampus($shelf)) {
            return abort(404, 'Not Found');
        }

        if ($redirect = $this->shouldRedirectIfNotStaff()) {
            return $redirect;
        }

        return Inertia::render('Shelves/Edit', [
            'shelf' => $shelf,
            'bookcases' => $this->getBookcasesForCampus(),
            'flash' => ['message' => session('message')],
        ]);
    }

    /**
     * Update the specified shelf.
     */
    public function update(Request $request, Shelf $shelf): RedirectResponse
    {
        $validated = $request->validate([
            'code' => 'required|string|max:255',
            'bookcase_id' => [
                'required',
                'exists:bookcases,id',
                function ($attribute, $value, $fail) {
                    if (!$this->bookcaseBelongsToUserCampus($value)) {
                        $fail('The selected bookcase does not belong to your campus.');
                    }
                },
            ],
        ]);

        $shelf->update($validated);

        return redirect()->route('shelves.show', $shelf->id)->with('message', 'Shelf updated successfully.');
    }

    /**
     * Redirect if the user is not a staff member.
     */
    protected function shouldRedirectIfNotStaff(): ?RedirectResponse
    {
        return Auth::check() && !Auth::user()->hasRole('staff')
            ? redirect()->route('shelves.index')
            : null;
    }

    /**
     * Check if the model belongs to the user's campus.
     */
    protected function belongsToUserCampus($model): bool
    {
        return $model->campus_id === Auth::user()->campus_id;
    }

    /**
     * Get bookcases for the user's campus.
     */
    protected function getBookcasesForCampus()
    {
        return Bookcase::select('id', 'code')
            ->where('campus_id', Auth::user()->campus_id)
            ->get();
    }

    /**
     * Check if the bookcase belongs to the user's campus.
     */
    protected function bookcaseBelongsToUserCampus($bookcaseId): bool
    {
        $bookcase = Bookcase::find($bookcaseId);
        return $bookcase && $bookcase->campus_id === Auth::user()->campus_id;
    }
}
