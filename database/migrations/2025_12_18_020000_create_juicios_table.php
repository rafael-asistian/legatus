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
        Schema::create('juicios', function (Blueprint $table) {
            $table->id();
            $table->foreignId('legal_case_id')->constrained()->onDelete('cascade');
            $table->foreignId('court_id')->nullable()->constrained()->onDelete('set null');
            $table->string('actor'); // Plaintiff
            $table->string('demandado'); // Defendant
            $table->string('expediente'); // Case file number (e.g., "1234/2025")
            $table->enum('status', ['activo', 'suspendido', 'archivado'])->default('activo');
            $table->date('fecha_inicio')->nullable(); // Start date
            $table->text('notas')->nullable(); // Notes
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('juicios');
    }
};
