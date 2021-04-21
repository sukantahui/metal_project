<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePurchaseDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('purchase_details', function (Blueprint $table) {
            $table->id();

            $table->bigInteger('purchase_master_id')->unsigned();
            $table ->foreign('purchase_master_id')->references('id')->on('purchase_masters')->onDelete('cascade');;

            $table->bigInteger('product_id')->unsigned();
            $table ->foreign('product_id')->references('id')->on('products')->onDelete('cascade');;

            $table->double('purchase_quantity')->default(0)->nullable(false);
            $table->double('stock_quantity')->default(0)->nullable(false);
            $table->double('rate')->default(0)->nullable(false);

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
        Schema::dropIfExists('purchase_details');
    }
}
