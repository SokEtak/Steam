<?php


namespace App\Http\Requests\Book;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class BaseBookRequest extends FormRequest
{
    public function authorize()
    {
        return Auth::check() && Auth::user()->role_id == 2;
    }

    protected function prepareForValidation()
    {
        $campusId = Auth::user()->campus_id;
        if ($this->input('type') === 'physical' && !$campusId) {
            throw ValidationException::withMessages([
                'campus_id' => 'User must have a valid campus ID for physical books.',
            ]);
        }
        $this->merge([
            'campus_id' => $this->input('campus_id', $campusId),
            'user_id' => $this->input('user_id', Auth::id()),
        ]);
    }

    public function rules()
    {
        $isEbook = $this->input('type', 'physical') === 'ebook';
        $isUpdate = $this->method() === 'PUT' || $this->method() === 'PATCH';
        $bookId = $this->route('book');
        return [
            'type' => ['nullable', 'in:physical,ebook'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'page_count' => ['required', 'integer', 'min:1'],
            'publisher' => ['required', 'string', 'max:255'],
            'language' => ['required', 'in:kh,en'],
            'published_at' => ['nullable', 'date'],
            'author' => ['nullable', 'string', 'max:255'],
            'flip_link' => ['nullable', 'url', 'max:255'],
            'code' => [
                $isUpdate ? 'nullable' : 'required',
                'string',
                'max:10',
                Rule::unique('books', 'code')->ignore($bookId),
            ],
            'isbn' => [
                'nullable',
                'string',
                'size:13',
                Rule::unique('books', 'isbn')->ignore($bookId),
            ],
            'view' => ['required', 'integer', 'min:0'],
            'is_available' => [$isEbook ? 'nullable' : 'required', 'boolean'],
            'downloadable' => [$isEbook ? 'required' : 'nullable', 'boolean'],
            'cover' => ['nullable', 'image', 'mimes:jpeg,png', 'max:2048'],
            'pdf_url' => [
                Rule::requiredIf(function () use ($isEbook, $bookId) {
                    return $isEbook && (!$bookId || !optional($this->route('book'))->pdf_url);
                }),
                'nullable',
                'mimes:pdf',
                'max:10240',
            ],
            'category_id' => ['required', 'exists:categories,id'],
            'subcategory_id' => ['nullable', 'exists:sub_categories,id'],
            'shelf_id' => [$isEbook ? 'nullable' : 'required_if:type,physical', 'exists:shelves,id'],
            'bookcase_id' => [$isEbook ? 'nullable' : 'required_if:type,physical', 'exists:bookcases,id'],
            'grade_id' => ['nullable', 'exists:grades,id'],
            'subject_id' => ['nullable', 'exists:subjects,id'],
            'campus_id' => [$isEbook ? 'nullable' : 'required', 'exists:campuses,id'],
        ];
    }

    public function messages()
    {
        return [
            'type.required' => 'Book type is required.',
            'type.in' => 'Book type must be physical or ebook.',
            'title.required' => 'Book title is required.',
            'description.required' => 'Book description is required.',
            'page_count.required' => 'Page count is required.',
            'page_count.min' => 'Page count must be at least 1.',
            'publisher.required' => 'Publisher name is required.',
            'language.required' => 'Language is required.',
            'code.required' => 'Book code is required.',
            'isbn.size' => 'ISBN must be exactly 13 characters.',
            'isbn.unique' => 'This ISBN is already in use, please choose another one.',
            'cover.image' => 'Cover must be a valid JPEG or PNG image.',
            'cover.max' => 'Cover image must not exceed 2MB.',
            'pdf_url.mimes' => 'File must be a valid PDF.',
            'pdf_url.max' => 'PDF file must not exceed 10MB.',
            'category_id.required' => 'Category is required.',
            'shelf_id.required_if' => 'Shelf is required for physical books.',
            'bookcase_id.required_if' => 'Bookcase is required for physical books.',
            'grade_id.exists' => 'Selected grade is invalid.',
            'subject_id.exists' => 'Selected subject is invalid.',
            'campus_id.required' => 'Campus is required for physical books.',
            'campus_id.exists' => 'Selected campus is invalid.',
        ];
    }
}

//old
//namespace App\Http\Requests\Book;
//
//use Illuminate\Foundation\Http\FormRequest;
//use Illuminate\Support\Facades\Auth;
//use Illuminate\Validation\Rule;
//use Illuminate\Validation\ValidationException;
//
//class BaseBookRequest extends FormRequest
//{
//    public function authorize()
//    {
//        return Auth::check() && Auth::user()->role_id==2;
//    }
//
//    protected function prepareForValidation()
//    {
//        $campusId = Auth::user()->campus_id;
//        if (!$campusId && $this->input('type') === 'physical') {
//            throw ValidationException::withMessages([
//                'campus_id' => 'User must have a valid campus ID for physical books.',
//            ]);
//        }
//        $this->merge([
//            'campus_id' => $this->input('campus_id', $campusId),
//            'user_id' => $this->input('user_id', Auth::id()),
//        ]);
//    }
//
////    protected function prepareForValidation()
////    {
////        $this->merge(['campus_id' => $this->input('campus_id', Auth::user()->campus_id)]);
////        $this->merge(['user_id' => $this->input('user_id', Auth::id())]);
////    }
//
//    public function rules()
//    {
//        $isEbook = $this->input('type', 'physical') === 'ebook';
//        $isUpdate = $this->method() === 'PUT' || $this->method() === 'PATCH';
//        $bookId = $this->route('book');
//        return [
//            'title' => ['required', 'string', 'max:255'],
//            'type' => ['required', 'in:physical,ebook'],
//            'description' => ['required', 'string'],
//            'page_count' => ['required', 'integer', 'min:1'],
//            'publisher' => ['required', 'string', 'max:255'],
//            'language' => ['required', 'in:kh,en'],
//            'published_at' => ['nullable', 'date'],
//            'author' => ['nullable', 'string', 'max:255'],
//            'flip_link' => ['nullable', 'url', 'max:255'],
//            'code' => [
//                $isUpdate ? 'nullable' : 'required',
//                'string',
//                'max:10',
//                Rule::unique('books', 'code')->ignore($bookId),
//            ],
//            Rule::unique('books', 'code')->ignore($bookId),
//            'isbn' => [
//                'nullable',
//                'string',
//                'size:13',
//                Rule::unique('books', 'isbn')->ignore($bookId),
//            ],
//            'view' => ['required', 'integer', 'min:0'],
//            'is_available' => [$isEbook ? 'nullable' : 'required', 'boolean'],
//            'downloadable' => [$isEbook ? 'required' : 'nullable', 'boolean'],
//            'cover' => ['nullable', 'image', 'mimes:jpeg,png', 'max:2048'],//2mb
//            'pdf_url' => [$isEbook ? 'required' : 'nullable', 'mimes:pdf', 'max:10240'],//10mb
//            'category_id' => ['nullable', 'exists:categories,id'],
//            'subcategory_id' => ['nullable', 'exists:sub_categories,id'],
//            'bookcase_id' => [$isEbook ? 'nullable' : 'required_if:type,physical', 'exists:bookcases,id'],
//            'shelf_id' => [$isEbook ? 'nullable' : 'required_if:type,physical', 'exists:shelves,id'],
//            'grade_id' => ['nullable', 'exists:grades,id'],
//            'subject_id' => ['nullable', 'exists:subjects,id'],
//            'campus_id' => [$isEbook ? 'nullable' : 'required', 'exists:campuses,id'],
//        ];
//    }
//
//    //customize  fields validation message
//    public function messages()
//    {
//        return [
//            'type.required' => 'Book type is required.',
//            'type.in' => 'Book type must be physical or ebook.',
//            'title.required' => 'Book title is required.',
//            'description.required' => 'Book description is required.',
//            'page_count.required' => 'Page count is required.',
//            'page_count.min' => 'Page count must be at least 1.',
//            'publisher.required' => 'Publisher name is required.',
//            'language.required' => 'Language is required.',
//            'code.required' => 'Book code is required.',
//            'isbn.size' => 'ISBN must be exactly 13 characters.',
//            'isbn.unique' => 'This ISBN is already in use, please choose another one.',
//            'cover.image' => 'Cover must be a valid JPEG or PNG image.',
//            'cover.max' => 'Cover image must not exceed 2MB.',
//            'pdf_url.mimes' => 'File must be a valid PDF.',
//            'pdf_url.max' => 'PDF file must not exceed 10MB.',
//            'category_id.required' => 'Category is required.',
//            'shelf_id.required' => 'Shelf is required for physical books.',
//            'pdf_url.required' => 'PDF file is required for ebooks.',
//            'bookcase_id.required' => 'Bookcase is required for physical books.',
//            'grade_id.exists' => 'Selected grade is invalid.',
//            'subject_id.exists' => 'Selected subject is invalid.',
//            'campus_id.required' => 'Campus is required for physical books.',
//            'campus_id.exists' => 'Selected campus is invalid.',
//        ];
//    }
//}
