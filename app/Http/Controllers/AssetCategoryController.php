<?php

namespace App\Http\Controllers;

use App\Http\Requests\AssetCategory\StoreAssetCategoryRequest;
use App\Http\Requests\AssetCategory\UpdateAssetCategoryRequest;
use App\Models\AssetCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AssetCategoryController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->get('search');
        $sort = $request->get('sort', 'name');
        $direction = $request->get('direction', 'asc');

        $categories = AssetCategory::query()
            ->when($search, fn($q) => $q->where('name', 'like', "%{$search}%"))
            ->orderBy($sort, $direction)
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('AssetCategories/Index', [
            'assetCategories' => $categories,
            'filters' => $request->only(['search', 'sort', 'direction']),
            'lang' => app()->getLocale(),
        ]);
    }

    public function create()
    {
        return Inertia::render('AssetCategories/Create', [
            'lang' => app()->getLocale(),
        ]);
    }

    public function store(StoreAssetCategoryRequest $request)
    {
        AssetCategory::create($request->validated());

        return redirect()->route('asset-categories.index')
            ->with('message', 'ប្រភេទទ្រព្យត្រូវបានបង្កើតដោយជោគជ័យ។');
    }

    public function show(AssetCategory $assetCategory)
    {
        return Inertia::render('AssetCategories/Show', [
            'assetCategory' => $assetCategory,
            'lang' => app()->getLocale(),
        ]);
    }

    public function edit(AssetCategory $assetCategory)
    {
        return Inertia::render('AssetCategories/Edit', [
            'assetCategory' => $assetCategory,
            'lang' => app()->getLocale(),
        ]);
    }

    public function update(UpdateAssetCategoryRequest $request, AssetCategory $assetCategory)
    {
        $assetCategory->update($request->validated());

        return back()->with('message', 'ប្រភេទទ្រព្យត្រូវបានកែប្រែដោយជោគជ័យ។');
    }

    public function destroy(AssetCategory $assetCategory)
    {
        $assetCategory->delete();

        return back()->with('message', 'ប្រភេទទ្រព្យត្រូវបានលុប។');
    }
}
