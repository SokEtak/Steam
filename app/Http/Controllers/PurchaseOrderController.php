<?php

namespace App\Http\Controllers;

use App\Http\Requests\PurchaseOrder\StorePurchaseOrderRequest;
use App\Http\Requests\PurchaseOrder\UpdatePurchaseOrderRequest;
use App\Models\PurchaseOrder;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PurchaseOrderController extends Controller
{
    public function index(Request $request)
    {
        $query = PurchaseOrder::with(['supplier', 'creator'])
            ->when($request->search, fn($q) => $q->where('po_number', 'like', "%{$request->search}%"))
            ->when($request->status, fn($q) => $q->where('status', $request->status))
            ->when($request->sort, fn($q) => $q->orderBy($request->sort, $request->direction ?? 'asc'))
            ->paginate(15);

        return Inertia::render('PurchaseOrders/Index', [
            'purchaseOrders' => $query,
            'filters' => $request->only(['search', 'status', 'sort', 'direction']),
        ]);
    }

    public function create()
    {
        return Inertia::render('PurchaseOrders/Create', [
            'suppliers' => Supplier::select('id', 'name')->get(),
        ]);
    }

    public function store(StorePurchaseOrderRequest $request)
    {
        $validated = $request->validated();
        $validated['created_by'] = auth()->id();

        $po = PurchaseOrder::create($validated);

        return redirect()->route('purchase-orders.show', $po)
            ->with('message', 'Purchase order created successfully.');
    }

    public function show(string $identifier)
    {
        $purchaseOrder = PurchaseOrder::where('id', $identifier)
            ->orWhere('po_number', $identifier)
            ->firstOrFail();

        $purchaseOrder->load(['supplier', 'creator']);

        return Inertia::render('PurchaseOrders/Show', [
            'purchaseOrder' => $purchaseOrder,
        ]);
    }


    public function edit(PurchaseOrder $purchaseOrder)
    {
//        dd($purchaseOrder->toArray());
        $purchaseOrder->load('supplier');
        return Inertia::render('PurchaseOrders/Edit', [
            'purchase_order' => $purchaseOrder,
            'suppliers' => Supplier::select('id', 'name')->get(),
        ]);
    }

    public function update(UpdatePurchaseOrderRequest $request, PurchaseOrder $purchaseOrder)
    {
        $purchaseOrder->update($request->validated());

        return redirect()->route('purchase-orders.show', $purchaseOrder)
            ->with('message', 'Purchase order updated successfully.');
    }

    public function destroy(PurchaseOrder $purchaseOrder)
    {
        $purchaseOrder->delete();

        return redirect()->route('purchase-orders.index')
            ->with('message', 'Purchase order deleted.');
    }
}
