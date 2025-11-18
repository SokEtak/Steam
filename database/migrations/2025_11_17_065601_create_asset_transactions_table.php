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
        Schema::create('asset_transactions', function (Blueprint $table) {
            $table->id();

            // Foreign key to assets table
            $table->foreignId('asset_id')
                ->constrained()
                ->onDelete('cascade');

            // Type of movement
            $table->enum('type', [
                'received',
                'allocated',
                'returned',
                'transfer',
                'maintenance_start',
                'maintenance_end',
                'disposed'
            ])->index();

            // Previous department (nullable)
            $table->foreignId('from_department_id')
                ->nullable()
                ->constrained('departments')
                ->onDelete('set null');

            // New department (nullable)
            $table->foreignId('to_department_id')
                ->nullable()
                ->constrained('departments')
                ->onDelete('set null');

            // Previous room (nullable)
            $table->foreignId('from_room_id')
                ->nullable()
                ->constrained('rooms')
                ->onDelete('set null');

            // New room (nullable)
            $table->foreignId('to_room_id')
                ->nullable()
                ->constrained('rooms')
                ->onDelete('set null');

            // User who performed the action
            $table->foreignId('performed_by')
                ->constrained('users')
                ->onDelete('restrict');

            // Timestamp of the action
            $table->timestamp('performed_at')->useCurrent();

            // Optional note
            $table->text('note')->nullable();
            $table->timestamps();

            // Composite index for common queries
            $table->index(['asset_id', 'performed_at']);
            $table->index(['performed_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('asset_movements');
    }
};
