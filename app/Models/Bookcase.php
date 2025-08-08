<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Bookcase extends Model
{
    protected $fillable = ['code'];

    public $timestamps = false;

    public function books(): HasMany
    {
        return $this->hasMany(Book::class, 'bookcase_id');
    }

    public function shelves(): hasMany
    {
        return $this->hasMany(Shelf::class, 'bookcase_id');
    }
}
