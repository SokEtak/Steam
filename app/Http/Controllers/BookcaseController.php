<?php

namespace App\Http\Controllers;

use App\Http\Requests\Bookcase\StoreBookcaseRequest;
use App\Models\Bookcase;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BookcaseController extends Controller
{
    public function index()
    {
        $bookcases = Bookcase::withCount('books')->get(['id', 'code']);

        return Inertia::render('Bookcases/Index', [
            'bookcases' => $bookcases,
        ]);
    }

    public function create()
    {
        return Inertia::render('Bookcases/Create');
    }

    public function store(StoreBookcaseRequest $request)
    {
        Bookcase::create($request->validated());

        return redirect()->route('bookcases.index')->with('message', 'Bookcase created successfully.');
    }

    public function show(Bookcase $bookcase)
    {
        $bookcase->load('books:id,title,code,isbn,view,is_available');
        return Inertia::render('Bookcases/Show', [
            'bookcase' => $bookcase,
        ]);
    }

    public function edit(Bookcase $bookcase)
    {
        return Inertia::render('Bookcases/Edit', [
            'bookcase' => $bookcase,
            'flash' => ['message' => session('message')],
        ]);
    }

    public function update(Request $request, Bookcase $bookcase)
    {
        $request->validate([
            'code' => 'required|string|max:255',
        ]);

        $bookcase->update([
            'code' => $request->code,
        ]);

        return redirect()->route('bookcases.index', $bookcase->id)->with('message', 'Bookcase updated successfully.');
    }
}
