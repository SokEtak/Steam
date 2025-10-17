<?php

namespace App\Http\Controllers;

use App\Http\Requests\Book\StoreBookRequest;
use App\Http\Requests\Book\UpdateBookRequest;
use App\Models\{Book, Bookcase, Campus, Category, Shelf, SubCategory, Grade, Subject};
use Illuminate\Support\Facades\{Auth, Storage, Log};
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Http\RedirectResponse;

class BookController extends Controller
{
    public function index(Request $request)
    {
        $book_type = request()->query('type', null);

        // Allow 'miss' and 'delBook' as valid book_types
        if (!in_array($book_type, ['physical', 'ebook', 'miss', 'delBook']) && $book_type !== null) {
            $book_type = null; // Default to null to fetch all non-deleted books
        }
        //sort desc to see the newest created book
        $books = Book::active($book_type)->orderByDesc('created_at')->get();

        return Inertia::render('Books/Index', [
            'books' => $books,
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

    public function create(Request $request)
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
            'lang' => $request->query('lang', 'en'),
        ]);
    }

    public function store(StoreBookRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $book = new Book(array_merge($validated, ['user_id' => Auth::id()]));

        try {
            // Handle cover upload
            if ($request->hasFile('cover') && $request->file('cover')->isValid()) {
                $coverFile = $request->file('cover');
                $allowedMimes = ['image/jpeg', 'image/png'];

                if (!in_array($coverFile->getMimeType(), $allowedMimes)) {
                    Log::warning('Invalid cover image format', [
                        'mime' => $coverFile->getMimeType(),
                        'filename' => $coverFile->getClientOriginalName(),
                    ]);
                    return redirect()->back()->with('flash', ['error' => 'Invalid cover image format. Only JPEG or PNG allowed.']);
                }

                $coverExtension = $coverFile->getClientOriginalExtension();

                // ✅ Use book code instead of title
                $bookCode = $validated['code'];
                $sanitizedCode = preg_replace('/[^A-Za-z0-9\-_]/', '', $bookCode);

                $coverFilename = 'covers/' . $sanitizedCode . '.' . $coverExtension;
                $counter = 1;

                while (Storage::disk('public')->exists($coverFilename)) {
                    $coverFilename = 'covers/' . $sanitizedCode . '(' . $counter . ').' . $coverExtension;
                    $counter++;
                }

                $coverPath = $coverFile->storeAs('', $coverFilename, 'public');
                if (!$coverPath) {
                    Log::error('Failed to store cover image', ['filename' => $coverFilename]);
                    return redirect()->back()->with('flash', ['error' => 'Failed to store cover image.']);
                }

                $book->cover = Storage::disk('public')->url($coverPath);
                Log::info('Cover uploaded successfully', ['path' => $coverPath, 'url' => $book->cover]);
            }

            // Handle PDF upload (optional for e-books)
            if ($this->isEbook($validated) && $request->hasFile('pdf_url') && $request->file('pdf_url')->isValid()) {
                $pdfFile = $request->file('pdf_url');

                if ($pdfFile->getMimeType() !== 'application/pdf') {
                    Log::warning('Invalid PDF file format', [
                        'mime' => $pdfFile->getMimeType(),
                        'filename' => $pdfFile->getClientOriginalName(),
                    ]);
                    return redirect()->back()->with('flash', ['error' => 'Invalid PDF file format. Only PDF allowed.']);
                }

                $originalPdfName = pathinfo($pdfFile->getClientOriginalName(), PATHINFO_FILENAME);
                $pdfExtension = $pdfFile->getClientOriginalExtension();
                $sanitizedPdfName = preg_replace('/[^A-Za-z0-9\-_]/', '', $originalPdfName);
                $pdfFilename = 'pdfs/' . $sanitizedPdfName . '.' . $pdfExtension;
                $counter = 1;

                while (Storage::disk('public')->exists($pdfFilename)) {
                    $pdfFilename = 'pdfs/' . $sanitizedPdfName . '(' . $counter . ').' . $pdfExtension;
                    $counter++;
                }

                $pdfPath = $pdfFile->storeAs('', $pdfFilename, 'public');
                if (!$pdfPath) {
                    Log::error('Failed to store PDF file', ['filename' => $pdfFilename]);
                    return redirect()->back()->with('flash', ['error' => 'Failed to store PDF file.']);
                }

                $book->pdf_url = Storage::disk('public')->url($pdfPath);
                Log::info('PDF uploaded successfully', ['path' => $pdfPath, 'url' => $book->pdf_url]);
            }

            $book->save();

            // Redirect based on is_continue
            $redirectRoute = $request['is_continue']
                ? route('books.create', ['type' => $validated['type']])
                : route('books.index');

            $locale = app()->getLocale();
            $message = $locale === 'kh'
                ? 'សៀវភៅត្រូវបានបង្កើតដោយជោគជ័យ!'
                : 'Book created successfully!';

            return redirect()->to($redirectRoute)->with('flash', ['message' => $message]);

        } catch (\Illuminate\Database\QueryException $e) {
            Log::error('Database error during book store', [
                'error' => $e->getMessage(),
                'validated' => $validated,
                'sql' => $e->getSql(),
                'bindings' => $e->getBindings(),
            ]);
            $errorMessage = stripos($e->getMessage(), 'duplicate entry') !== false
                ? 'Duplicate book code or ISBN. Please use a unique code or ISBN.'
                : 'Unable to save book: ' . $e->getMessage();

            return redirect()->back()->with('flash', ['error' => $errorMessage]);

        } catch (\Exception $e) {
            Log::error('General exception during book store', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'validated' => $validated,
            ]);
            return redirect()->back()->with('flash', ['error' => 'Book creation failed: ' . $e->getMessage()]);
        }
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
        return redirect()->route('books.index');
        if ($this->isDeleted($book)) {
            return abort(404);
        }

