<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class Book extends Model
{
    protected $guarded = [];

    // Include relationships in queries by default
    protected $with = [
        'user:id,name',
        'category:id,name',
        'subcategory:id,name',
        'shelf:id,code',
        'grade:id,name',
        'subject:id,name',
        'bookcase:id,code',
        'campus:id,name',
    ];

    // Select columns based on schema
    protected static $selectColumns = [
        'id',
        'title',
        'description',
        'page_count',
        'publisher',
        'language',
        'published_at',
        'cover',
        'pdf_url',
        'flip_link',
        'view',
        'is_available',
        'author',
        'code',
        'isbn',
        'type',
        'downloadable',
        'user_id',
        'category_id',
        'subcategory_id',
        'bookcase_id',
        'shelf_id',
        'subject_id',
        'grade_id',
        'campus_id',
//        'is_deleted',
        'created_at',
        'updated_at'
    ];

    // Casts for specific fields
    protected $casts = [
        'is_available' => 'boolean',
        'is_deleted' => 'boolean',
        'published_at' => 'date',
        'downloadable' => 'integer',
    ];

    // Scope for active (non-deleted) books which belong to a specific user
    public function scopeActive($query, $book_type)
    {
        $conditions = ['is_deleted' => 0];
        $role_id = Auth::user()->role_id;

        if ($role_id == 2) {
            $conditions['campus_id'] = Auth::user()->campus_id;
        } elseif ($role_id != 3) {//use not equal for user to adapt with user and admin
            return $query->where('is_deleted', 999);
        }

        if ($book_type !== null) {
            $conditions['type'] = $book_type; // Filter by type (e.g., 'physical' or 'ebook')
        }
        return $query->where($conditions)->select(self::$selectColumns);
    }

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function bookcase(){
        return $this->belongsTo(Bookcase::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function subcategory()
    {
        return $this->belongsTo(SubCategory::class, 'subcategory_id');
    }

    public function shelf()
    {
        return $this->belongsTo(Shelf::class, 'shelf_id');
    }

    public function grade()
    {
        return $this->belongsTo(Grade::class);
    }

    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }

    public function campus()
    {
        return $this->belongsTo(Campus::class, 'campus_id');;
    }
}
