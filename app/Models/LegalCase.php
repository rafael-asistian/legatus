<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LegalCase extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_id',
        'assigned_attorney_id',
        'case_number',
        'title',
        'description',
        'status',
        'priority',
        'type',
    ];

    /**
     * Get the client that owns the case.
     */
    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    /**
     * Get the attorney assigned to the case.
     */
    public function assignedAttorney(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_attorney_id');
    }

    /**
     * Get the juicios (court procedures) for this case.
     */
    public function juicios(): HasMany
    {
        return $this->hasMany(Juicio::class);
    }

    /**
     * Generate the next case number.
     */
    public static function generateCaseNumber(): string
    {
        $year = date('Y');
        $lastCase = self::whereYear('created_at', $year)->orderBy('id', 'desc')->first();
        $nextNumber = $lastCase ? (intval(substr($lastCase->case_number, -4)) + 1) : 1;
        return sprintf('LEG-%s-%04d', $year, $nextNumber);
    }
}
