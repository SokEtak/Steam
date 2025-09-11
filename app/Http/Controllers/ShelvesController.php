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
        $redirect = $this->shouldRedirect();
        if ($redirect !== true) {
            return $redirect;
        }
        return Inertia::render('Shelves/Create', [
            'bookcases' => Bookcase::select('id', 'code')
                ->where('campus_id', Auth::user()->campus_id)
                ->get(),
        ]);
    }
    public function show(Shelf $shelf)
    {
        $redirect = $this->shouldRedirect();
        if ($redirect !== true) {
            return $redirect;
        }

        return Inertia::render('Shelves/Show', [
            'shelf' => $shelf->loadActiveBooks(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:255',
            'bookcase_id' => [
                'required',
                'exists:bookcases,id',
                function ($attribute, $value, $fail) {
                    $bookcase = Bookcase::find($value);
                    if ($bookcase && $bookcase->campus_id !== Auth::user()->campus_id) {
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
        return Inertia::render('Shelves/Edit', [
            'shelf' => $shelf,
            'bookcases' => Bookcase::select('id', 'code')
                ->where('campus_id', Auth::user()->campus_id)
                ->get(),
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
                    $bookcase = Bookcase::find($value);
                    if ($bookcase && $bookcase->campus_id !== Auth::user()->campus_id) {
                        $fail('The selected bookcase does not belong to your campus.');
                    }
                },
            ],
        ]);

        $shelf->update($validated);
        return redirect()->route('shelves.show', $shelf->id)->with('message', 'Shelf updated successfully.');
    }

    public function shouldRedirect()
    {
        if (Auth::check() && Auth::user()->role_id!=2) {
            return redirect()->route('bookcases.index');
        }
        return true ;
    }

}
