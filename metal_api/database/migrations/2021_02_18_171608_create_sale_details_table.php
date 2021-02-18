<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSaleDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sale_details', function (Blueprint $table) {
            $table->id();

            $table->bigInteger('sale_master_id')->unsigned();
            $table->foreign('sale_master-id')->references('id')->on('sale_masters');

            $table->bigInteger('product_id');
            $table->foreign('product_id')->references('id')->on('products');

            $table->double('quantity')->default(0)->nullable(false);
            $table->double('price')->default(0)->nullable(false);



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
        Schema::dropIfExists('sale_details');
    }
}
