<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AssetCategory extends Model
{
    protected $table = 'asset_categories';
    protected $fillable = ['name'];

    public function subCategory(): HasMany{
        return $this->hasMany(SubCategory::class);
    }
    public function assets(): HasMany{
        return $this->hasMany(Asset::class);
    }
}
