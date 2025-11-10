<?php

namespace App\Http\Controllers;

use App\Http\Requests\Room\StoreRoomRequest;
use App\Http\Requests\Room\UpdateRoomRequest;
use App\Models\Campus;
use App\Models\Room;
use App\Models\Building;
use App\Models\Department;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RoomController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->get('search');
        $buildingId = $request->get('building_id');
        $departmentId = $request->get('department_id');
        $sort = $request->get('sort', 'name');
        $direction = $request->get('direction', 'asc');

        $rooms = Room::with(['building.campus', 'department'])
            ->when($search, fn($q) => $q->where('name', 'like', "%{$search}%")->orWhere('room_number', 'like', "%{$search}%"))
            ->when($buildingId, fn($q) => $q->where('building_id', $buildingId))
            ->when($departmentId, fn($q) => $q->where('department_id', $departmentId))
            ->orderBy($sort, $direction)
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Rooms/Index', [
            'rooms' => $rooms,
            'buildings' => Building::with('campus')->get(),
            'departments' => Department::all(),
            'filters' => $request->only(['search', 'building_id', 'department_id', 'sort', 'direction']),
            'isSuperLibrarian' => auth()->user()?->hasRole('super-librarian'),
            'lang' => app()->getLocale(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Rooms/Create', [
            'campuses' => Campus::all(),
            'buildings' => Building::with('campus')->get(),
            'departments' => Department::all(),
            'lang' => app()->getLocale(),
        ]);
    }

    public function store(StoreRoomRequest $request)
    {
        Room::create($request->validated());

        return redirect()->route('rooms.index')
            ->with('message', __('Room created successfully.'));
    }

    public function show(Room $room)
    {
        $room->load(['building.campus', 'department']);

        return Inertia::render('Rooms/Show', [
            'room' => $room,
            'isSuperLibrarian' => auth()->user()?->hasRole('super-librarian'),
            'lang' => app()->getLocale(),
        ]);
    }

    public function edit(Room $room)
    {
        $room->load(['building.campus', 'department']);

        return Inertia::render('Rooms/Edit', [
            'room' => $room,
            'campuses' => Campus::all(),
            'buildings' => Building::with('campus')->get(),
            'departments' => Department::all(),
            'lang' => app()->getLocale(),
        ]);
    }

    public function update(UpdateRoomRequest $request, Room $room)
    {
        $room->update($request->validated());

        return back()->with('message', __('Room updated successfully.'));
    }

    public function destroy(Room $room)
    {
        $room->delete();

        return back()->with('message', __('Room deleted.'));
    }
}
