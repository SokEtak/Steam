<?php

namespace App\Http\Controllers;

use App\Models\Bookcase;
use App\Models\Shelf;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ShelvesController extends Controller
{
    public function index()
    {
        $shelves = Shelf::with('bookcase:id,code')
            ->withCount('books')
            ->get();
        return Inertia::render('Shelves/Index', [
            'shelves' => $shelves,
        ]);
    }

    public function show(Shelf $shelf)
    {
        $shelf->load('bookcase:id,code');
        $shelf->loadCount('books');
        return Inertia::render('Shelves/Show', [
            'shelf' => $shelf,
        ]);
    }

    public function create()
    {
        $bookcases = Bookcase::select('id', 'code')->get();
        return Inertia::render('Shelves/Create', [
            'bookcases' => $bookcases,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'code' => 'required|string|max:255',
            'bookcase_id' => 'required|exists:bookcases,id',
        ]);

        Shelf::create([
            'code' => $request->code,
            'bookcase_id' => $request->bookcase_id,
        ]);

        return redirect()->route('shelves.index')->with('message', 'Shelf created successfully.');
    }

    public function edit(Shelf $shelf)
    {
        $bookcases = Bookcase::select('id', 'code')->get();
        return Inertia::render('Shelves/Edit', [
            'shelf' => $shelf,
            'bookcases' => $bookcases,
            'flash' => ['message' => session('message')],
        ]);
    }

    public function update(Request $request, Shelf $shelf)
    {
        $request->validate([
            'code' => 'required|string|max:255',
            'bookcase_id' => 'required|exists:bookcases,id',
        ]);

        $shelf->update([
            'code' => $request->code,
            'bookcase_id' => $request->bookcase_id,
        ]);

        return redirect()->route('shelves.show', $shelf->id)->with('message', 'Shelf updated successfully.');
    }
}
