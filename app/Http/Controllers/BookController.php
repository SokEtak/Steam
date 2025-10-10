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
        //sort desc to see the newest created book & take last created 15 books
        $books = Book::active($book_type)->orderByDesc('created_at')->take(15)->get();

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
                $originalTitle = $validated['title'];
                $sanitizedTitle = preg_replace('/[^A-Za-z0-9\-_]/', '', $originalTitle);
                $coverFilename = 'covers/' . $sanitizedTitle . '.' . $coverExtension;
                $counter = 1;

                while (Storage::disk('public')->exists($coverFilename)) {
                    $coverFilename = 'covers/' . $sanitizedTitle . '(' . $counter . ').' . $coverExtension;
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
        // Ensure the user has permission to edit the book
        if ($book->user_id !== Auth::id() && Auth::user()->role_id !== 2) {
            abort(403, 'Unauthorized action.');
        }

        return Inertia::render('Books/Edit', [
            'book' => $book->load('category', 'subcategory', 'shelf', 'bookcase', 'grade', 'subject', 'campus'),
            'categories' => Category::all(['id', 'name']),
            'subcategories' => SubCategory::all(['id', 'name']),
            'shelves' => Shelf::all(['id', 'code']),
            'bookcases' => Bookcase::all(['id', 'code']),
            'grades' => Grade::all(['id', 'name']),
            'subjects' => Subject::all(['id', 'name']),
            'campuses' => Campus::all(['id', 'name']),
//            'type' => $book->type,
        ]);
    }

    public function update(UpdateBookRequest $request, Book $book): RedirectResponse
    {
        // Ensure the user has permission to update
        if ($book->user_id !== Auth::id() && Auth::user()->role_id !== 2) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validated();

        try {
            // Update book attributes
            $book->fill($validated);

            // Handle cover image upload
            if ($request->hasFile('cover') && $request->file('cover')->isValid()) {
                $allowedMimes = ['image/jpeg', 'image/png'];
                if (!in_array($request->file('cover')->getMimeType(), $allowedMimes)) {
                    Log::warning('Invalid cover image format', [
                        'mime' => $request->file('cover')->getMimeType(),
                        'filename' => $request->file('cover')->getClientOriginalName(),
                    ]);
                    return redirect()->back()->with('flash', ['error' => 'Invalid cover image format. Only JPEG or PNG allowed.']);
                }
                // Delete old cover if it exists
                if ($book->cover) {
                    $oldCoverPath = parse_url($book->cover, PHP_URL_PATH);
                    if ($oldCoverPath && Storage::disk('public')->exists(basename($oldCoverPath))) {
                        Storage::disk('public')->delete(basename($oldCoverPath));
                    }
                }
                $coverExtension = $request->file('cover')->getClientOriginalExtension();
                $coverFilename = 'covers/' . uniqid('cover_', true) . '.' . $coverExtension;
                $path = $request->file('cover')->storeAs('', $coverFilename, 'public');
                if (!$path) {
                    Log::error('Failed to store cover image', ['filename' => $coverFilename]);
                    return redirect()->back()->with('flash', ['error' => 'Failed to store cover image.']);
                }
                $book->cover = Storage::disk('public')->url($path);
                Log::info('Cover uploaded successfully', ['path' => $path, 'url' => $book->cover]);
            }

            // Handle PDF upload for e-books
            if ($this->isEbook($validated) && $request->hasFile('pdf_url') && $request->file('pdf_url')->isValid()) {
                if ($request->file('pdf_url')->getMimeType() !== 'application/pdf') {
                    Log::warning('Invalid PDF file format', [
                        'mime' => $request->file('pdf_url')->getMimeType(),
                        'filename' => $request->file('pdf_url')->getClientOriginalName(),
                    ]);
                    return redirect()->back()->with('flash', ['error' => 'Invalid PDF file format. Only PDF allowed.']);
                }
                // Delete old PDF if it exists
                if ($book->pdf_url) {
                    $oldPdfPath = parse_url($book->pdf_url, PHP_URL_PATH);
                    if ($oldPdfPath && Storage::disk('public')->exists(basename($oldPdfPath))) {
                        Storage::disk('public')->delete(basename($oldPdfPath));
                    }
                }
                $originalPdfName = pathinfo($request->file('pdf_url')->getClientOriginalName(), PATHINFO_FILENAME);
                $sanitizedPdfName = preg_replace('/[^A-Za-z0-9\-_]/', '', $originalPdfName);
                $pdfExtension = $request->file('pdf_url')->getClientOriginalExtension();
                $pdfFilename = 'pdfs/' . $sanitizedPdfName . '.' . $pdfExtension;
                $counter = 1;
                while (Storage::disk('public')->exists($pdfFilename)) {
                    $pdfFilename = 'pdfs/' . $sanitizedPdfName . '_' . $counter . '.' . $pdfExtension;
                    $counter++;
                }
                $path = $request->file('pdf_url')->storeAs('', $pdfFilename, 'public');
                if (!$path) {
                    Log::error('Failed to store PDF file', ['filename' => $pdfFilename]);
                    return redirect()->back()->with('flash', ['error' => 'Failed to store PDF file.']);
                }
                $book->pdf_url = Storage::disk('public')->url($path);
                Log::info('PDF uploaded successfully', ['path' => $path, 'url' => $book->pdf_url]);
            }

            // Log validated data for debugging
            Log::info('Attempting to update book', ['validated' => $validated, 'book_id' => $book->id]);

            $book->save();

            return redirect()->route('books.index')->with('flash', ['message' => 'Book updated successfully!']);
        } catch (\Illuminate\Database\QueryException $e) {
            Log::error('Database error during book update', [
                'error' => $e->getMessage(),
                'sql' => $e->getSql(),
                'bindings' => $e->getBindings(),
                'validated' => $validated,
            ]);
            $errorMessage = 'Unable to update book: ' . $e->getMessage();
            if (stripos($e->getMessage(), 'duplicate entry') !== false) {
                $errorMessage = 'Duplicate book code or ISBN. Please use a unique code or ISBN.';
            } elseif (stripos($e->getMessage(), 'out of range') !== false && stripos($e->getMessage(), 'published_at') !== false) {
                $errorMessage = 'The published year is invalid. Please use a year between 1000 and 2025.';
            }
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
