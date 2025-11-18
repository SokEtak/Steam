<?php

namespace App\Http\Requests\AssetTransaction;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreAssetTransactionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to create an asset transaction.
     */
    public function authorize(): bool
    {
        // Change this according to your policy (e.g. only admins or asset managers)
        return auth()->check(); // or return auth()->user()->can('create asset transactions');
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'asset_id'         => ['required', 'integer', 'exists:assets,id'],
            'type'             => [
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
            'performed_by'       => ['required', 'integer', 'exists:users,id'],
            'performed_at'       => ['required', 'date'],
            'note'               => ['nullable', 'string', 'max:1000'],
        ];
    }

    /**
     * Custom message (optional - you can translate later)
     */
    public function messages(): array
    {
        return [
            'asset_id.required' => 'The asset is required.',
            'asset_id.exists'    => 'The selected asset does not exist.',
            'type.required'      => 'Transaction type is required.',
            'type.in'            => 'Invalid transaction type.',
            'performed_by.exists'=> 'The user who performed this action does not exist.',
            'performed_at.date'  => 'Performed date must be a valid date/time.',
        ];
    }
}
