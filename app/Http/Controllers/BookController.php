<?php

namespace App\Http\Controllers;

use App\Http\Requests\Book\BaseBookRequest;
use App\Models\{Book, Bookcase, Campus, Category, Shelf, SubCategory, Grade, Subject};
use Illuminate\Support\Facades\{Auth, Storage, Log};
use Inertia\Inertia;
use Illuminate\Http\RedirectResponse;

class BookController extends Controller
{
    public function index()
    {
        $book_type = request()->query('type', null);

        if (!in_array($book_type, ['physical', 'ebook', 'delbook']) && $book_type !== null) {
            $book_type = 'physical';
        }

        return Inertia::render('Books/Index', [
            'books' => Book::active($book_type)->get(),
            'availableCategories' => Category::all(),
            'availableSubjects' => Subject::all(),
            'availableShelves' => Shelf::select(['id', 'code'])->get(),
            'availableSubcategories' => SubCategory::all(),
            'availableBookcases' => Bookcase::select(['id', 'code'])->get(),
            'availableCampuses' => Campus::select('id', 'name')->get(),
            'availableGrades' => Grade::all(),
            'isSuperLibrarian' => $this->isSuperLibrarian(),
            'flash' => session('flash', []),
        ]);
    }

    public function create()
    {
        if ($redirect = $this->shouldRedirectIfNotStudent()) {
            return $redirect;
        }

        return Inertia::render('Books/Create', [
            'categories' => Category::all(['id', 'name']),
            'subcategories' => SubCategory::all(['id', 'name']),
            'shelves' => $this->getShelvesForCampus(),
            'bookcases' => $this->getBookcasesForCampus(),
            'grades' => Grade::all(['id', 'name']),
            'subjects' => Subject::all(['id', 'name']),
            'type' => request('type', 'physical'),
        ]);
    }

    public function show(Book $book)
    {
        if ($this->isDeleted($book)) {
            return abort(404);
        }

        if (!$this->belongsToUserCampus($book)) {
            return abort(403, 'Unauthorized action.');
        }

        return Inertia::render('Books/Show', ['book' => $book]);
    }

    public function edit(Book $book)
    {
        abort(403, 'Unauthorized action. Temporary disabled.');

        if ($redirect = $this->shouldRedirectIfNotStudent()) {
            return $redirect;
        }

        return Inertia::render('Books/Edit', [
            'book' => $book->toArray(),
            'categories' => Category::all(['id', 'name']),
            'subcategories' => SubCategory::all(['id', 'name']),
            'shelves' => Shelf::all(['id', 'code']),
            'bookcases' => Bookcase::all(['id', 'code']),
            'grades' => Grade::all(['id', 'name']),
            'subjects' => Subject::all(['id', 'name']),
            'flash' => session('flash', []),
        ]);
    }

