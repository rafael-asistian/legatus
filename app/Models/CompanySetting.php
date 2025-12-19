<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CompanySetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'legal_name',
        'rfc',
        'address',
        'city',
        'state',
        'postal_code',
        'phone',
        'email',
        'website',
        'logo_path',
    ];

    /**
     * Get the company settings (singleton pattern - always get first record).
     */
    public static function getSettings(): ?self
    {
        return self::first();
    }

    /**
     * Update or create company settings.
     */
    public static function updateSettings(array $data): self
    {
        $settings = self::first();
        
        if ($settings) {
            $settings->update($data);
            return $settings->fresh();
        }
        
        return self::create($data);
    }
}
