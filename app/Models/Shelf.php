<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Shelf extends Model
{
    protected $fillable = ['code', 'campus_id', 'bookcase_id'];
    public $timestamps = false;

    public function bookcase()
    {
        return $this->belongsTo(Bookcase::class);
    }

    public function books()
    {
        return $this->hasMany(Book::class, 'shelf_id');
    }

    public function campus()
    {
        return $this->belongsTo(Campus::class);
    }

    public function scopeWithActiveBooks($query)
    {
        return $query->with([
            'bookcase:id,code,campus_id',
            'books' => fn($q) => $q->where('is_deleted', 0)
                ->select('id', 'shelf_id', 'title', 'code', 'is_available')
        ])->withCount([
            'books as books_count' => fn($q) => $q->where('is_deleted', 0)
        ]);
    }

    public function loadActiveBooks()
    {
        return $this->load([
            'bookcase:id,code',
            'books' => fn($q) => $q->where('is_deleted', 0)
                ->select('id', 'shelf_id', 'title', 'code', 'is_available')
        ])->loadCount([
            'books as books_count' => fn($q) => $q->where('is_deleted', 0)
        ]);
    }
}
