<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Juicio extends Model
{
    use HasFactory;

    protected $fillable = [
        'legal_case_id',
        'court_id',
        'actor',
        'demandado',
        'expediente',
        'status',
        'fecha_inicio',
        'notas',
    ];

    protected $casts = [
        'fecha_inicio' => 'date',
    ];

    /**
     * Get the case that owns this juicio.
     */
    public function legalCase(): BelongsTo
    {
        return $this->belongsTo(LegalCase::class);
    }

    /**
     * Get the court (juzgado) for this juicio.
     */
    public function court(): BelongsTo
    {
        return $this->belongsTo(Court::class);
    }

    /**
     * Generate expediente number in format number/year.
     */
    public static function generateExpediente(): string
    {
        $year = date('Y');
        $lastJuicio = self::whereYear('created_at', $year)->orderBy('id', 'desc')->first();
        $nextNumber = $lastJuicio ? (intval(explode('/', $lastJuicio->expediente)[0]) + 1) : 1;
        return sprintf('%d/%s', $nextNumber, $year);
    }

    /**
     * Get the status label in Spanish.
     */
    public function getStatusLabelAttribute(): string
    {
        return match($this->status) {
            'activo' => 'Activo',
            'suspendido' => 'Suspendido',
            'archivado' => 'Archivado',
            default => $this->status,
        };
    }

    /**
     * Get the updates for this juicio.
     */
    public function updates(): HasMany
    {
        return $this->hasMany(JuicioUpdate::class)->orderBy('fecha_documento', 'desc');
    }
}

