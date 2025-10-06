<?php

namespace App\Http\Requests\Book;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Log;

class UpdateBookRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return Auth::check() && Auth::user()->role_id === 2;
    }

    /**
     * Prepare the data for validation.
     *
     * @return void
     */
    protected function prepareForValidation()
    {
        $campusId = Auth::user()->campus_id;
        $isEbook = $this->has('type') ? $this->input('type') === 'ebook' : false;

        // Log incoming data for debugging
        Log::debug('UpdateBookRequest Input', $this->all());

        // Ensure campus_id is only required for physical books
        if (!$isEbook && !$campusId) {
            throw ValidationException::withMessages([
                'campus_id' => 'User must have a valid campus ID for physical books.',
            ]);
        }

        // Normalize boolean fields
        $isAvailable = $this->input('is_available');
        $downloadable = $this->input('downloadable');

        $this->merge([
            'campus_id' => $isEbook ? null : $this->input('campus_id', $campusId),
            'user_id' => $this->input('user_id', Auth::id()),
            'type' => $this->input('type', 'physical'), // Ensure default value
            'is_available' => $isEbook ? null : ($isAvailable === 'true' || $isAvailable === '1' ? true : ($isAvailable === 'false' || $isAvailable === '0' ? false : $isAvailable)),
            'downloadable' => $isEbook ? ($downloadable === 'true' || $downloadable === '1' ? true : ($downloadable === 'false' || $downloadable === '0' ? false : $downloadable)) : null,
        ]);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        $isEbook = $this->input('type', 'physical') === 'ebook';
        $bookId = $this->route('book')->id;

        return [
            'type' => ['required', Rule::in(['physical', 'ebook'])],
            'title' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'page_count' => ['nullable', 'integer', 'min:1'],
            'publisher' => ['nullable', 'string', 'max:255'],
            'language' => ['nullable', Rule::in(['kh', 'en'])],
            'published_at' => ['nullable', 'date'],
            'author' => ['nullable', 'string', 'max:255'],
            'flip_link' => ['nullable', 'url', 'max:255'],
            'code' => [
                'nullable',
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
            'view' => ['nullable', 'integer', 'min:0'],
            'is_available' => ['nullable', 'boolean'],
            'downloadable' => [$isEbook ? 'required_if:type,ebook' : 'nullable', 'boolean'],
            'cover' => ['nullable', 'image', 'mimes:jpeg,png', 'max:2048'],
            'pdf_url' => ['nullable', 'mimes:pdf', 'max:10240'],
            'category_id' => ['nullable', 'exists:categories,id'],
            'subcategory_id' => ['nullable', 'exists:sub_categories,id'],
            'shelf_id' => ['nullable', 'exists:shelves,id'],
            'bookcase_id' => ['nullable', 'exists:bookcases,id'],
            'grade_id' => ['nullable', 'exists:grades,id'],
            'subject_id' => ['nullable', 'exists:subjects,id'],
            'campus_id' => [$isEbook ? 'nullable' : 'required_if:type,physical', 'exists:campuses,id'],
        ];
    }

    /**
     * Get custom error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages()
    {
        return [
            'type.required' => 'Book type is required.',
            'type.in' => 'Book type must be either "physical" or "ebook".',
            'title.required' => 'Book title is required.',
            'title.string' => 'Book title must be a valid string.',
            'title.max' => 'Book title must not exceed 255 characters.',
            'description.required' => 'Book description is required.',
            'description.string' => 'Book description must be a valid string.',
            'page_count.required' => 'Page count is required.',
            'page_count.integer' => 'Page count must be a valid integer.',
            'page_count.min' => 'Page count must be at least 1.',
            'publisher.required' => 'Publisher name is required.',
            'publisher.string' => 'Publisher name must be a valid string.',
            'publisher.max' => 'Publisher name must not exceed 255 characters.',
            'language.required' => 'Language is required.',
            'language.in' => 'Language must be either "kh" (Khmer) or "en" (English).',
            'published_at.date' => 'Published date must be a valid date.',
            'published_at.date_format' => 'Published date must be in YYYY-MM-DD format.',
            'author.string' => 'Author name must be a valid string.',
            'author.max' => 'Author name must not exceed 255 characters.',
            'flip_link.url' => 'Flip link must be a valid URL.',
            'flip_link.max' => 'Flip link must not exceed 255 characters.',
            'code.required' => 'Book code is required.',
            'code.string' => 'Book code must be a valid string.',
            'code.max' => 'Book code must not exceed 10 characters.',
            'code.unique' => 'This book code is already in use.',
            'isbn.string' => 'ISBN must be a valid string.',
            'isbn.size' => 'ISBN must be exactly 13 characters.',
            'isbn.unique' => 'This ISBN is already in use.',
            'view.required' => 'The view field is required.',
            'view.integer' => 'View count must be a valid integer.',
            'view.min' => 'View count must be at least 0.',
            'is_available.required_if' => 'Availability is required for physical books.',
            'is_available.boolean' => 'Availability must be true or false.',
            'downloadable.required_if' => 'Downloadable status is required for e-books.',
            'downloadable.boolean' => 'Downloadable status must be true or false.',
            'cover.image' => 'Cover must be a valid image (JPEG or PNG).',
            'cover.mimes' => 'Cover must be a JPEG or PNG file.',
            'cover.max' => 'Cover image must not exceed 2MB.',
            'pdf_url.mimes' => 'File must be a valid PDF.',
            'pdf_url.max' => 'PDF file must not exceed 10MB.',
            'category_id.required' => 'Category is required.',
            'category_id.exists' => 'Selected category is invalid.',
            'subcategory_id.exists' => 'Selected subcategory is invalid.',
            'shelf_id.required_if' => 'Shelf is required for physical books.',
            'shelf_id.exists' => 'Selected shelf is invalid.',
            'bookcase_id.required_if' => 'Bookcase is required for physical books.',
            'bookcase_id.exists' => 'Selected bookcase is invalid.',
            'grade_id.exists' => 'Selected grade is invalid.',
            'subject_id.exists' => 'Selected subject is invalid.',
            'campus_id.required_if' => 'Campus is required for physical books.',
            'campus_id.exists' => 'Selected campus is invalid.',
        ];
    }
}
