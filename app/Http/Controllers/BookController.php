<?php

namespace App\Http\Controllers;

//use App\Http\Requests\StoreBookRequest;
//use App\Http\Requests\UpdateBookRequest;
use App\Models\Book;
use App\Models\Category;
use App\Models\Shelf;
use App\Models\SubCategory;
use App\Models\User;
use App\Models\Bookcase;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BookController extends Controller
{
    public function index()
    {
        $books = Book::with('user:id,name', 'category:id,name', 'subcategory:id,name', 'bookcase:id,code', 'shelf:id,code')
            ->select('id', 'title', 'flip_link', 'code', 'isbn', 'view', 'is_available', 'user_id', 'category_id', 'subcategory_id', 'bookcase_id', 'shelf_id')
            ->get();

        return Inertia::render('Books/Index', [
            'books' => $books,
        ]);
    }

    public function create()
    {
        $users = User::select('id', 'name')->get();
        $categories = Category::select('id', 'name')->get();
        $subcategories = SubCategory::select('id', 'name')->get();
        $bookcases = Bookcase::select('id', 'code')->get();
        $shelves = Shelf::select('id', 'code')->get();

        return Inertia::render('Books/Create', [
            'users' => $users,
            'categories' => $categories,
            'subcategories' => $subcategories,
            'bookcases' => $bookcases,
            'shelves' => $shelves,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->all();
        // Transform 'none' to null for optional fields
        $data['subcategory_id'] = $data['subcategory_id'] === 'none' ? null : $data['subcategory_id'];
        $data['bookcase_id'] = $data['bookcase_id'] === 'none' ? null : $data['bookcase_id'];
        $data['shelf_id'] = $data['shelf_id'] === 'none' ? null : $data['shelf_id'];
        // Cast view to integer, default to 0 if invalid
        $data['view'] = (int)($data['view'] ?? 0);

        $request->merge($data);

        $request->validate([
            'title' => 'required|string|max:255',
            'flip_link' => 'nullable|url',
            'code' => 'required|string|max:255',
            'isbn' => 'required|string|max:13',
            'view' => 'required|integer',
            'is_available' => 'required|boolean',
            'user_id' => 'required|exists:users,id',
            'category_id' => 'required|exists:categories,id',
            'subcategory_id' => 'nullable|exists:sub_categories,id',
            'bookcase_id' => 'nullable|exists:bookcases,id',
            'shelf_id' => 'nullable|exists:shelves,id',
        ]);

        Book::create($data);

        return redirect()->route('books.index')->with('message', 'Book created successfully.');
    }

    public function edit(Book $book)
    {
        $users = User::select('id', 'name')->get();
        $categories = Category::select('id', 'name')->get();
        $subcategories = SubCategory::select('id', 'name')->get();
        $bookcases = Bookcase::select('id', 'code')->get();
        $shelves = Shelf::select('id', 'code')->get();

        return Inertia::render('Books/Edit', [
            'book' => $book,
            'users' => $users,
            'categories' => $categories,
            'subcategories' => $subcategories,
            'bookcases' => $bookcases,
            'shelves' => $shelves,
            'flash' => ['message' => session('message')],
        ]);
    }

    public function update(Request $request, Book $book)
    {
        $data = $request->all();
        // Transform 'none' to null for optional fields
        $data['subcategory_id'] = $data['subcategory_id'] === 'none' ? null : $data['subcategory_id'];
        $data['bookcase_id'] = $data['bookcase_id'] === 'none' ? null : $data['bookcase_id'];
        $data['shelf_id'] = $data['shelf_id'] === 'none' ? null : $data['shelf_id'];
        // Cast view to integer, default to 0 if invalid
        $data['view'] = (int)($data['view'] ?? 0);

        $request->merge($data);

        $request->validate([
            'title' => 'required|string|max:255',
            'flip_link' => 'nullable|url',
            'code' => 'required|string|max:255',
            'isbn' => 'required|string|max:13',
            'view' => 'required|integer',
            'is_available' => 'required|boolean',
            'user_id' => 'required|exists:users,id',
            'category_id' => 'required|exists:categories,id',
            'subcategory_id' => 'nullable|exists:sub_categories,id',
            'bookcase_id' => 'nullable|exists:bookcases,id',
            'shelf_id' => 'nullable|exists:shelves,id',
        ]);

        $book->update($data);

        return redirect()->route('books.index', $book->id)->with('message', 'Book updated successfully.');
    }

    public function show(Book $book)
    {
        $book->load('user:id,name', 'category:id,name', 'subcategory:id,name', 'bookcase:id,code', 'shelf:id,code');
        return Inertia::render('Books/Show', [
            'book' => $book,
        ]);
    }

    public function destroy(Book $book){
        $book->delete();
        return redirect()->route('books.index')->with('message', 'Book deleted successfully.');
    }
}
