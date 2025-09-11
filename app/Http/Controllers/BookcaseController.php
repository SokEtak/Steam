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
        $bookcases = Bookcase::withBookCountsAndBooks()
            ->where('campus_id', $this->userCampusId())
            ->get();

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
        Bookcase::create($request->validated() + ['campus_id' => $this->userCampusId()]);
        return redirect()->route('bookcases.index')->with('message', 'Bookcase created successfully.');
    }

    public function show(Bookcase $bookcase)
    {
        if ($redirect = $this->shouldRedirectIfNotStudent()) {
            return $redirect;
        }

        $bookcase = Bookcase::withBookCountsAndBooks()
            ->where('campus_id', $this->userCampusId())
            ->findOrFail($bookcase->id);

        return Inertia::render('Bookcases/Show', [
            'bookcase' => $bookcase,
            'flash' => ['message' => session('message')],
        ]);
    }

    public function edit(Bookcase $bookcase)
    {
        if (!$this->belongsToUserCampus($bookcase)) {
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

    // 🔁 Reusable helper methods

    protected function shouldRedirectIfNotStudent()
    {
        return Auth::check() && Auth::user()->role_id != 2
            ? redirect()->route('bookcases.index')
            : null;
    }

    protected function belongsToUserCampus($model)
    {
        return $model->campus_id === $this->userCampusId();
    }

    protected function userCampusId()
    {
        return Auth::user()->campus_id;
    }
}
