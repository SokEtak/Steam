<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Campus extends Model
{
    protected $fillable = ['name'];

    public function books()
    {
        return $this->hasMany(Book::class);
    }

    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function bookloans()
    {
        return $this->hasMany(BookLoan::class);
    }

    public function shelves(){
        return $this->hasMany(Shelf::class);
    }

    public function bookcases(){
        return $this->hasMany(Bookcase::class);
    }
}
