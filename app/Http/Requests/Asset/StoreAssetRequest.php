<?php

namespace App\Http\Requests\Asset;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreAssetRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'asset_tag'          => 'required|string|unique:assets,asset_tag|max:255',
            'serial_number'      => 'nullable|string|max:255',
            'name'               => 'required|string|max:255',
            'asset_category_id' => 'required|integer|exists:asset_categories,id',
            'asset_subcategory_id' => [
                'nullable',
                'integer',
                Rule::exists('asset_sub_categories', 'id')->where(function ($query) {
                    return $query->where('asset_category_id', $this->asset_category_id);
                }),
            ],
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120', // 5 MB max
            'model'              => 'nullable|string|max:255',
            'purchase_order_id'  => 'nullable|integer|exists:purchase_orders,id',
            'supplier_id'        => 'nullable|integer|exists:suppliers,id',
            'purchase_date'      => 'required|date',
            'warranty_until'     => 'nullable|date|after_or_equal:purchase_date',
            'cost'               => 'required|numeric|min:0',
            'condition'          => ['required', Rule::in(['new', 'secondhand'])],
            'status'             => ['required', Rule::in([
                'available', 'allocated', 'maintenance',
                'disposed', 'lost', 'damaged'
            ])],
            'current_department_id' => 'nullable|integer|exists:departments,id',
            'current_room_id'       => 'nullable|integer|exists:rooms,id',
            'custodian_user_id'     => 'nullable|integer|exists:users,id',
            'notes'                 => 'nullable|string',
        ];
    }

    public function messages(): array
    {
        return [
            'asset_subcategory_id.exists' => 'The selected subcategory does not belong to the chosen category.',
            'purchase_order_id.exists'    => 'The selected purchase order is invalid.',
        ];
    }
}
