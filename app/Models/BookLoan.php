<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BookLoan extends Model
{
    protected $fillable = ['return_date', 'book_id', 'user_id','campus_id','is_deleted'];
    public function scopeActive($query)
    {
        return $query->where('is_deleted', false);
    }

    public function book()
    {
        return $this->belongsTo(Book::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function campus()
    {
        return $this->belongsTo(Campus::class);
    }
}
