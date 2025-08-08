<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Shelf extends Model
{
   protected $fillable = ['code','bookcase_id'];

   public $timestamps = false;//disable timestamp

   public function bookcase(){
       return $this->belongsTo(Bookcase::class);
   }

    public function books()
    {
        return $this->hasMany(Book::class, 'shelf_id');
    }
}
