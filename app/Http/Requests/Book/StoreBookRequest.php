<?php

namespace App\Http\Requests\Book;

use Illuminate\Foundation\Http\FormRequest;

class StoreBookRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'flip_link' => ['nullable', 'url'],
            'cover' => ['nullable', 'image', 'mimes:jpeg,png', 'max:2048'],
            'code' => ['nullable', 'string', 'max:50'],
            'isbn' => ['nullable', 'string', 'max:13'],
            'view' => ['nullable', 'integer', 'min:0'],
            'is_available' => ['required', 'boolean'],
            'pdf_url' => ['nullable', 'file', 'mimes:pdf', 'max:10000'],
            'user_id' => ['required', 'exists:users,id'],
            'category_id' => ['required', 'exists:categories,id'],
            'subcategory_id' => ['nullable', 'exists:subcategories,id'],
            'bookcase_id' => ['nullable', 'exists:bookcases,id'],
            'shelf_id' => ['nullable', 'exists:shelves,id'],
            'grade_id' => ['nullable', 'exists:grades,id'],
            'subject_id' => ['nullable', 'exists:subjects,id'],
        ];
    }

    public function prepareForValidation()
    {
        $fields = [
            'subcategory_id',
            'bookcase_id',
            'shelf_id',
            'grade_id',
            'subject_id'
        ];

        foreach ($fields as $field) {
            if ($this->$field === 'none') {
                $this->merge([$field => null]);
            }
        }
    }

}
