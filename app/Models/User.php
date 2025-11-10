<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;


class User extends Authenticatable
{

    use HasApiTokens,HasRoles;

    //scope available loaners who are regular user
    public function scopeLoaners($query, $campus_id)
    {
        return $query->select(['users.id', 'users.name'])
            ->join('model_has_roles', function ($join) {
                $join->on('users.id', '=', 'model_has_roles.model_id')
                    ->where('model_has_roles.model_type', '=', self::class);
            })
            ->join('roles', function ($join) {
                $join->on('model_has_roles.role_id', '=', 'roles.id')
                    ->where('roles.name', '=', 'regular-user');
            })
            ->where('users.isActive', 1)
            ->where('users.campus_id', $campus_id);
    }

    public function scopeActive($query)
    {
        return $query->select([
            'id', 'name', 'email', 'created_at', 'avatar', 'campus_id','isActive','isVerified'
        ])->where('isActive', 1);
//        ->pms('regular-user');//add other pms as needed or filter based on pms
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
        'campus_id',
        'facebook_id',
        'google_id',
        'isVerified',
        'isActive',
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

    public function purchaseOrders(): HasMany
    {
        return $this->hasMany(PurchaseOrder::class, 'created_by');
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
