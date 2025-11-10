<?php

namespace App\Http\Requests\Supplier;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSupplierRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $supplier = $this->route('supplier');

        return [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('suppliers')->ignore($supplier->id),
            ],
            'contact_person' => 'nullable|string|max:255',
            'phone' => [
                'nullable',
                'string',
                'max:20',
                Rule::unique('suppliers')->ignore($supplier->id),
            ],
            'email' => [
                'nullable',
                'email',
                'max:255',
                Rule::unique('suppliers')->ignore($supplier->id),
            ],
            'address' => 'nullable|string',
        ];
    }
}
