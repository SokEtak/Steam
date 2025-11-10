<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\Campus;
use App\Models\Building;
use App\Models\User;
use App\Http\Requests\StoreDepartmentRequest;
use App\Http\Requests\UpdateDepartmentRequest;
use Inertia\Inertia;

class DepartmentController extends Controller
{
    public function index()
    {
        $departments = Department::with(['campus', 'building', 'head'])
            ->paginate(15);

        return Inertia::render('Departments/Index', [
            'departments' => $departments,
//            'isSuperLibrarian' => auth()->user()?,
        ]);
    }

    public function create()
    {
        return Inertia::render('Departments/Create', [
            'campuses' => Campus::select('id', 'name')->get(),
            'buildings' => Building::select('id', 'name', 'campus_id')->get(),
            'users' => User::whereHas('roles', function ($query) {
                $query->where('name', '!=', 'regular-user');
            })->select('id', 'name')->get(),
        ]);
    }

    public function store(StoreDepartmentRequest $request)
    {
        Department::create($request->validated());

        return redirect()->route('departments.index')
            ->with('flash.message', __('Department created successfully.'));
    }

    public function show(Department $department)
    {
        $department->load(['campus', 'building', 'head']);

        return Inertia::render('Departments/Show', [
            'department' => $department,
//            'isSuperLibrarian' => auth()->user(),
        ]);
    }

    public function edit(Department $department)
    {
        $department->load(['campus', 'building', 'head']);

        return Inertia::render('Departments/Edit', [
            'department' => $department,
            'campuses' => Campus::select('id', 'name')->get(),
            'buildings' => Building::select('id', 'name', 'campus_id')->get(),
            'users' => User::whereHas('roles', function ($query) {
                $query->where('name', '!=', 'regular-user');
            })->select('id', 'name')->get(),
        ]);
    }

    public function update(UpdateDepartmentRequest $request, Department $department)
    {
        $department->update($request->validated());

        return redirect()->route('departments.index')
            ->with('flash.message', __('Department updated successfully.'));
    }

    public function destroy(Department $department)
    {
        $department->delete();

        return back()->with('flash.message', __('Department deleted.'));
    }
}
