<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Bookcase extends Model
{
    protected $fillable = ['code', 'campus_id'];
    public $timestamps = false;

    public function books(): HasMany
    {
        return $this->hasMany(Book::class, 'bookcase_id');
    }

    public function shelves(): HasMany
    {
        return $this->hasMany(Shelf::class, 'bookcase_id');
    }

    public function campus()
    {
        return $this->belongsTo(Campus::class);
    }

    public function scopeWithBookCountsAndBooks($query)
    {
        return $query->with(['books' => fn($q) => $q->where('is_deleted', 0)
            ->select(['id', 'title', 'code', 'is_available', 'bookcase_id'])
        ])->withCount([
            'books as total_books_count',
            'books as active_books_count' => fn($q) => $q->where('is_deleted', 0)
        ]);
    }
}
