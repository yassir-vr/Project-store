<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->decimal('price', 10, 2);
            $table->boolean('is_active')->default(true);  // Pour activer/désactiver le produit
            $table->foreignId('category_id')->constrained()->onDelete('cascade'); // Relation avec la table categories
            $table->string('image')->nullable(); // Pour l'image du produit
            $table->enum('sale_attribute', ['1kg', '500g', 'piece'])->nullable(); // Attribut de vente
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('products');
    }
};