        if (!$this->belongsToUserCampus($book)) {
            return abort(403, 'Unauthorized action.');
        }

        return Inertia::render('Books/Edit', [
            'book' => $book,
            'categories' => Category::all(),
            'subcategories' => SubCategory::all(),
            'shelves' => $this->getShelvesForCampus(),
            'bookcases' => $this->getBookcasesForCampus(),
            'grades' => Grade::all(),
            'subjects' => Subject::all(),
        ]);
    }

    public function update(UpdateBookRequest $request, Book $book): RedirectResponse
    {
        if ($this->isDeleted($book)) {
            return abort(404);
        }

        if (!$this->belongsToUserCampus($book)) {
            return abort(403, 'Unauthorized action.');
        }

    // TEMP DEBUG: log incoming request payload to diagnose missing fields for required_if
    Log::info('Book update request payload (raw):', $request->all());

    $validated = $request->validated();

        try {
            // Handle cover upload
            if ($request->hasFile('cover') && $request->file('cover')->isValid()) {
                $coverFile = $request->file('cover');
                $allowedMimes = ['image/jpeg', 'image/png'];

                if (!in_array($coverFile->getMimeType(), $allowedMimes)) {
                    Log::warning('Invalid cover image format', [
                        'mime' => $coverFile->getMimeType(),
                        'filename' => $coverFile->getClientOriginalName(),
                    ]);
                    return redirect()->back()->with('flash', ['error' => 'Invalid cover image format. Only JPEG or PNG allowed.']);
                }

                $coverExtension = $coverFile->getClientOriginalExtension();
                $bookCode = $validated['code'] ?? $book->code;
                $sanitizedCode = preg_replace('/[^A-Za-z0-9\-_]/', '', $bookCode);

                $coverFilename = 'covers/' . $sanitizedCode . '.' . $coverExtension;
                $counter = 1;

                while (Storage::disk('public')->exists($coverFilename)) {
                    $coverFilename = 'covers/' . $sanitizedCode . '(' . $counter . ').' . $coverExtension;
                    $counter++;
                }

                // Delete existing cover if it exists (normalize path from URL)
                if ($book->cover) {
                    $parsedPath = parse_url($book->cover, PHP_URL_PATH);
                    if ($parsedPath) {
                        Storage::disk('public')->delete(ltrim($parsedPath, '/storage/'));
                    }
                }

                $coverPath = $coverFile->storeAs('', $coverFilename, 'public');
                if (!$coverPath) {
                    Log::error('Failed to store cover image', ['filename' => $coverFilename]);
                    return redirect()->back()->with('flash', ['error' => 'Failed to store cover image.']);
                }

                $validated['cover'] = Storage::disk('public')->url($coverPath);
                Log::info('Cover uploaded successfully', ['path' => $coverPath, 'url' => $validated['cover']]);
            }

            // Handle PDF upload (optional for e-books)
            if ($this->isEbook($validated) && $request->hasFile('pdf_url') && $request->file('pdf_url')->isValid()) {
                $pdfFile = $request->file('pdf_url');

                if ($pdfFile->getMimeType() !== 'application/pdf') {
                    Log::warning('Invalid PDF file format', [
                        'mime' => $pdfFile->getMimeType(),
                        'filename' => $pdfFile->getClientOriginalName(),
                    ]);
                    return redirect()->back()->with('flash', ['error' => 'Invalid PDF file format. Only PDF allowed.']);
                }

                $originalPdfName = pathinfo($pdfFile->getClientOriginalName(), PATHINFO_FILENAME);
                $pdfExtension = $pdfFile->getClientOriginalExtension();
                $sanitizedPdfName = preg_replace('/[^A-Za-z0-9\-_]/', '', $originalPdfName);
                $pdfFilename = 'pdfs/' . $sanitizedPdfName . '.' . $pdfExtension;
                $counter = 1;

                while (Storage::disk('public')->exists($pdfFilename)) {
                    $pdfFilename = 'pdfs/' . $sanitizedPdfName . '(' . $counter . ').' . $pdfExtension;
                    $counter++;
                }

                // Delete existing PDF if it exists
                // Delete existing PDF if it exists (normalize path from URL)
                if ($book->pdf_url) {
                    $parsedPath = parse_url($book->pdf_url, PHP_URL_PATH);
                    if ($parsedPath) {
                        Storage::disk('public')->delete(ltrim($parsedPath, '/storage/'));
                    }
                }

                $pdfPath = $pdfFile->storeAs('', $pdfFilename, 'public');
                if (!$pdfPath) {
                    Log::error('Failed to store PDF file', ['filename' => $pdfFilename]);
                    return redirect()->back()->with('flash', ['error' => 'Failed to store PDF file.']);
                }

                $validated['pdf_url'] = Storage::disk('public')->url($pdfPath);
                Log::info('PDF uploaded successfully', ['path' => $pdfPath, 'url' => $validated['pdf_url']]);
            }

            $book->update($validated);

            $locale = app()->getLocale();
            $message = $locale === 'kh'
                ? 'សៀវភៅត្រូវបានកែប្រែដោយជោគជ័យ!'
                : 'Book updated successfully!';

            return redirect()->route('books.index')->with('flash', ['message' => $message]);

        } catch (\Illuminate\Database\QueryException $e) {
            Log::error('Database error during book update', [
                'error' => $e->getMessage(),
                'validated' => $validated,
                'sql' => $e->getSql(),
                'bindings' => $e->getBindings(),
            ]);
            $errorMessage = stripos($e->getMessage(), 'duplicate entry') !== false
                ? 'Duplicate book code or ISBN. Please use a unique code or ISBN.'
                : 'Unable to update book: ' . $e->getMessage();

            return redirect()->back()->with('flash', ['error' => $errorMessage]);

        } catch (\Exception $e) {
            Log::error('General exception during book update', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'validated' => $validated,
            ]);
            return redirect()->back()->with('flash', ['error' => 'Book update failed: ' . $e->getMessage()]);
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
