<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProductsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('product_name',50);
            $table->string('description',50)->nullable(true);

            $table->bigInteger('product_category_id')->unsigned();
            $table ->foreign('product_category_id')->references('id')->on('product_categories');

            $table->bigInteger('purchase_unit_id')->unsigned();
            $table ->foreign('purchase_unit_id')->references('id')->on('units');

            $table->bigInteger('sale_unit_id')->unsigned();
            $table ->foreign('sale_unit_id')->references('id')->on('units');

            $table->integer('gst_rate')->default(12);
            $table->string('hsn_code',12)->nullable(true);

            $table->tinyInteger('inforce')->default(1);
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
        Schema::dropIfExists('products');
    }
}
