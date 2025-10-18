<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */

    public function up()
    {
        Schema::table('book_loans', function (Blueprint $table) {
            $table->enum('status', ['processing', 'returned', 'canceled'])->default('processing');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('book_loans', function (Blueprint $table) {
            $table->dropColumn('status');
        });
    }
};
