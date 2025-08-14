<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Book extends Model
{
    protected $fillable = [
        'title', 'pdf_url' , 'flip_link','cover', 'code', 'isbn', 'view',
        'is_available', 'user_id', 'category_id', 'subcategory_id',
        'bookcase_id','shelf_id','grade_id','subject_id','is_deleted'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function subcategory(): BelongsTo
    {
        return $this->belongsTo(SubCategory::class);
    }

    public function bookcase(): BelongsTo
    {
        return $this->belongsTo(Bookcase::class, 'bookcase_id');
    }

    public function shelf(): BelongsTo{
        return $this->belongsTo(Shelf::class, 'shelf_id');
    }

    public function bookloands(): HasMany{
        return $this->hasMany(BookLoan::class, 'book_id');
    }

    public function grade(): BelongsTo{
        return $this->belongsTo(Grade::class, 'grade_id');
    }

    public function subject(): BelongsTo{
        return $this->belongsTo(Subject::class, 'subject_id');
    }

}
