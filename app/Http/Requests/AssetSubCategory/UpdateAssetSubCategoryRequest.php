<?php

namespace App\Http\Requests\AssetSubCategory;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAssetSubCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'asset_category_id' => 'required|exists:asset_categories,id',
            'name' => 'required|string|max:255|unique:asset_sub_categories,name,' . $this->id . ',id,asset_category_id,' . $this->asset_category_id,
        ];
    }
}
