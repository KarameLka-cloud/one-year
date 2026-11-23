<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rsvps', function (Blueprint $table) {
            $table->id();
            $table->string('name', 120);
            $table->string('pair', 120)->nullable();
            $table->string('attendance', 10)->default('yes');
            $table->unsignedTinyInteger('children')->default(0);
            $table->timestamps();

            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rsvps');
    }
};
