<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTransactionMastersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('transaction_masters', function (Blueprint $table) {
            $table->id();
            $table->string('transaction_number',20)->unique()->nullable(false);

            $table->bigInteger('reference_transaction_master_id')->unsigned()->nullable(true);

            $table->bigInteger('user_id')->unsigned();
            $table ->foreign('user_id')->references('id')->on('ledgers');

            $table->bigInteger('voucher_type_id')->unsigned();
            $table ->foreign('voucher_type_id')->references('id')->on('voucher_types');

            $table->bigInteger('purchase_master_id')->unsigned();
            $table ->foreign('purchase_master_id')->references('id')->on('purchase_masters');

            $table->date('transaction_date');

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
        Schema::dropIfExists('transaction_masters');
    }
}
