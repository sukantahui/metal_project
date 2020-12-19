<?php

namespace Database\Seeders;

use App\Models\ExtraItem;
use App\Models\Ledger;
use App\Models\Unit;
use App\Models\VoucherType;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\UserType;
use App\Models\ProductCategory;
use App\Models\TransactionType;
use App\Models\LedgerGroup;
use App\Models\CustomerCategory;
use App\Models\State;


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
        State::insert([
            ['state_code'=>0,'state_name'=>'Not applicable'],
            ['state_code'=>1,'state_name'=>'Jammu & Kashmir'],
            ['state_code'=>2,'state_name'=>'Himachal Pradesh'],
            ['state_code'=>3,'state_name'=>'Punjab'],
            ['state_code'=>4,'state_name'=>'Chandigarh'],
            ['state_code'=>5,'state_name'=>'Uttranchal'],
            ['state_code'=>6,'state_name'=>'Haryana'],
            ['state_code'=>7,'state_name'=>'Delhi'],
            ['state_code'=>8,'state_name'=>'Rajasthan'],
            ['state_code'=>9,'state_name'=>'Uttar Pradesh'],
            ['state_code'=>10,'state_name'=>'Bihar'],
            ['state_code'=>11,'state_name'=>'Sikkim'],
            ['state_code'=>12,'state_name'=>'Arunachal Pradesh'],
            ['state_code'=>13,'state_name'=>'Nagaland'],
            ['state_code'=>14,'state_name'=>'Manipur'],
            ['state_code'=>15,'state_name'=>'Mizoram'],
            ['state_code'=>16,'state_name'=>'Tripura'],
            ['state_code'=>17,'state_name'=>'Meghalaya'],
            ['state_code'=>18,'state_name'=>'Assam'],
            ['state_code'=>19,'state_name'=>'West Bengal'],
            ['state_code'=>20,'state_name'=>'Jharkhand'],
            ['state_code'=>21,'state_name'=>'Odisha (Formerly Orissa'],
            ['state_code'=>22,'state_name'=>'Chhattisgarh'],
            ['state_code'=>23,'state_name'=>'Madhya Pradesh'],
            ['state_code'=>24,'state_name'=>'Gujarat'],
            ['state_code'=>25,'state_name'=>'Daman & Diu'],
            ['state_code'=>26,'state_name'=>'Dadra & Nagar Haveli'],
            ['state_code'=>27,'state_name'=>'Maharashtra'],
            ['state_code'=>28,'state_name'=>'Andhra Pradesh'],
            ['state_code'=>29,'state_name'=>'Karnataka'],
            ['state_code'=>30,'state_name'=>'Goa'],
            ['state_code'=>31,'state_name'=>'Lakshdweep'],
            ['state_code'=>32,'state_name'=>'Kerala'],
            ['state_code'=>33,'state_name'=>'Tamil Nadu'],
            ['state_code'=>34,'state_name'=>'Pondicherry'],
            ['state_code'=>35,'state_name'=>'Andaman & Nicobar Islands'],
            ['state_code'=>36,'state_name'=>'Telangana']
        ]);

        VoucherType::insert([
            ['voucher_type_name'=>'Sales Voucher'],              //1
            ['voucher_type_name'=>'Purchase Voucher'],           //2
            ['voucher_type_name'=>'Payment Voucher'],            //3
            ['voucher_type_name'=>'Receipt Voucher'],            //4
            ['voucher_type_name'=>'Contra Voucher'],             //5
            ['voucher_type_name'=>'Journal Voucher'],            //6
            ['voucher_type_name'=>'Credit Note Voucher'],        //7
            ['voucher_type_name'=>'Debit Note Voucher']          //8
        ]);

        ExtraItem::insert([
            ['item_name' => 'Rounded off'],
            ['item_name' => 'Discount allowed'],
            ['item_name' => 'Loading expenditure'],
            ['item_name' => 'Unloading expenditure']
        ]);

        Ledger::insert([
            //1
            ['ledger_name'=>'Cash in Hand','billing_name'=>'Cash in Hand','ledger_group_id'=>13,'state_id'=>1,'transaction_type_id'=>1,'opening_balance'=>0,'customer_category_id'=>1],
            //2
            ['ledger_name'=>'Bank Account','billing_name'=>'Bank Account','ledger_group_id'=>7,'state_id'=>1,'transaction_type_id'=>1,'opening_balance'=>0,'customer_category_id'=>1],
            //3
            ['ledger_name'=>'Bank Account 1','billing_name'=>'Bank Account 1','ledger_group_id'=>7,'state_id'=>1,'transaction_type_id'=>1,'opening_balance'=>0,'customer_category_id'=>1],
            //4
            ['ledger_name'=>'Bank Account 2','billing_name'=>'Bank Account 2','ledger_group_id'=>7,'state_id'=>1,'transaction_type_id'=>1,'opening_balance'=>0,'customer_category_id'=>1],
            //5
            ['ledger_name'=>'Purchase','billing_name'=>'Purchase','ledger_group_id'=>16,'state_id'=>1,'transaction_type_id'=>1,'opening_balance'=>0,'customer_category_id'=>1],
            //6
            ['ledger_name'=>'Sale','billing_name'=>'Sale','ledger_group_id'=>15,'state_id'=>1,'transaction_type_id'=>2,'opening_balance'=>0,'customer_category_id'=>1],
        ]);
    }
}
