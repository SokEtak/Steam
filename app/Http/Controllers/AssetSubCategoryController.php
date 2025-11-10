<?php

namespace App\Http\Controllers;

use App\Http\Request\AssetSubCategory\StoreAssetSubCategoryRequest;
use App\Http\Requests\AssetSubCategory\UpdateAssetSubCategoryRequest;
use App\Models\AssetCategory;
use App\Models\AssetSubCategory;
use Inertia\Inertia;
use Illuminate\Http\Request;

class AssetSubCategoryController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->get('search');
        $categoryId = $request->get('asset_category_id');
        $sort = $request->get('sort', 'name');
        $direction = $request->get('direction', 'asc');

        $subCategories = AssetSubCategory::with('assetCategory')
            ->when($search, fn($q) => $q->where('name', 'like', "%{$search}%"))
            ->when($categoryId, fn($q) => $q->where('asset_category_id', $categoryId))
            ->orderBy($sort, $direction)
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('AssetSubCategories/Index', [
            'assetSubCategories' => $subCategories,
            'assetCategories' => AssetCategory::orderBy('name')->get(),
            'filters' => $request->only(['search', 'asset_category_id', 'sort', 'direction']),
            'flash' => session('flash'),
            'isSuperLibrarian' => auth()->user()?->hasRole('super-librarian'),
            'lang' => app()->getLocale(),
        ]);
    }

    public function create()
    {
        return Inertia::render('AssetSubCategories/Create', [
            'assetCategories' => AssetCategory::orderBy('name')->get(),
            'lang' => app()->getLocale(),
        ]);
    }

    public function store(StoreAssetSubCategoryRequest $request)
    {
        AssetSubCategory::create($request->validated());

        return redirect()->route('asset-sub-categories.index')
            ->with('flash', ['message' => 'Sub-category created successfully']);
    }

    public function show(AssetSubCategory $assetSubCategory)
    {
        $assetSubCategory->load('assetCategory');

        return Inertia::render('AssetSubCategories/Show', [
            'assetSubCategory' => $assetSubCategory,
            'lang' => app()->getLocale(),
        ]);
    }

    public function edit(AssetSubCategory $assetSubCategory)
    {
        $assetSubCategory->load('assetCategory');

        return Inertia::render('AssetSubCategories/Edit', [
            'assetSubCategory' => $assetSubCategory,
            'assetCategories' => AssetCategory::orderBy('name')->get(),
            'lang' => app()->getLocale(),
        ]);
    }

    public function update(UpdateAssetSubCategoryRequest $request, AssetSubCategory $assetSubCategory)
    {
        $assetSubCategory->update($request->validated());

        return redirect()->route('asset-sub-categories.index')
            ->with('flash', ['message' => 'Sub-category updated successfully']);
    }

    public function destroy(AssetSubCategory $assetSubCategory)
    {
        $assetSubCategory->delete();

        return back()->with('flash', ['message' => 'Sub-category deleted']);
    }
}
