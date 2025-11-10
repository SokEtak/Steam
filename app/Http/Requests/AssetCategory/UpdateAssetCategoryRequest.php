<?php

namespace App\Http\Requests\AssetCategory;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateAssetCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('asset_categories', 'name')->ignore($this->route('asset_category')->id),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'សូមបំពេញឈ្មោះប្រភេទទ្រព្យ។',
            'name.unique' => 'ឈ្មោះប្រភេទនេះត្រូវបានប្រើប្រាស់រួចហើយ។',
        ];
    }

    public function attributes(): array
    {
        return [
            'name' => 'ឈ្មោះប្រភេទទ្រព្យ',
        ];
    }
}
