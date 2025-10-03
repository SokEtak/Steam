<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;


class User extends Authenticatable
{

    use HasApiTokens;

    //scope available loaners who are regular user
    public function scopeLoaners($query,$campus_id)
    {
        return $query->select(['id', 'name'])
            ->where([
                'role_id'=>1,
                'isActive'=>1,
                'campus_id'=>$campus_id,
            ]);
    }

    public function scopeActive($query)
    {
        return $query->select(['id', 'name', 'email', 'created_at','avatar','role_id','campus_id'])
            ->where('isActive', 1   );
    }
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'avatar',
        'role_id',
        'campus_id',
        'facebook_id',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function books(){
        return $this->hasMany(Book::class);
    }

    public function bookloans(){
        return $this->hasMany(BookLoan::class);
    }

    public function campus(){
        return $this->belongsTo(Campus::class);
    }

    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }
}
