<?php

namespace App\Http\Controllers;

use App\Models\Supplier;
use App\Http\Requests\Supplier\StoreSupplierRequest;
use App\Http\Requests\Supplier\UpdateSupplierRequest;
use Inertia\Inertia;

class SupplierController extends Controller
{
    public function index()
    {
        return Inertia::render('Suppliers/Index', [
            'suppliers' => Supplier::paginate(10),
            'flash' => session('flash'),
        ]);
    }

    public function create()
    {
        return Inertia::render('Suppliers/Create');
    }

    public function store(StoreSupplierRequest $request)
    {
        Supplier::create($request->validated());

        return redirect()->route('suppliers.index')
            ->with('flash', ['message' => 'Supplier created successfully.']);
    }

    public function show(string $identifier)
    {
        $supplier = Supplier::where('id', $identifier)
            ->orWhere('name', $identifier)
            ->firstOrFail();

        return Inertia::render('Suppliers/Show', [
            'supplier' => $supplier,
        ]);
    }


    public function edit(Supplier $supplier)
    {
        return Inertia::render('Suppliers/Edit', [
            'supplier' => $supplier,
        ]);
    }

    public function update(UpdateSupplierRequest $request, Supplier $supplier)
    {
        $supplier->update($request->validated());

        return redirect()->route('suppliers.index')
            ->with('flash', ['message' => 'Supplier updated successfully.']);
    }

    public function destroy(Supplier $supplier)
    {
        $supplier->delete();

        return redirect()->route('suppliers.index')
            ->with('flash', ['message' => 'Supplier deleted.']);
    }
}
