<?php

namespace App\Http\Requests\PurchaseOrder;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePurchaseOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        // ❌ OLD (camelCase)
        // $this->route('purchaseOrder')->id

        // ✅ NEW (snake_case)
        $purchaseOrderId = $this->route('purchase_order')->id;

        return [
            'po_number' => 'required|string|unique:purchase_orders,po_number,' . $purchaseOrderId,
            'supplier_id' => 'required|exists:suppliers,id',
            'order_date' => 'required|date',
            'total_amount' => 'required|numeric|min:0',
            'status' => 'required|in:draft,sent,confirmed,received,cancelled',
        ];
    }

    public function messages(): array
    {
        return [
            'po_number.unique' => 'PO number already exists.',
            'supplier_id.exists' => 'Selected supplier is invalid.',
            'status.in' => 'Invalid status.',
        ];
    }
}
