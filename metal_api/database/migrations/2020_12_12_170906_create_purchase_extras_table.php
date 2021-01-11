<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePurchaseExtrasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('purchase_extras', function (Blueprint $table) {
            $table->id();

            $table->bigInteger('purchase_master_id')->unsigned();
            $table ->foreign('purchase_master_id')->references('id')->on('purchase_masters');

            $table->bigInteger('extra_item_id')->unsigned();
            $table ->foreign('extra_item_id')->references('id')->on('extra_items');

            $table->double('amount')->default(0);
            $table->integer('item_type')->default(0);   //item_type describes income(1)/expense(-1) recorded

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
        Schema::dropIfExists('purchase_extras');
    }
}
