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
        DB::unprepared(
            'DROP FUNCTION if exists get_purchase_total_by_id;
             CREATE FUNCTION get_purchase_total_by_id (in_pm_id bigint) RETURNS bigint
                DETERMINISTIC
                BEGIN
                  declare out_total_sale double;
                  declare out_total_extra double;
                  declare out_actual_sale double;
                  select sum(purchase_quantity*rate) into out_total_sale from purchase_details where purchase_master_id=in_pm_id;
                  select sum(amount*item_type) into out_total_extra from purchase_extras where purchase_master_id=in_pm_id;
                  set out_actual_sale = out_total_sale + out_total_extra;
                    RETURN out_actual_sale;
                END'
        );
    }

    public function down()
    {
        Schema::dropIfExists('all_procedures_and_functions');
    }
}