    public function store(BaseBookRequest $request)
    {
        $validated = $request->validated();
        $book = new Book(array_merge($validated, ['user_id' => Auth::id()]));

        try {
            if ($request->hasFile('cover') && $request->file('cover')->isValid()) {
                $allowedMimes = ['image/jpeg', 'image/png', 'image/gif'];
                if (!in_array($request->file('cover')->getMimeType(), $allowedMimes)) {
                    return redirect()->back()->with('flash', ['error' => 'Invalid cover image format.']);
                }
                Log::info('Starting cover upload to local storage', ['filename' => $request->file('cover')->getClientOriginalName()]);
                // Generate a unique filename to avoid overwriting
                $coverExtension = $request->file('cover')->getClientOriginalExtension();
                $coverFilename = 'covers/' . uniqid('cover_', true) . '.' . $coverExtension;
                $path = $request->file('cover')->storeAs('', $coverFilename, 'public');
                $book->cover = Storage::disk('public')->url($path);
                Log::info('Cover uploaded successfully', ['path' => $path, 'url' => $book->cover]);
            }

            if ($this->isEbook($validated) && $request->hasFile('pdf_url') && $request->file('pdf_url')->isValid()) {
                if ($request->file('pdf_url')->getMimeType() !== 'application/pdf') {
                    return redirect()->back()->with('flash', ['error' => 'Invalid PDF file format.']);
                }
                // Use the original filename for the PDF, sanitized to prevent security issues
                $originalPdfName = pathinfo($request->file('pdf_url')->getClientOriginalName(), PATHINFO_FILENAME);
                $pdfExtension = $request->file('pdf_url')->getClientOriginalExtension();
                // Sanitize the filename to remove invalid characters
                $sanitizedPdfName = preg_replace('/[^A-Za-z0-9\-_]/', '', $originalPdfName);
                $pdfFilename = 'pdfs/' . $sanitizedPdfName . '.' . $pdfExtension;
                // Check if file already exists to avoid overwriting
                $counter = 1;
                while (Storage::disk('public')->exists($pdfFilename)) {
                    $pdfFilename = 'pdfs/' . $sanitizedPdfName . '_' . $counter . '.' . $pdfExtension;
                    $counter++;
                }
                $path = $request->file('pdf_url')->storeAs('', $pdfFilename, 'public');
                $book->pdf_url = Storage::disk('public')->url($path);
                Log::info('PDF uploaded successfully', ['path' => $path, 'url' => $book->pdf_url]);
            }

            $book->save();

            return redirect()->route('books.index')->with('message', 'Book created successfully!');
        } catch (\Illuminate\Database\QueryException $e) {
            Log::error('Database error during book store', ['error' => $e->getMessage()]);
            return redirect()->back()->with('flash', ['error' => 'Database error: Unable to save book']);
        } catch (\Exception $e) {
            Log::error('General exception during book store', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return redirect()->back()->with('flash', ['error' => 'Book creation failed']);
        }
    }

    public function update(BaseBookRequest $request, Book $book)
    {
        $validated = $request->validated();

        $bookData = array_merge($validated, [
            'user_id' => Auth::id(),
            'is_available' => $validated['is_available'] ?? $book->is_available,
            'downloadable' => $validated['downloadable'] ?? $book->downloadable,
            'view' => $validated['view'] ?? $book->view,
        ]);

        try {
            if ($request->hasFile('cover') && $request->file('cover')->isValid()) {
                if ($book->cover) {
                    $parsedPath = parse_url($book->cover, PHP_URL_PATH);
                    if ($parsedPath) {
                        Storage::disk('public')->delete(ltrim($parsedPath, '/storage/'));
                    }
                }
                $coverExtension = $request->file('cover')->getClientOriginalExtension();
                $coverFilename = 'covers/' . uniqid('cover_', true) . '.' . $coverExtension;
                $path = $request->file('cover')->storeAs('', $coverFilename, 'public');
                $bookData['cover'] = Storage::disk('public')->url($path);
            }

            if ($this->isEbook($validated) && $request->hasFile('pdf_url') && $request->file('pdf_url')->isValid()) {
                if ($book->pdf_url) {
                    $parsedPath = parse_url($book->pdf_url, PHP_URL_PATH);
                    if ($parsedPath) {
                        Storage::disk('public')->delete(ltrim($parsedPath, '/storage/'));
                    }
                }
                $bookData['pdf_url'] = $this->storePdf($request);
            }

            $book->update($bookData);

            return redirect()->route('books.index')->with('message', 'Book updated successfully!');
        } catch (\Exception $e) {
            Log::error('General exception during book update', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return redirect()->back()->with('flash', [
                'error' => 'Book update failed: ' . $e->getMessage()
            ]);
        }
    }

    public function destroy(Book $book): RedirectResponse
    {
        return $this->handleBookOperation(function () use ($book) {
            try {
                if (!$book->is_deleted) {
                    $book->update(['is_deleted' => true]);
                    $message = 'Book deleted successfully!';
                } else {
                    if ($book->cover) {
                        $parsedPath = parse_url($book->cover, PHP_URL_PATH);
                        if ($parsedPath) {
                            Storage::disk('public')->delete(ltrim($parsedPath, '/storage/'));
                        }
                    }
                    if ($book->pdf_url) {
                        $parsedPath = parse_url($book->pdf_url, PHP_URL_PATH);
                        if ($parsedPath) {
                            Storage::disk('public')->delete(ltrim($parsedPath, '/storage/'));
                        }
                    }
                    $book->delete();
                    $message = 'Book permanently deleted!';
                }

                return redirect()->route('books.index')->with('message', $message);
            } catch (\Exception $e) {
                Log::error('General exception during book destroy', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
                return redirect()->back()->with('flash', [
                    'error' => 'Deletion failed: ' . $e->getMessage()
                ]);
            }
        }, 'delete');
    }

    private function handleBookOperation(callable $operation, string $action): RedirectResponse
    {
        try {
            return $operation();
        } catch (\Exception $e) {
            Log::error("Book operation ($action) failed", ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return redirect()->back()->with('flash', [
                'error' => "Failed to $action book: " . $e->getMessage()
            ]);
        }
    }

    // 🔁 Reusable helper methods

    protected function shouldRedirectIfNotStudent()
    {
        return Auth::check() && Auth::user()->role_id != 2
            ? redirect()->route('books.index')
            : null;
    }

    protected function isSuperLibrarian()
    {
        return Auth::check() && Auth::user()->role_id === 3;
    }

    protected function userCampusId()
    {
        return Auth::user()->campus_id;
    }

    protected function belongsToUserCampus($model)
    {
        return $model->campus_id === $this->userCampusId();
    }

    protected function isDeleted(Book $book)
    {
        return $book->is_deleted;
    }

    protected function isEbook(array $validated)
    {
        return $validated['type'] === 'ebook';
    }

    protected function storePdf($request)
    {
        try {
            $pdfFile = $request->file('pdf_url');
            $pdfExtension = $pdfFile->getClientOriginalExtension();
            $pdfFilename = 'pdfs/' . uniqid('pdf_', true) . '.' . $pdfExtension;

            Log::info('Starting PDF upload to local storage', ['filename' => $pdfFilename]);

            $path = $pdfFile->storeAs('', $pdfFilename, 'public');
            $url = Storage::disk('public')->url($path);

            Log::info('PDF uploaded successfully', ['path' => $path, 'url' => $url]);
            return $url;
        } catch (\Exception $e) {
            Log::error('Exception during PDF store', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            throw new \Exception('PDF upload failed: ' . $e->getMessage());
        }
    }

    protected function getShelvesForCampus()
    {
        return Shelf::select(['id', 'code'])
            ->where('campus_id', $this->userCampusId())
            ->get();
    }

    protected function getBookcasesForCampus()
    {
        return Bookcase::select(['id', 'code'])
            ->where('campus_id', $this->userCampusId())
            ->get();
    }
}
