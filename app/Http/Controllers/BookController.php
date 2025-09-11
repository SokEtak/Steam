<?php
namespace App\Http\Controllers;

use App\Http\Requests\Book\BaseBookRequest;
use App\Models\{Book, Bookcase, Campus, Category, Shelf, SubCategory, Grade, Subject};
use Illuminate\Support\Facades\{Auth, Storage};
use Inertia\Inertia;
use Illuminate\Http\RedirectResponse;

class BookController extends Controller
{
    public function index()
    {
        $book_type = request()->query('type', null);//null to get all mixed book

        //prevent from illegal parameter
        if (!in_array($book_type, ['physical', 'ebook','delbook']) && $book_type !== null) {
            $book_type = 'physical';
        }

        $books = Book::active($book_type)->get();
        $campuses = Campus::select('id', 'name')->get();
        return Inertia::render('Books/Index', [
            'books' => $books,
            'availableCategories' => Category::all(),
            'availableSubjects' => Subject::all(),
            'availableShelves' => Shelf::select(['id', 'code'])->get(),
            'availableSubcategories' => SubCategory::all(),
            'availableBookcases' => Bookcase::select(['id', 'code'])->get(),
            'availableCampuses' => $campuses,
            'availableGrades' => Grade::all(),
            'isSuperLibrarian' => Auth::check() && Auth::user()->role_id === 3,
            'flash' => session('flash', []),
        ]);
    }

    public function create()
    {
        //redirect to index if super librarian or non-authenticated user
        $redirect = $this->shouldRedirect();
        if ($redirect !== true) {
            return $redirect;
        }

        $user_campus_id = Auth::user()->campus_id;
        return Inertia::render('Books/Create', [
            'categories' => Category::all(['id', 'name']),
            'subcategories' => SubCategory::all(['id', 'name']),
            'shelves' => Shelf::select(['id', 'code'])->where('campus_id', $user_campus_id)->get(),//select user campus
            'bookcases' => Bookcase::select(['id', 'code'])->where('campus_id', $user_campus_id)->get(),
            'grades' => Grade::all(['id', 'name']),
            'subjects' => Subject::all(['id', 'name']),
            'type' => request('type', 'physical'),
        ]);
    }

    public function show(Book $book)
    {
        //prevent from viewing soft deleted book
        if ($book->is_deleted){
            return abort(404);
        }

        return Inertia::render('Books/Show', ['book' => $book]);
    }

    public function edit(Book $book)
    {
        abort(403, 'Unauthorized action.Temporary disabled.');
        // Check for redirect
        $redirect = $this->shouldRedirect();
        if ($redirect !== true) {
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
        $isEbook = $validated['type'] === 'ebook';
        $bookData = array_merge($validated, [
            'user_id' => Auth::id(),
        ]);

        $book = new Book($bookData);

        if ($request->hasFile('cover')) {
            $book->cover = $request->file('cover')->store('covers', 'public');
        }

        if ($isEbook && $request->hasFile('pdf_url')) {
            // Get the uploaded file
            $pdfFile = $request->file('pdf_url');

            // Get the original filename
            $originalFilename = $pdfFile->getClientOriginalName();

            // Store the file using its original filename
            $book->pdf_url = $pdfFile->storeAs('pdfs', $originalFilename, 'public');
        }

        $book->save();

        return redirect()->route('books.index')->with('message', 'Book created successfully!');
    }

    public function update(BaseBookRequest $request, Book $book)
    {
        $validated = $request->validated();
        $isEbook = $validated['type'] === 'ebook';
        $bookData = array_merge($validated, [
            'user_id' => Auth::id(),
            'is_available' => $validated['is_available'] ?? $book->is_available,
            'downloadable' => $validated['downloadable'] ?? $book->downloadable,
            'view' => $validated['view'] ?? $book->view,
        ]);

        if ($request->hasFile('cover')) {
            $book->cover && Storage::disk('public')->delete($book->cover);
            $bookData['cover'] = $request->file('cover')->store('covers', 'public');
        }
        if ($isEbook && $request->hasFile('pdf_url')) {
            $book->pdf_url && Storage::disk('public')->delete($book->pdf_url);
            $bookData['pdf_url'] = $request->file('pdf_url')->store('pdfs', 'public');
        }
        $book->update($bookData);

        return redirect()->route('books.index')->with('message', 'Book updated successfully!');
    }

    public function destroy(Book $book): RedirectResponse
    {
        return $this->handleBookOperation(function () use ($book) {
            if (!$book->is_deleted) {//soft delete(keep data)
                $book->update(['is_deleted' => true]);
                $message = 'Book deleted successfully!';
            } else {//hard delete(permanently delete)
                $book->cover && Storage::disk('public')->delete($book->cover);
                $book->pdf_url && Storage::disk('public')->delete($book->pdf_url);
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
            return redirect()->back()->with('flash', ['error' => "Failed to $action book: " . $e->getMessage()]);
        }
    }

    public function shouldRedirect()
    {
        if (Auth::check() && Auth::user()->role_id!=2) {
            return redirect()->route('books.index');
        }
        return true ;
    }
}
