<?php

namespace App\Http\Controllers;

use App\Http\Requests\AssetTransaction\StoreAssetTransactionRequest;
use App\Http\Requests\AssetTransaction\UpdateAssetTransactionRequest;
use App\Models\AssetTransaction;
use App\Models\Asset;
use App\Models\User;
use App\Models\Department;
use App\Models\Room;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AssetTransactionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $transactions = AssetTransaction::with([
            'asset:id,name',
            'performer:id,name',
            'fromDepartment:id,name',
            'toDepartment:id,name',
            'fromRoom:id,name',
            'toRoom:id,name',
        ])
            ->select([
                'id',
                'asset_id',
                'type',
                'from_department_id',
                'to_department_id',
                'from_room_id',
                'to_room_id',
                'performed_by',
                'performed_at',
                'note',
                'created_at',
            ])
            ->when($request->filled('search'), function ($q) use ($request) {
                $search = $request->input('search');
                $q->whereHas('asset', fn($sq) => $sq->where('name', 'like', "%{$search}%"))
                    ->orWhere('note', 'like', "%{$search}%");
            })
            ->when($request->filled('asset_id'), fn($q) => $q->where('asset_id', $request->asset_id))
            ->when($request->filled('type'), fn($q) => $q->where('type', $request->type))
            ->when($request->filled('sort'), function ($q) use ($request) {
                $q->orderBy($request->sort, $request->direction === 'desc' ? 'desc' : 'asc');
            })
            ->latest('performed_at')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('AssetTransactions/Index', [
            'assetTransactions' => $transactions,
            'assets'           => Asset::select('id', 'name')->orderBy('name')->get(),
            'filters'          => $request->only(['search', 'asset_id', 'type', 'sort', 'direction']),
            'flash'            => session('success') ? ['message' => session('success')] : null,
            'isSuperLibrarian' => auth()->user()?->hasRole('super-librarian') ?? false,
            'lang'             => app()->getLocale(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('AssetTransactions/Create', [
            'assets' => Asset::select('id', 'name')->orderBy('name')->get(),
            'users' => User::select('id', 'name')->orderBy('name')->get(),
            'departments' => Department::select('id', 'name')->orderBy('name')->get(),
            'rooms' => Room::select('id', 'name')->orderBy('name')->get(),
            'lang' => app()->getLocale(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreAssetTransactionRequest $request)
    {
        DB::transaction(function () use ($request) {
            AssetTransaction::create($request->validated());
        });

        return redirect()->route('asset-transactions.index')
            ->with('success', __('Transaction recorded successfully.'));
    }

    /**
     * Display the specified resource.
     */
    public function show(AssetTransaction $assetTransaction)
    {
        $assetTransaction->load([
            'asset',
            'fromDepartment',
            'toDepartment',
            'fromRoom',
            'toRoom',
            'performer'
        ]);

        return Inertia::render('AssetTransactions/Show', [
            'assetTransaction' => $assetTransaction,
            'lang' => app()->getLocale(),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(AssetTransaction $assetTransaction)
    {
        $assetTransaction->load([
            'asset',
            'fromDepartment',
            'toDepartment',
            'fromRoom',
            'toRoom',
            'performer'
        ]);

        return Inertia::render('AssetTransactions/Edit', [
            'assetTransaction' => $assetTransaction,
            'assets' => Asset::select('id', 'name')->orderBy('name')->get(),
            'users' => User::select('id', 'name')->orderBy('name')->get(),
            'departments' => Department::select('id', 'name')->orderBy('name')->get(),
            'rooms' => Room::select('id', 'name')->orderBy('name')->get(),
            'lang' => app()->getLocale(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAssetTransactionRequest $request, AssetTransaction $assetTransaction)
    {
        $assetTransaction->update($request->validated());

        return redirect()->route('asset-transactions.index')
            ->with('success', __('Transaction updated successfully.'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(AssetTransaction $assetTransaction)
    {
        $assetTransaction->delete();

        return redirect()->route('asset-transactions.index')
            ->with('success', __('Transaction deleted successfully.'));
    }
}
