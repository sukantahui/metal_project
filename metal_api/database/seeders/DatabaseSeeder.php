<?php

namespace Database\Seeders;

use App\Models\Unit;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\UserType;
use App\Models\ProductCategory;
use App\Models\TransactionType;
use App\Models\LedgerGroup;
use App\Models\CustomerCategory;


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
        //Ledger Groups
        LedgerGroup::insert([
            ['group_name'=>'Current Assets'],           //1
            ['group_name'=>'Indirect Expenses'],        //2
            ['group_name'=>'Current Liabilities'],      //3
            ['group_name'=>'Fixed Assets'],             //4
            ['group_name'=>'Direct Incomes'],           //5
            ['group_name'=>'Indirect Incomes'],         //6
            ['group_name'=>'Bank Account'],             //7
            ['group_name'=>'Loans & Liabilities'],      //8
            ['group_name'=>'Bank OD'],                  //9
            ['group_name'=>'Branch & Division'],        //10
            ['group_name'=>'Capital Account'],          //11
            ['group_name'=>'Direct Expenses'],          //12
            ['group_name'=>'Cash in Hand'],             //13
            ['group_name'=>'Stock in Hand'],            //14
            ['group_name'=>'Sundry Creditors'],         //15
            ['group_name'=>'Sundry Debtors'],           //16
            ['group_name'=>'Suspense Account'],         //17
            ['group_name'=>'Indirect Income'],          //18
            ['group_name'=>'Sales Account'],            //19
            ['group_name'=>'Duties & Taxes'],           //20
            ['group_name'=>'Investment'],               //21
            ['group_name'=>'Purchase Account'],         //22
            ['group_name'=>'Investments']               //23
        ]);

        //customer_categories table data
        CustomerCategory::create(['customer_category_name'=>'Not Applicable']);
        CustomerCategory::create(['customer_category_name'=>'Good']);
        CustomerCategory::create(['customer_category_name'=>'Better']);
        CustomerCategory::create(['customer_category_name'=>'Best']);
        CustomerCategory::create(['customer_category_name'=>'Excellent']);


    }
}
