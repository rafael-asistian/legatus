<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class JuicioUpdate extends Model
{
    use HasFactory;

    protected $fillable = [
        'juicio_id',
        'tipo',
        'titulo',
        'sintesis',
        'fecha_documento',
        'documento_path',
        'documento_nombre',
        'ai_analyzed',
        'ai_raw_response',
    ];

    protected $casts = [
        'fecha_documento' => 'date',
        'ai_analyzed' => 'boolean',
        'ai_raw_response' => 'array',
    ];

    /**
     * Get the juicio that owns this update.
     */
    public function juicio(): BelongsTo
    {
        return $this->belongsTo(Juicio::class);
    }

    /**
     * Get the type label in Spanish.
     */
    public function getTipoLabelAttribute(): string
    {
        return match($this->tipo) {
            'auto' => 'Auto',
            'promocion' => 'Promoción',
            'resolucion' => 'Resolución',
            'sentencia' => 'Sentencia',
            default => $this->tipo ?? 'Sin clasificar',
        };
    }

    /**
     * Get the type color for UI.
     */
    public function getTipoColorAttribute(): string
    {
        return match($this->tipo) {
            'auto' => 'bg-blue-100 text-blue-700',
            'promocion' => 'bg-purple-100 text-purple-700',
            'resolucion' => 'bg-orange-100 text-orange-700',
            'sentencia' => 'bg-red-100 text-red-700',
            default => 'bg-gray-100 text-gray-700',
        };
    }
}
