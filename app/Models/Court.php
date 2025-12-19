<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Court extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'level',
        'city',
        'state',
        'address',
        'phone',
        'email',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Scope for local courts.
     */
    public function scopeLocal($query)
    {
        return $query->where('level', 'local');
    }

    /**
     * Scope for federal courts.
     */
    public function scopeFederal($query)
    {
        return $query->where('level', 'federal');
    }

    /**
     * Scope for active courts.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Get the level label in Spanish.
     */
    public function getLevelLabelAttribute(): string
    {
        return match($this->level) {
            'local' => 'Local',
            'federal' => 'Federal',
            default => $this->level,
        };
    }
}
