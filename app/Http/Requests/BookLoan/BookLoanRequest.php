<?php

namespace App\Http\Requests\BookLoan;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class BookLoanRequest extends FormRequest
{
    public function authorize()
    {
        return Auth::check() && Auth::user()->role_id == 2;
    }

    public function rules()
    {
        return [
            'return_date' => 'required|date',
            'book_id' => 'required|exists:books,id',
            'user_id' => 'required|exists:users,id',
        ];
    }

    public function validatedWithExtras()
    {
        $validated = $this->validated();
        $validated['campus_id'] = Auth::user()->campus_id;
        $validated['status'] = 'processing';

        return $validated;
    }
}
