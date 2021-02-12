<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSaleMastersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sale_masters', function (Blueprint $table) {
            $table->id();
            $table->string('bill_number',20)->nullable(true);
            $table->string('order_date')->nullable(true);
            $table->string('delivery_date')->nullable(true);
            $table->string('comment',255)->nullable(true);

            $table->tinyInteger('inforce')->default('1');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('sale_masters');
    }
}
