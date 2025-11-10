<?php

namespace App\Http\Controllers;

use App\Http\Requests\BuildingRequest;
use App\Models\Building;
use App\Models\Campus;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;

class BuildingController extends Controller
{
    public function index()
    {
        $buildings = Building::with('campus')
            ->select('id', 'campus_id', 'name', 'code', 'floors')
            ->orderBy('name')
            ->paginate(10);

        return Inertia::render('Buildings/Index', [
            'buildings'        => $buildings,
            'flash'            => session('flash'),
            'isSuperLibrarian' => auth()->user()?->hasRole('super-librarian') ?? false,
            'lang'             => app()->getLocale(),
        ]);
    }

    public function create()
    {
        $campuses = Campus::select('id', 'name')->orderBy('name')->get();

        return Inertia::render('Buildings/Create', [
            'campuses'         => $campuses,
            'isSuperLibrarian' => auth()->user()?->hasRole('super-librarian') ?? false,
            'lang'             => app()->getLocale(),
        ]);
    }

    public function store(BuildingRequest $request)
    {
        Building::create($request->validated());

        return Redirect::route('buildings.index')
            ->with('flash', ['message' => 'Building created successfully.', 'type' => 'success']);
    }

    public function show(Building $building)
    {
        $building->load('campus');

        return Inertia::render('Buildings/Show', [
            'building'         => $building,
            'isSuperLibrarian' => auth()->user()?->hasRole('super-librarian') ?? false,
            'lang'             => app()->getLocale(),
        ]);
    }

    public function edit(Building $building)
    {
        $building->load('campus');
        $campuses = Campus::select('id', 'name')->orderBy('name')->get();

        return Inertia::render('Buildings/Edit', [
            'building'         => $building,
            'campuses'         => $campuses,
            'isSuperLibrarian' => auth()->user()?->hasRole('super-librarian') ?? false,
            'lang'             => app()->getLocale(),
        ]);
    }

    public function update(BuildingRequest $request, Building $building)
    {
        $building->update($request->validated());

        return Redirect::route('buildings.index')
            ->with('flash', ['message' => 'Building updated successfully.', 'type' => 'success']);
    }

    public function destroy(Building $building)
    {
        $building->delete();

        return Redirect::route('buildings.index')
            ->with('flash', ['message' => 'Building deleted successfully.', 'type' => 'success']);
    }
}
