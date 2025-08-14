<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
    public function books(){
        return $this->hasMany(Book::class, 'grade_id', 'id');
    }

}
