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
        Schema::table('categories', function (Blueprint $table) {
            $table->string('image')->nullable()->change(); // Permet à l'image d'être NULL
        });
    }

    public function down()
    {
        Schema::table('categories', function (Blueprint $table) {
            $table->string('image')->nullable(false)->change(); // Revert back to NOT NULL if needed
        });
    }
};
