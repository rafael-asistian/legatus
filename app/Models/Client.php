<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Client extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'phone',
        'email',
        'client_since',
        'status',
    ];

    /**
     * Get the cases for the client.
     */
    public function cases(): HasMany
    {
        return $this->hasMany(LegalCase::class);
    }
}
