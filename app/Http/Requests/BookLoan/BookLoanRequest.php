<?php

namespace App\Http\Requests\BookLoan;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class BookLoanRequest extends FormRequest
{
    public function authorize()
    {
        return $this->user()->hasRole('staff');
    }

    public function rules()
    {
        return [
            'return_date' => 'required|date',
            'book_id' => 'required|exists:books,id',
            'user_id' => 'required|exists:users,id',
            'status'  => 'required|in:processing,canceled,returned',
        ];
    }

    public function validatedWithExtras()
    {
        $validated = $this->validated();
        $validated['campus_id'] = Auth::user()->campus_id;

        return $validated;
    }
}
