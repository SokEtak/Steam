<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Asset extends Model
{
    use HasFactory;

    protected $fillable = [
        'asset_tag', 'serial_number', 'name',
        'asset_category_id', 'asset_subcategory_id',
        'model','image','purchase_order_id', 'supplier_id',
        'purchase_date', 'warranty_until', 'cost',
        'condition', 'status',
        'current_department_id', 'current_room_id',
        'custodian_user_id', 'notes',
    ];

    protected $casts = [
        'purchase_date'   => 'date',
        'warranty_until'  => 'date',
        'cost'            => 'decimal:2',
    ];

    // Relationships
    public function category(): BelongsTo
    {
        return $this->belongsTo(AssetCategory::class, 'asset_category_id');
    }

    public function subCategory(): BelongsTo
    {
        return $this->belongsTo(AssetSubCategory::class, 'asset_subcategory_id');
    }

    public function purchaseOrder(): BelongsTo
    {
        return $this->belongsTo(PurchaseOrder::class);
    }

    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class, 'current_department_id');
    }

    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class, 'current_room_id');
    }

    public function custodian(): BelongsTo
    {
        return $this->belongsTo(User::class, 'custodian_user_id');
    }
}
