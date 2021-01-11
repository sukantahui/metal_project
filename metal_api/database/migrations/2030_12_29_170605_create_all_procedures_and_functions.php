<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAllProceduresAndFunctions extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::unprepared('DROP PROCEDURE IF EXISTS getUsers;
                        CREATE PROCEDURE getUsers()
                        BEGIN
                            SELECT * FROM users;
                        END'
        );
        //getting purchase total from purchase_master_id
        DB::unprepared(
            'DROP FUNCTION if exists get_purchase_total_by_id;
             CREATE FUNCTION get_purchase_total_by_id (in_pm_id bigint) RETURNS double
                DETERMINISTIC
                BEGIN
                  declare out_total_sale double;
                  declare out_total_extra double;
                  declare out_actual_sale double;
                  select sum(purchase_quantity*rate) into out_total_sale from purchase_details where purchase_master_id=in_pm_id;
                  select sum(amount*item_type) into out_total_extra from purchase_extras where purchase_master_id=in_pm_id;
                  IF(out_total_sale IS NULL) THEN
                    SET out_total_sale := 0;
                  END IF;

                  IF(out_total_extra IS NULL) THEN
                    SET out_total_extra := 0;
                  END IF;

                  set out_actual_sale := out_total_sale + out_total_extra;
                    RETURN out_actual_sale;
                END'
        );
        //getting purchase total from transaction_number
        DB::unprepared(
            'DROP FUNCTION if exists get_purchase_total_by_transaction_number;
             CREATE FUNCTION get_purchase_total_by_transaction_number (in_transaction_number varchar(20)) RETURNS double
                DETERMINISTIC
                BEGIN
                  declare out_total_sale double;
                  declare out_total_extra double;
                  declare out_actual_sale double;
                  declare temp_pm_id int;
                  select purchase_master_id into temp_pm_id from transaction_masters where transaction_number=in_transaction_number;
                  select sum(purchase_quantity*rate) into out_total_sale from purchase_details where purchase_master_id=temp_pm_id;
                  select sum(amount*item_type) into out_total_extra from purchase_extras where purchase_master_id=temp_pm_id;
                  IF(out_total_sale IS NULL) THEN
                    SET out_total_sale := 0;
                  END IF;

                  IF(out_total_extra IS NULL) THEN
                    SET out_total_extra := 0;
                  END IF;

                  set out_actual_sale := out_total_sale + out_total_extra;
                    RETURN out_actual_sale;
                END'
        );

    }

    public function down()
    {
        Schema::dropIfExists('all_procedures_and_functions');
    }
}
