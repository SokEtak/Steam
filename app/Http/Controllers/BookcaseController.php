<?php

namespace App\Http\Controllers;

use App\Http\Requests\Bookcase\StoreBookcaseRequest;
use App\Models\Bookcase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class BookcaseController extends Controller
{
    public function index()
    {
        $books=Bookcase::withBookCountsAndBooks()
            ->where('campus_id', Auth::user()->campus_id)
            ->get();
        return Inertia::render('Bookcases/Index', [
            'bookcases' => $books,
        ]);
    }

    public function create()
    {
        $redirect = $this->shouldRedirect();
        if ($redirect !== true) {
            return $redirect;
        }

        return Inertia::render('Bookcases/Create');
    }

    public function store(StoreBookcaseRequest $request)
    {
        Bookcase::create($request->validated() + ['campus_id' => Auth::user()->campus_id]);
        return redirect()->route('bookcases.index')->with('message', 'Bookcase created successfully.');
    }

    public function show(Bookcase $bookcase)
    {
        $redirect = $this->shouldRedirect();
        if ($redirect !== true) {
            return $redirect;
        }

        return Inertia::render('Bookcases/Show', [
            'bookcase' => Bookcase::withBookCountsAndBooks()
                ->where('campus_id', Auth::user()->campus_id)
                ->findOrFail($bookcase->id),
            'flash' => ['message' => session('message')]
        ]);
    }

    public function edit(Bookcase $bookcase)
    {
        $redirect = $this->shouldRedirect();
        if ($redirect !== true) {
            return $redirect;
        }

        return Inertia::render('Bookcases/Edit', [
            'bookcase' => $bookcase,
            'flash' => ['message' => session('message')]
        ]);
    }

    public function update(Request $request, Bookcase $bookcase)
    {
        $bookcase->update($request->validate(['code' => 'required|string|max:255']));
        return redirect()->route('bookcases.index')->with('message', 'Bookcase updated successfully.');
    }

    public function shouldRedirect()
    {
        if (Auth::check() && Auth::user()->role_id!=2) {
            return redirect()->route('bookcases.index');
        }
        return true ;
    }
}
