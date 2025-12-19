<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('juicio_updates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('juicio_id')->constrained()->onDelete('cascade');
            $table->enum('tipo', ['auto', 'promocion', 'resolucion', 'sentencia'])->nullable();
            $table->string('titulo')->nullable();
            $table->text('sintesis')->nullable();
            $table->date('fecha_documento')->nullable();
            $table->string('documento_path')->nullable();
            $table->string('documento_nombre')->nullable();
            $table->boolean('ai_analyzed')->default(false);
            $table->json('ai_raw_response')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('juicio_updates');
    }
};
