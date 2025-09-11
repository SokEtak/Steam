<?php

namespace App\Http\Requests\Bookcase;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class StoreBookcaseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Auth::check() && Auth::user()->role_id == 2;
    }

    public function rules(): array
    {
        return ['code' => 'required|string|max:10'];
    }
}
