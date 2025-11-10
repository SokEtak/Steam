<?php

namespace App\Http\Requests\Room;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateRoomRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'building_id'   => 'required|exists:buildings,id',
            'department_id' => 'required|exists:departments,id', // REQUIRED
            'name'          => 'required|string|max:150',
            'room_number'   => [
                'required',
                'string',
                'max:20',
                Rule::unique('rooms', 'room_number')->ignore($this->route('room')->id),
            ],
            'floor'         => 'required|integer|min:0|max:50',
        ];
    }

    public function messages(): array
    {
        return [
            'building_id.required'     => 'សូមជ្រើសរើសអគារ។',
            'department_id.required'   => 'សូមជ្រើសរើសនាយកដ្ឋាន។',
            'department_id.exists'     => 'នាយកដ្ឋានដែលបានជ្រើសរើសមិនត្រឹមត្រូវ។',
            'name.required'            => 'ឈ្មោះបន្ទប់ត្រូវតែបំពេញ។',
            'room_number.required'     => 'លេខបន្ទប់ត្រូវតែបំពេញ។',
            'room_number.unique'       => 'លេខបន្ទប់នេះត្រូវបានប្រើប្រាស់រួចហើយ។',
            'floor.required'           => 'ជាន់ត្រូវតែបំពេញ។',
        ];
    }

    public function attributes(): array
    {
        return [
            'building_id'   => 'អគារ',
            'department_id' => 'នាយកដ្ឋាន',
            'name'          => 'ឈ្មោះបន្ទប់',
            'room_number'   => 'លេខបន្ទប់',
            'floor'         => 'ជាន់',
        ];
    }
}
