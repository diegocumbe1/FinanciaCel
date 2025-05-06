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
        Schema::create('instalments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('credit_application_id')->constrained()->onDelete('cascade');
            $table->integer('number'); // número de cuota (1, 2, 3...)
            $table->decimal('amount', 12, 2); // valor de la cuota
            $table->date('due_date'); // fecha de vencimiento
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('instalments');
    }
};
