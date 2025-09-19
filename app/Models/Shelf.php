<?php

namespace App\Models;

use Illuminate\Support\Facades\Auth;
use Illuminate\Database\Eloquent\Model;

class Shelf extends Model
{
    protected $fillable = ['code', 'campus_id', 'bookcase_id'];
    public $timestamps = false;

    // Relationships
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

    // Scopes
    public function scopeForCurrentCampus($query)
    {
        return $query->where('campus_id', Auth::user()->campus_id);
    }

    public function scopeWithActiveBooks($query)
    {
        return $query->with([
            'bookcase:id,code,campus_id',
            'books' => fn($q) => $q->where('is_deleted', 0)
                ->where('campus_id', Auth::user()->campus_id)
                ->select('id', 'shelf_id', 'title', 'code', 'is_available', 'campus_id')
        ])->withCount([
            'books as books_count' => fn($q) => $q->where('is_deleted', 0)
                ->where('campus_id', Auth::user()->campus_id)
        ]);
    }

    public function scopeForCurrentCampusWithActiveBooks($query)
    {
        return $query->forCurrentCampus()->withActiveBooks();
    }

    // Instance method
    public function loadActiveBooks()
    {
        return $this->load([
            'bookcase:id,code,campus_id',
            'books' => fn($q) => $q->where('is_deleted', 0)
                ->where('campus_id', Auth::user()->campus_id)
                ->select('id', 'shelf_id', 'title', 'code', 'is_available', 'campus_id')
        ])->loadCount([
            'books as books_count' => fn($q) => $q->where('is_deleted', 0)
                ->where('campus_id', Auth::user()->campus_id)
        ]);
    }
}
