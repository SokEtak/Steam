<?php

namespace App\Http\Controllers;

use App\Models\{Bookcase, Shelf};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ShelvesController extends Controller
{
    public function index()
    {
        $shelves = Shelf::withActiveBooks()
            ->where('campus_id', Auth::user()->campus_id)
            ->get();

        return Inertia::render('Shelves/Index', [
            'shelves' => $shelves,
        ]);
    }

    public function create()
    {
        if ($redirect = $this->shouldRedirectIfNotStudent()) {
            return $redirect;
        }

        return Inertia::render('Shelves/Create', [
            'bookcases' => $this->getBookcasesForCampus(),
        ]);
    }

    public function show(Shelf $shelf)
    {
        if (!$this->belongsToUserCampus($shelf)) {
            return abort(404, 'Not Found');
        }

        if ($redirect = $this->shouldRedirectIfNotStudent()) {
            return $redirect;
        }

        return Inertia::render('Shelves/Show', [
            'shelf' => $shelf->loadActiveBooks(),
        ]);
    }

    public function store(Request $request)
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

    public function edit(Shelf $shelf)
    {
        if (!$this->belongsToUserCampus($shelf)) {
            return abort(404, 'Not Found');
        }

        if ($redirect = $this->shouldRedirectIfNotStudent()) {
            return $redirect;
        }

        return Inertia::render('Shelves/Edit', [
            'shelf' => $shelf,
            'bookcases' => $this->getBookcasesForCampus(),
            'flash' => ['message' => session('message')],
        ]);
    }

    public function update(Request $request, Shelf $shelf)
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

    // 🔁 Reusable helper methods

    protected function shouldRedirectIfNotStudent()
    {
        return Auth::check() && Auth::user()->role_id != 2
            ? redirect()->route('shelves.index')
            : null;
    }

    protected function belongsToUserCampus($model)
    {
        return $model->campus_id === Auth::user()->campus_id;
    }

    protected function getBookcasesForCampus()
    {
        return Bookcase::select('id', 'code')
            ->where('campus_id', Auth::user()->campus_id)
            ->get();
    }

    protected function bookcaseBelongsToUserCampus($bookcaseId)
    {
        $bookcase = Bookcase::find($bookcaseId);
        return $bookcase && $bookcase->campus_id === Auth::user()->campus_id;
    }
}
