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
        $bookcases = Bookcase::forCurrentCampusWithBooks()->get();

        return Inertia::render('Bookcases/Index', [
            'bookcases' => $bookcases,
        ]);
    }

    public function create()
    {
        if ($redirect = $this->shouldRedirectIfNotStudent()) {
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
        if ($redirect = $this->shouldRedirectIfNotStudent()) {
            return $redirect;
        }

        $bookcase = Bookcase::forCurrentCampusWithBooks()->findOrFail($bookcase->id);

        return Inertia::render('Bookcases/Show', [
            'bookcase' => $bookcase,
            'flash' => ['message' => session('message')],
        ]);
    }

    public function edit(Bookcase $bookcase)
    {
        if ($bookcase->campus_id !== Auth::user()->campus_id) {
            return abort(404, 'Not Found.');
        }

        if ($redirect = $this->shouldRedirectIfNotStudent()) {
            return $redirect;
        }

        return Inertia::render('Bookcases/Edit', [
            'bookcase' => $bookcase,
            'flash' => ['message' => session('message')],
        ]);
    }

    public function update(Request $request, Bookcase $bookcase)
    {
        $bookcase->update($request->validate([
            'code' => 'required|string|max:255',
        ]));

        return redirect()->route('bookcases.index')->with('message', 'Bookcase updated successfully.');
    }

    // 🔁 Reusable helper method

    protected function shouldRedirectIfNotStudent()
    {
        return Auth::check() && Auth::user()->role_id != 2
            ? redirect()->route('bookcases.index')
            : null;
    }
}
