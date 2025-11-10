<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateDepartmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'campus_id' => 'required|exists:campuses,id',
            'building_id' => 'nullable|exists:buildings,id',
            'name' => 'required|string|max:255',
            'code' => [
                'required',
                'string',
                'max:50',
                Rule::unique('departments')->ignore($this->department),
            ],
            'head_user_id' => 'nullable|exists:users,id',
        ];
    }
}
