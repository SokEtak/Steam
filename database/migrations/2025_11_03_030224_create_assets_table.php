<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('assets', function (Blueprint $table) {
            $table->id();

            $table->string('asset_tag')->unique();
            $table->string('serial_number')->nullable();
            $table->string('name');

            $table->foreignId('asset_category_id')
                ->constrained('asset_categories')
                ->onDelete('cascade');

            $table->foreignId('asset_subcategory_id')
                ->nullable()
                ->constrained('asset_sub_categories')
                ->onDelete('set null');

            $table->string('model')->nullable();

            // Image column (stores the path or URL)
            $table->string('image')->nullable();

            // Purchase Order — nullable, with FK
            $table->foreignId('purchase_order_id')
                ->nullable()
                ->constrained('purchase_orders')
                ->onDelete('set null');

            $table->foreignId('supplier_id')
                ->nullable()
                ->constrained('suppliers')
                ->onDelete('set null');

            $table->date('purchase_date');
            $table->date('warranty_until')->nullable();
            $table->decimal('cost', 12, 2);

            $table->enum('condition', ['new', 'secondhand']);
            $table->enum('status', [
                'available', 'allocated', 'maintenance',
                'disposed', 'lost', 'damaged'
            ])->default('available');

            $table->foreignId('current_department_id')
                ->nullable()
                ->constrained('departments')
                ->onDelete('set null');

            $table->foreignId('current_room_id')
                ->nullable()
                ->constrained('rooms')
                ->onDelete('set null');

            $table->foreignId('custodian_user_id')
                ->nullable()
                ->constrained('users')
                ->onDelete('set null');

            $table->text('notes')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('assets');
    }
};
