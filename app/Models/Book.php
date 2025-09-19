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

    //used by bookcase
    public function scopePhysicalAndActiveForCampus($query)
    {
        return $query->where([
            'type' => 'physical',
            'is_deleted' => 0,
            'campus_id' => Auth::user()->campus_id,
        ]);
    }

    // Scope for active (non-deleted) books which belong to a specific user
    public function scopeActive($query, $book_type)
    {
        $conditions = [];
        $role_id = Auth::user()->role_id;

        // Default to non-deleted books unless specified otherwise
        $conditions['is_deleted'] = 0;

        // Apply campus_id filter only for role_id = 2
        if ($role_id == 2) {
            $conditions['campus_id'] = Auth::user()->campus_id;
        }
        // For role_id = 3, no campus_id filter (access all campuses)

        if ($book_type !== null) {
            if ($book_type === 'delBook') {
                $conditions['is_deleted'] = 1; // For deleted books
                // Hardcode campus_id = 1 for delBook, or rely on role_id = 2 filter
                // $conditions['campus_id'] = 1; // Uncomment to hardcode campus_id = 1
            } elseif ($book_type === 'miss') {
                $conditions['is_available'] = 0; // For missing books (not found at bookcase/shelf)
                $conditions['is_deleted'] = 0; // Ensure non-deleted
            } else {
                $conditions['type'] = $book_type; // Filter by type (e.g., 'physical', 'ebook')
                $conditions['is_available'] = 1; // Other types require is_available = 1
                $conditions['is_deleted'] = 0; // Ensure non-deleted
            }
        }
        // When $book_type is null, no is_available or type filters are applied

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
