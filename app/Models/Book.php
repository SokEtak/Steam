<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Book extends Model
{
    protected $fillable = [
        'title', 'flip_link', 'code', 'isbn', 'view',
        'is_available', 'user_id', 'category_id', 'subcategory_id',
        'bookcase_id','shelf_id'
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

}
