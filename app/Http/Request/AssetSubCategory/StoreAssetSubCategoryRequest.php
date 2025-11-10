<?php

namespace App\Http\Request\AssetSubCategory;

use Illuminate\Foundation\Http\FormRequest;

class StoreAssetSubCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'asset_category_id' => 'required|exists:asset_categories,id',
            'name' => 'required|string|max:255|unique:asset_sub_categories,name,NULL,id,asset_category_id,' . $this->asset_category_id,
        ];
    }
}
