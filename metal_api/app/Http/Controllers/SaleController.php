<?php

namespace App\Http\Controllers;

use App\Models\CustomVoucher;
use App\Models\SaleMaster;
use App\Models\SaleDetail;
use App\Models\SaleExtra;
use App\Models\TransactionDetail;
use App\Models\TransactionMaster;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class SaleController extends Controller
{
    public function  saveSale(Request $request){
        $input=($request->json()->all());
        //separating data from $input
        $inputSaleMaster=(object)($input['sale_master']);
        $inputSaleDetails=($input['sale_details']);
        $inputExtraItems=($input['sale_extras']);
        $inputTransactionMaster=(object)($input['transaction_master']);
        $inputTransactionDetails=($input['transaction_details']);

        //validating sale_masters
        $validator = Validator::make($input['sale_master'],[
            'comment' => 'required'
        ]);
        if($validator->fails()){
            return response()->json(['success'=>0,'data'=>null,'error'=>$validator->messages()], 200,[],JSON_NUMERIC_CHECK);
        }

        //validating sale_details
        $validator = Validator::make($input['sale_details'], [
            '*.product_id' => 'required|exists:products,id',
            '*.quantity' => 'required|numeric|min:1|not_in:0',
            '*.price' => 'required|numeric|min:1|not_in:0'
        ]);

        if($validator->fails()) {
            return response()->json(['success'=>0,'data'=>null,'error'=>$validator->messages()], 200,[],JSON_NUMERIC_CHECK);
        }

        //validating sale_extras
        $validator = Validator::make($input['sale_extras'], [
            '*.extra_item_id' => 'required|exists:extra_items,id',
            '*.amount' => 'required|numeric|not_in:0',
            '*.item_type' => 'required|numeric|in:1,-1'
        ]);

        if($validator->fails()) {
            return response()->json(['success'=>0,'data'=>null,'error'=>$validator->messages()], 200,[],JSON_NUMERIC_CHECK);
        }

        // if any record is failed then whole entry will be rolled back
        //try portion execute the commands and catch execute when error.
        DB::beginTransaction();
        try{
            //saving to saleMaster Table
            $saleMaster = new SaleMaster();
            $saleMaster->bill_number = $inputSaleMaster->bill_number;
            $saleMaster->order_date = $inputSaleMaster->order_date;
            $saleMaster->delivery_date = $inputSaleMaster->delivery_date;
            $saleMaster->comment = $inputSaleMaster->comment;
            $saleMaster->save();

            //saving sale details
            foreach ($inputSaleDetails as $inputSaleDetail){
                $detail = (object)$inputSaleDetail;
                $saleDetail = new SaleDetail();
                $saleDetail->sale_master_id = $saleMaster->id;
                $saleDetail->product_id = $detail->product_id;
                $saleDetail->quantity = $detail->quantity;
                $saleDetail->price = $detail->price;
                $saleDetail->save();
            }

            //saving sale_extras

            foreach ($inputExtraItems as $inputExtraItem){
                $extra = (object)$inputExtraItem;
                $extraItem = new SaleExtra();
                $extraItem->sale_master_id = $saleMaster->id;
                $extraItem->extra_item_id = $extra->extra_item_id;
                $extraItem->item_type = $extra->item_type;
                $extraItem->amount = $extra->amount;
                $extraItem->save();
            }

            //save data into transaction_masters
            $temp_date = explode("-",$inputTransactionMaster->transaction_date);
            $accounting_year="";
            if($temp_date[1]>3){
                $x = $temp_date[0]%100;
                $accounting_year = $x*100 + ($x+1);
            }else{
                $x = $temp_date[0]%100;
                $accounting_year =($x-1)*100+$x;
            }
            $customVoucher=CustomVoucher::where('voucher_name','=',"Transaction")->where('accounting_year',"=",$accounting_year)->first();
            if($customVoucher) {
                //already exist
                $customVoucher->last_counter = $customVoucher->last_counter + 1;
                $customVoucher->save();
            }else{
                //fresh entry
                $customVoucher= new CustomVoucher();
                $customVoucher->voucher_name="Transaction";
                $customVoucher->accounting_year= $accounting_year;
                $customVoucher->last_counter=1;
                $customVoucher->delimiter='-';
                $customVoucher->prefix='TRN';
                $customVoucher->save();
            }
            $voucher_number = $customVoucher->prefix.'-'.$customVoucher->last_counter."-".$accounting_year;


            //calculating sale bill total by calling function
            $sale = DB::select('SELECT get_sale_total_by_id(?) AS sale_total', [$saleMaster->id])[0];

            //adding transaction_masters
            $transactionMaster = new TransactionMaster();
            $transactionMaster->transaction_number = $voucher_number;
            $transactionMaster->user_id = $inputTransactionMaster->user_id;
            $transactionMaster->voucher_type_id = 1;
            $transactionMaster->sale_master_id = $saleMaster->id;
            $transactionMaster->transaction_date = $inputTransactionMaster->transaction_date;
            $transactionMaster->save();

            //save data into transaction_details
            foreach($inputTransactionDetails as $inputTransactionDetail){
                $td = (object)$inputTransactionDetail;
                $transactionDetail = new TransactionDetail();
                $transactionDetail->transaction_master_id = $transactionMaster->id;
                $transactionDetail->ledger_id = $td->ledger_id;
                $transactionDetail->transaction_type_id = $td->transaction_type_id;
                $transactionDetail->amount = $sale->sale_total; //calculated value
                $transactionDetail->save();
            }

            DB::commit();
        }catch(\Exception $e){
            DB::rollBack();
            return response()->json(['success'=>0,'exception'=>$e->getMessage()], 500);
        }

        return response()->json(['success'=>1,'data'=>$saleMaster, 'sale_total'=>$sale->sale_total, 'error' => null], 200);
    }
}
