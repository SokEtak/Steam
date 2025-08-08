<?php

namespace App\Http\Requests\Book;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBookRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'flip_link' => 'required|url',
            'code' => 'required|string|max:255',
            'isbn' => 'required|string|max:13',
            'view' => 'required',
            'is_available' => 'required|boolean',
            'user_id' => 'required|exists:users,id',
            'category_id' => 'required|exists:categories,id',
            'subcategory_id' => 'nullable|exists:sub_categories,id',
            'bookcase_id' => 'nullable|exists:bookcases,id',
            'shelf_id' => 'nullable|exists:shelves,id',
        ];
    }

    protected function prepareForValidation()
    {
        if ($this->input('subcategory_id') === 'null') {
            $this->merge(['subcategory_id' => null]);
        }
        if ($this->input('bookcase_id') === 'null') {
            $this->merge(['bookcase_id' => null]);
        }

        if ($this->input('shelf_id') === 'null') {
            $this->merge(['shelf_id' => null]);
        }
    }
}
