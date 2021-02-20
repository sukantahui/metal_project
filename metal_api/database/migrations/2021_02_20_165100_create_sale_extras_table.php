<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSaleExtrasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sale_extras', function (Blueprint $table) {
            $table->id();

            $table->bigInteger('sale_master_id')->unsigned();
            $table->foreign('sale_master_id')->references('id')->on('sale_masters');

            $table->bigInteger('extra_item_id')->unsigned();
            $table->foreign('extra_item_id')->references('id')->on('extra_items');

            $table->double('amount')->default(0);
            $table->integer('item_type')->default(0);

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
        Schema::dropIfExists('sale_extras');
    }
}
