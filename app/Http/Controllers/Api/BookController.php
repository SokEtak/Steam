<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Book\BaseBookRequest;
use App\Models\Book;
use App\Models\Bookcase;
use App\Models\Category;
use App\Models\Shelf;
use App\Models\SubCategory;
use App\Models\Grade;
use App\Models\Subject;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\JsonResponse;

class BookController extends Controller
{
   public function index(){
       $books = Book::select('id', 'title', 'author',)
           ->with(['bookcase', 'shelf', 'category', 'subcategory', 'grade', 'subject'])
           ->where(['campus_id'=>1])
           ->get()
       ->toArray();
       return response()->json($books);
   }
}
