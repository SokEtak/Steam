<?php

namespace App\Http\Controllers;

use App\Http\Requests\Book\StoreBookRequest;
use App\Http\Requests\Book\UpdateBookRequest;
use App\Models\Book;
use App\Models\Category;
use App\Models\Shelf;
use App\Models\SubCategory;
use App\Models\User;
use App\Models\Bookcase;
use App\Models\Grade;
use App\Models\Subject;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class BookController extends Controller
{
    public function index()
    {
        $books = Book::with([
            'user:id,name',
            'category:id,name',
            'subcategory:id,name',
            'bookcase:id,code',
            'shelf:id,code',
            'grade:id,name',
            'subject:id,name'
        ])
            ->select([
                'id',
                'title',
                'flip_link',
                'cover',
                'code',
                'isbn',
                'view',
                'is_available',
                'pdf_url',
                'user_id',
                'category_id',
                'subcategory_id',
                'bookcase_id',
                'shelf_id',
                'grade_id',
                'subject_id',
                'is_deleted'
            ])
            ->where('is_deleted', false)
            ->get();

        return Inertia::render('Books/Index', [
            'books' => $books,
        ]);
    }

    public function create()
    {
        return Inertia::render('Books/Create', [
            'users' => User::select('id', 'name')->get(),
            'categories' => Category::select('id', 'name')->get(),
            'subcategories' => SubCategory::select('id', 'name')->get(),
            'bookcases' => Bookcase::select('id', 'code')->get(),
            'shelves' => Shelf::select('id', 'code')->get(),
            'grades' => Grade::select('id', 'name')->get(),
            'subjects' => Subject::select('id', 'name')->get(),
        ]);
    }

    public function store(StoreBookRequest $request)
    {
        try {
            $validated = $request->validated();
            $currentDate = Carbon::now()->format('d-M-Y'); // e.g., 15-Aug-2025

            if ($request->hasFile('cover')) {
                $file = $request->file('cover');
                $fileName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
                $extension = $file->getClientOriginalExtension();
                $newFileName = "{$fileName}_{$currentDate}.{$extension}";
                $validated['cover'] = $file->storeAs('covers', $newFileName, 'public');
            }

            if ($request->hasFile('pdf_url')) {
                $file = $request->file('pdf_url');
                $fileName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
                $extension = $file->getClientOriginalExtension();
                $newFileName = "{$fileName}_{$currentDate}.{$extension}";
                $validated['pdf_url'] = $file->storeAs('pdfs', $newFileName, 'public');
            }

            Book::create($validated);
            return redirect()->route('books.index')->with('message', 'Book created successfully!');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to create book: ' . $e->getMessage());
        }
    }

    public function edit(Book $book)
    {
        $book->load([
            'user:id,name',
            'category:id,name',
            'subcategory:id,name',
            'bookcase:id,code',
            'shelf:id,code',
            'grade:id,name',
            'subject:id,name'
        ]);

        return Inertia::render('Books/Edit', [
            'book' => $book,
            'users' => User::select('id', 'name')->get(),
            'categories' => Category::select('id', 'name')->get(),
            'subcategories' => SubCategory::select('id', 'name')->get(),
            'bookcases' => Bookcase::select('id', 'code')->get(),
            'shelves' => Shelf::select('id', 'code')->get(),
            'grades' => Grade::select('id', 'name')->get(),
            'subjects' => Subject::select('id', 'name')->get(),
        ]);
    }

    public function update(UpdateBookRequest $request, Book $book)
    {
        try {
            $this->updateBookAttributes($book, $request->validated());

            $book->save();

            return redirect()->route('books.index')->with('flash', ['message' => 'Book updated successfully!']);
        } catch (\Exception $e) {
            return redirect()->back()->with('flash', ['error' => 'Failed to update book: ' . $e->getMessage()]);
        }
    }

    public function show(Book $book)
    {
        $book->load([
            'user:id,name',
            'category:id,name',
            'subcategory:id,name',
            'bookcase:id,code',
            'shelf:id,code',
            'grade:id,name',
            'subject:id,name'
        ]);

        return Inertia::render('Books/Show', [
            'book' => $book,
        ]);
    }

    public function destroy(Book $book)
    {
        try {
            $book->update(['is_deleted' => true]);

            return redirect()->route('books.index')->with('flash', ['message' => 'Book deleted successfully!']);
        } catch (\Exception $e) {
            return redirect()->back()->with('flash', ['error' => 'Failed to delete book: ' . $e->getMessage()]);
        }
    }

    private function updateBookAttributes(Book $book, array $validated)
    {
        $book->title = $validated['title'];
        $book->flip_link = $validated['flip_link'];
        $book->code = $validated['code'];
        $book->isbn = $validated['isbn'];
        $book->view = $validated['view'];
        $book->is_available = $validated['is_available'];
        $book->user_id = $validated['user_id'];
        $book->category_id = $validated['category_id'];
        $book->subcategory_id = $validated['subcategory_id'] === 'none' ? null : $validated['subcategory_id'];
        $book->bookcase_id = $validated['bookcase_id'] === 'none' ? null : $validated['bookcase_id'];
        $book->shelf_id = $validated['shelf_id'] === 'none' ? null : $validated['shelf_id'];
        $book->grade_id = $validated['grade_id'] === 'none' ? null : $validated['grade_id'];
        $book->subject_id = $validated['subject_id'] === 'none' ? null : $validated['subject_id'];
        $book->is_deleted = $validated['is_deleted'];

        $currentDate = Carbon::now()->format('d-M-Y'); // e.g., 15-Aug-2025

        if (request()->hasFile('cover')) {
            // Delete old cover if it exists
            if ($book->cover) {
                Storage::disk('public')->delete($book->cover);
            }
            $file = request()->file('cover');
            $fileName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
            $extension = $file->getClientOriginalExtension();
            $newFileName = "{$fileName}_{$currentDate}.{$extension}";
            $book->cover = $file->storeAs('covers', $newFileName, 'public');
        }

        if (request()->hasFile('pdf_url')) {
            // Delete old PDF if it exists
            if ($book->pdf_url) {
                Storage::disk('public')->delete($book->pdf_url);
            }
            $file = request()->file('pdf_url');
            $fileName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
            $extension = $file->getClientOriginalExtension();
            $newFileName = "{$fileName}_{$currentDate}.{$extension}";
            $book->pdf_url = $file->storeAs('pdfs', $newFileName, 'public');
        }
    }
}
