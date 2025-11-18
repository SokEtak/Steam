<?php

namespace App\Http\Requests\AssetTransaction;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateAssetTransactionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to update the asset transaction.
     */
    public function authorize(): bool
    {
        // You can tighten this with policies, e.g.:
        // return auth()->user()->can('update', $this->route('asset_transaction'));
        return auth()->check();
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'asset_id'         => ['sometimes', 'required', 'integer', 'exists:assets,id'],
            'type'             => [
                'sometimes',
                'required',
                'string',
                Rule::in([
                    'received',
                    'allocated',
                    'returned',
                    'transfer',
                    'maintenance_start',
                    'maintenance_end',
                    'disposed'
                ])
            ],
            'from_department_id' => ['nullable', 'integer', 'exists:departments,id'],
            'to_department_id'   => ['nullable', 'integer', 'exists:departments,id'],
            'from_room_id'       => ['nullable', 'integer', 'exists:rooms,id'],
            'to_room_id'         => ['nullable', 'integer', 'exists:rooms,id'],
            'performed_by'       => ['sometimes', 'required', 'integer', 'exists:users,id'],
            'performed_at'       => ['sometimes', 'required', 'date'],
            'note'               => ['nullable', 'string', 'max:1000'],
        ];
    }

    public function messages(): array
    {
        return [
            'asset_id.exists'    => 'The selected asset does not exist.',
            'type.in'            => 'Invalid transaction type.',
            'performed_by.exists'=> 'The selected user does not exist.',
        ];
    }
}
