<?php

namespace App\Http\Controllers;

use App\Http\Requests\Book\BaseBookRequest;
use Aws\S3\Exception\S3Exception;
use App\Models\{Book, Bookcase, Campus, Category, Shelf, SubCategory, Grade, Subject};
use Illuminate\Support\Facades\{Auth, Storage};
use Inertia\Inertia;
use Illuminate\Http\RedirectResponse;

class BookController extends Controller
{
    public function index()
    {
        $book_type = request()->query('type', null);

        if (!in_array($book_type, ['physical', 'ebook']) && $book_type !== null) {
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
            if ($request->hasFile('cover')) {
                $path = $request->file('cover')->storePublicly('covers', 'r2');
                $book->cover = Storage::disk('r2')->url($path);
                // $book->cover = Storage::disk('public')->url($path); // Local fallback
            }

            if ($this->isEbook($validated) && $request->hasFile('pdf_url')) {
                $book->pdf_url = $this->storePdf($request);
            }

            $book->save();

            return redirect()->route('books.index')->with('message', 'Book created successfully!');
        } catch (S3Exception $e) {
            // R2/S3-specific error
            return redirect()->back()->with('flash', [
                'error' => 'Upload failed: R2 storage error - ' . $e->getMessage()
            ]);
        } catch (\Exception $e) {
            // General error
            return redirect()->back()->with('flash', [
                'error' => 'Book creation failed: ' . $e->getMessage()
            ]);
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
            if ($request->hasFile('cover')) {
                if ($book->cover) {
                    $path = parse_url($book->cover, PHP_URL_PATH);
                    Storage::disk('r2')->delete(ltrim($path, '/'));
                    // Storage::disk('public')->delete(ltrim($path, '/')); // Local fallback
                }
                $path = $request->file('cover')->storePublicly('covers', 'r2');
                // $path = $request->file('cover')->storePublicly('covers', 'public'); // Local fallback
                $bookData['cover'] = Storage::disk('r2')->url($path);
                // $bookData['cover'] = Storage::disk('public')->url($path); // Local fallback
            }

            if ($this->isEbook($validated) && $request->hasFile('pdf_url')) {
                if ($book->pdf_url) {
                    $path = parse_url($book->pdf_url, PHP_URL_PATH);
                    Storage::disk('r2')->delete(ltrim($path, '/'));
                    // Storage::disk('public')->delete(ltrim($path, '/')); // Local fallback
                }
                $bookData['pdf_url'] = $this->storePdf($request);
            }

            $book->update($bookData);

            return redirect()->route('books.index')->with('message', 'Book updated successfully!');
        } catch (S3Exception $e) {
            return redirect()->back()->with('flash', [
                'error' => 'Update failed: R2 storage error - ' . $e->getMessage()
            ]);
        } catch (\Exception $e) {
            return redirect()->back()->with('flash', [
                'error' => 'Book update failed: ' . $e->getMessage()
            ]);
        }
    }

    public function destroy(Book $book): RedirectResponse
    {
        return $this->handleBookOperation(function () use ($book) {
            if (!$book->is_deleted) {
                $book->update(['is_deleted' => true]);
                $message = 'Book deleted successfully!';
            } else {
                $book->cover && Storage::disk('r2')->delete($book->cover);
                $book->pdf_url && Storage::disk('r2')->delete($book->pdf_url);
                // $book->cover && Storage::disk('public')->delete($book->cover); // Local storage
                // $book->pdf_url && Storage::disk('public')->delete($book->pdf_url); // Local storage
                $book->delete();
                $message = 'Book permanently deleted!';
            }

            return redirect()->route('books.index')->with('message', $message);
        }, 'delete');
    }

    private function handleBookOperation(callable $operation, string $action): RedirectResponse
    {
        try {
            return $operation();
        } catch (\Exception $e) {
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
        $pdfFile = $request->file('pdf_url');
        $originalFilename = $pdfFile->getClientOriginalName();
        $path = $pdfFile->storeAs('pdfs', $originalFilename, 'r2');
        // $path = $pdfFile->storeAs('pdfs', $originalFilename, 'public'); // Local fallback
        return Storage::disk('r2')->url($path);
        // return Storage::disk('public')->url($path); // Local fallback
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
