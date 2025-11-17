<?php

namespace App\Http\Controllers;

use App\Http\Requests\Asset\StoreAssetRequest;
use App\Http\Requests\Asset\UpdateAssetRequest;
use App\Models\Asset;
use App\Models\AssetCategory;
use App\Models\AssetSubCategory;
use App\Models\Department;
use App\Models\PurchaseOrder;
use App\Models\Room;
use App\Models\User;
use App\Models\Supplier;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class AssetController extends Controller
{
    public function index(): Response
    {
        $assets = Asset::with([
            'category',
            'subCategory',
            'department',
            'room',
            'custodian',
            'purchaseOrder'
        ])
            ->orderByDesc('id')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Assets/Index', [
            'assets' => $assets,
            'filters' => request()->all('search', 'status', 'category_id'),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Assets/Create', [
            'categories'   => AssetCategory::select('id', 'name')->get(),
            'subcategories' => AssetSubCategory::select('id', 'name', 'asset_category_id')->get(),
            'suppliers'    => Supplier::select('id', 'name')->get(),
            'departments'  => Department::select('id', 'name')->get(),
            'rooms'        => Room::select('id', 'name')->get(),
            'users'        => User::select('id', 'name')->get(),
            'purchaseOrders' => PurchaseOrder::with('supplier:id,name')
                ->get(['id', 'po_number', 'supplier_id']),
        ]);
    }


    public function store(StoreAssetRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        try {
            $data = $validated;

            // Handle image upload (same logic as Book cover)
            if ($request->hasFile('image') && $request->file('image')->isValid()) {
                $imageFile = $request->file('image');
                $allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

                if (!in_array($imageFile->getMimeType(), $allowedMimes)) {
                    return redirect()->back()->with('flash', [
                        'error' => 'Invalid image format. Only JPEG, PNG, WEBP, or GIF allowed.'
                    ]);
                }

                $extension = $imageFile->getClientOriginalExtension();
                $assetTag = $validated['asset_tag'];
                $sanitizedTag = preg_replace('/[^A-Za-z0-9\-_]/', '', $assetTag);

                $filename = "assets/{$sanitizedTag}.{$extension}";
                $counter = 1;

                // Avoid filename collision
                while (Storage::disk('public')->exists($filename)) {
                    $filename = "assets/{$sanitizedTag}({$counter}).{$extension}";
                    $counter++;
                }

                $path = $imageFile->storeAs('', $filename, 'public');

                if (!$path) {
                    Log::error('Failed to store asset image', ['filename' => $filename]);
                    return redirect()->back()->with('flash', ['error' => 'Failed to upload image.']);
                }

                $data['image'] = Storage::disk('public')->url($path);
                Log::info('Asset image uploaded', ['asset_tag' => $assetTag, 'url' => $data['image']]);
            }

            // Create asset
            Asset::create($data);

            $locale = app()->getLocale();
            $message = $locale === 'kh'
                ? 'ទ្រព្យសម្បត្តិត្រូវបានបង្កើតដោយជោគជ័យ!'
                : 'Asset created successfully!';

            return redirect()->route('assets.index')->with('flash', ['message' => $message]);

        } catch (\Illuminate\Database\QueryException $e) {
            Log::error('Database error creating asset', [
                'error' => $e->getMessage(),
                'asset_tag' => $validated['asset_tag'] ?? null,
            ]);

            $error = str_contains($e->getMessage(), 'assets_asset_tag_unique')
                ? 'Asset Tag already exists. Please use a unique tag.'
                : 'Failed to create asset. Please try again.';

            return redirect()->back()->with('flash', ['error' => $error]);

        } catch (\Exception $e) {
            Log::error('Unexpected error creating asset', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return redirect()->back()->with('flash', ['error' => 'Something went wrong. Please try again.']);
        }
    }

    public function show(Asset $asset): Response
    {
//        dd($asset->toArray());
        $asset->load([
            'category', 'subCategory', 'purchaseOrder', 'supplier',
            'department', 'room', 'custodian',
        ]);

        return Inertia::render('Assets/Show', [
            'asset' => $asset,
        ]);
    }

    public function edit(Asset $asset): Response
    {
        $asset->load([
            'category', 'subCategory', 'purchaseOrder', 'supplier',
            'department', 'room', 'custodian','purchaseOrder'
        ]);

        return Inertia::render('Assets/Edit', [
            'asset' => $asset,
            'categories'    => AssetCategory::select('id', 'name')->get(),
            'subcategories' => AssetSubCategory::select('id', 'name', 'asset_category_id')->get(),
            'suppliers'     => Supplier::select('id', 'name')->get(),
            'departments'   => Department::select('id', 'name')->get(),
            'rooms'         => Room::select('id', 'name')->get(),
            'users'         => User::select('id', 'name')->get(),
            PurchaseOrder::with('supplier:id,name')
                ->select('id', 'po_number', 'supplier_id')
                ->get()
        ]);
    }

    public function update(UpdateAssetRequest $request, Asset $asset): RedirectResponse
    {
        $data = $request->validated();

        if ($request->hasFile('image') && $request->file('image')->isValid()) {
            // Delete old image if exists
            if ($asset->image) {
                $oldPath = str_replace('/storage/', 'public/', $asset->image);
                if (Storage::exists($oldPath)) {
                    Storage::delete($oldPath);
                }
            }

            // Same upload logic as store()
            $imageFile = $request->file('image');
            $allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
            if (!in_array($imageFile->getMimeType(), $allowedMimes)) {
                return back()->with('flash', ['error' => 'Invalid image format.']);
            }

            $extension = $imageFile->getClientOriginalExtension();
            $sanitizedTag = preg_replace('/[^A-Za-z0-9\-_]/', '', $validated['asset_tag']);
            $filename = "assets/{$sanitizedTag}.{$extension}";
            $counter = 1;
            while (Storage::disk('public')->exists($filename)) {
                $filename = "assets/{$sanitizedTag}({$counter}).{$extension}";
                $counter++;
            }

            $path = $imageFile->storeAs('', $filename, 'public');
            $validated['image'] = Storage::disk('public')->url($path);
        } else {
            // Keep existing image if no new file
            $validated['image'] = $asset->image;
        }

        $asset->update($data);

        return redirect()->route('assets.index')
            ->with('success', 'Asset updated successfully.');
    }

    public function destroy(Asset $asset): RedirectResponse
    {
        $asset->delete();

        return redirect()->route('assets.index')
            ->with('success', 'Asset deleted successfully.');
    }
}
