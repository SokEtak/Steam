<?php

namespace App\Http\Requests\Asset;

use Illuminate\Validation\Rule;

class UpdateAssetRequest extends StoreAssetRequest
{
    public function rules(): array
    {
        $rules = parent::rules();

        // Only make asset_tag unique except for current asset
        $rules['asset_tag'] = [
            'required',
            'string',
            'max:255',
            Rule::unique('assets', 'asset_tag')->ignore($this->route('asset')?->id),
        ];

        return $rules;
    }
}
