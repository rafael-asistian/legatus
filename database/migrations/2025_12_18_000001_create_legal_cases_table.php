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
        Schema::create('legal_cases', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained()->onDelete('cascade');
            $table->foreignId('assigned_attorney_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('case_number')->unique();
            $table->string('title');
            $table->text('description')->nullable();
            $table->enum('status', ['nuevo', 'en_proceso', 'cerrado'])->default('nuevo');
            $table->enum('priority', ['baja', 'media', 'alta'])->default('media');
            $table->enum('type', ['reclamacion', 'litigio', 'consulta'])->default('reclamacion');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('legal_cases');
    }
};
