<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organizer_id')->constrained('event_organizers')->onDelete('cascade');
            $table->string('title');
            $table->text('description');
            $table->datetime('event_date');
            $table->string('location');
            $table->integer('capacity');
            $table->string('status')->default('draft');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('events');
    }
}; 