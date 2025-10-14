<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Bookcase\StoreBookcaseRequest;
use App\Http\Resources\BookCollection;
use App\Models\Book;
use App\Models\Bookcase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class BookController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return BookCollection
     */
    public function index()
    {
        // Retrieve and paginate the books using your custom scope.
        // The paginate method automatically handles the `limit` query parameter.
        $books = Book::all();

        // Return a new instance of the BookCollection, which will handle the
        // transformation of the paginated books into a JSON response.
        return response()->json($books);
    }
}
