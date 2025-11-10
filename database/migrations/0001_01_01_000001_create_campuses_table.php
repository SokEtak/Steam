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
        Schema::create('campuses', function (Blueprint $table) {
            // Primary Key
            $table->id();

            // Foreign Key to schools table
            $table->foreignId('school_id')
                ->constrained('schools')
                ->onDelete('cascade'); // Delete campuses if school is deleted

            // Campus Details
            $table->string('name', 150);
            $table->string('code', 20)->unique();
            $table->string('address')->nullable();
            $table->string('contact', 20)->nullable();
            $table->string('email', 100)->nullable()->unique();
            $table->string('website', 255)->nullable();
            // Timestamps
            $table->timestamps();

            // Indexes for performance
            $table->index('school_id');
            $table->index('name');
            $table->index('code');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('campuses');
    }
};
