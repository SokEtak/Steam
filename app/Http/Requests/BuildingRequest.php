<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class BuildingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('building')?->id;

        return [
            'campus_id' => ['required', 'exists:campuses,id'],
            'name'      => ['required', 'string', 'max:255'],
            'code'      => ['required', 'string', 'max:50', Rule::unique('buildings')->ignore($id)],
            'floors'    => ['required', 'integer', 'min:1', 'max:200'],
        ];
    }
}
