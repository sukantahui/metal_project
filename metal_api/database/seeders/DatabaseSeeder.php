<?php

namespace Database\Seeders;

use App\Models\Model\Unit;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Model\UserType;
use App\Models\Model\ProductCategory;
use App\Models\Model\TransactionType;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // \App\Models\User::factory(10)->create();
        //person_types table data
        UserType::create(['user_type_name' => 'Owner']);
        UserType::create(['user_type_name' => 'Manager']);
        UserType::create(['user_type_name' => 'Manager Sales']);
        UserType::create(['user_type_name' => 'Manager Accounts']);
        UserType::create(['user_type_name' => 'Office Staff']);
        UserType::create(['user_type_name' => 'Worker']);
        UserType::create(['user_type_name' => 'Developer']);
        UserType::create(['user_type_name' => 'Customer']);

        User::create(['user_name'=>'Arindam Biswas','mobile1'=>'9836444999','mobile2'=>'100','email'=>'arindam','password'=>"81dc9bdb52d04dc20036dbd8313ed055",'user_type_id'=>1]);

        ProductCategory::create(['category_name' => 'Brassh']);
        ProductCategory::create(['category_name' => 'Copper']);
        ProductCategory::create(['category_name' => 'Others']);

        Unit::create(['unit_name' => 'kg', 'formal_name' => 'Kilogram']);
        Unit::create(['unit_name' => 'pcs', 'formal_name' => 'Pieces']);
        Unit::create(['unit_name' => 'gm', 'formal_name' => 'Gram']);
        Unit::create(['unit_name' => 'inch', 'formal_name' => 'Inches']);

        // Product has separate file
        // php artisan db:seed --class=ProductSeeder

        //Transaction types
        TransactionType::create(['transaction_name'=>'Dr.','formal_name'=>'Debit','transaction_type_value'=>1]);
        TransactionType::create(['transaction_name'=>'Cr.','formal_name'=>'Credit','transaction_type_value'=>-1]);


    }
}
