<?php

namespace App\Http\Controllers;

use App\Models\File;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class FileController extends Controller
{
    public function index()
    {
        $files = File::latest()->get();
        return view('files.index', compact('files'));
    }

    public function upload(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:jpg,png,pdf',
        ]);

        $file = $request->file('file');
        $filename = time() . '_' . $file->getClientOriginalName();
        $path = $file->storeAs('uploads', $filename, 'r2');

        File::create([
            'path' => $path,
            'original_name' => $file->getClientOriginalName(),
        ]);

        return redirect()->route('files.index')->with('success', 'File uploaded successfully!');
    }

    public function show($id)
    {
        $file = File::findOrFail($id);
        $url = Storage::disk('r2')->url($file->path);
        return response()->json([
            'id' => $file->id,
            'original_name' => $file->original_name,
            'url' => $url,
        ]);
    }

    public function download($id)
    {
        $file = File::findOrFail($id);
        $filePath = $file->path;

        if (Storage::disk('r2')->exists($filePath)) {
            return Storage::disk('r2')->download($filePath, $file->original_name);
        }

        abort(404, 'File not found');
    }
}
