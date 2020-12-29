<?php

namespace App\Http\Controllers;

use App\Models\PurchaseExtra;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\PurchaseMaster;
use App\Models\PurchaseDetail;
use App\Models\TransactionMaster;
use App\Models\TransactionDetail;
use App\Models\CustomVoucher;
use Illuminate\Support\Facades\Validator;

class PurchaseController extends Controller
{
    public function  savePurchase(Request $request){

        $input=($request->json()->all());
        $inputPurchaseMaster=(object)($input['purchase_master']);
        $inputPurchaseDetails=($input['purchase_details']);
        $inputTransactionMaster=(object)($input['transaction_master']);
        $inputTransactionDetails=($input['transaction_details']);
        $inputExtraItems=($input['extra_items']);

        $validator = Validator::make($input['purchase_master'],[
            'invoice_number'=> 'required|unique:purchase_masters,invoice_number',
        ],
            [
                'invoice_number.required' => 'Invoice number can not be blank',
                'invoice_number.unique' => 'Invoice number already exists'
            ]
        );
        if($validator->fails()){
            return response()->json(['success'=>0,'data'=>null,'error'=>$validator->messages()], 200,[],JSON_NUMERIC_CHECK);
        }

        DB::beginTransaction();
        try{
            //save data into purchase_masters
            $purchaseMaster= new PurchaseMaster();
            $purchaseMaster->invoice_number = $inputPurchaseMaster->invoice_number;
            $purchaseMaster->reference_number = $inputPurchaseMaster->reference_number;
            $purchaseMaster->challan_number = $inputPurchaseMaster->challan_number;
            $purchaseMaster->order_number = $inputPurchaseMaster->order_number;
            $purchaseMaster->order_date = $inputPurchaseMaster->order_date;
            $purchaseMaster->comment = $inputPurchaseMaster->comment;
            $purchaseMaster->save();
            //save data into purchase_details
            foreach($inputPurchaseDetails as $inputPurchaseDetail){
                $purchaseDetail = new PurchaseDetail();
                $purchaseDetail->purchase_master_id = $purchaseMaster->id;
                $purchaseDetail->product_id = $inputPurchaseDetail['product_id'];
                $purchaseDetail->rate = $inputPurchaseDetail['rate'];
                $purchaseDetail->purchase_quantity = $inputPurchaseDetail['purchase_quantity'];
                $purchaseDetail->stock_quantity = $inputPurchaseDetail['stock_quantity'];
                $purchaseDetail->save();
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
            $customVoucher=CustomVoucher::where('voucher_name','=',"Purchase")->where('accounting_year',"=",$accounting_year)->first();
            if($customVoucher) {
                $customVoucher->last_counter = $customVoucher->last_counter + 1;
                $customVoucher->save();
            }else{
                $customVoucher= new CustomVoucher();
                $customVoucher->voucher_name="Purchase";
                $customVoucher->accounting_year= $accounting_year;
                $customVoucher->last_counter=1;
                $customVoucher->delimiter='-';
                $customVoucher->prefix='MT';
                $customVoucher->save();
            }
            $voucher_number = $customVoucher->prefix.'-'.$customVoucher->last_counter."-".$accounting_year;

            $transactionMaster = new TransactionMaster();
            $transactionMaster->transaction_number = $voucher_number;
            $transactionMaster->user_id = $inputTransactionMaster->user_id;
            $transactionMaster->voucher_type_id = 2;
            $transactionMaster->purchase_master_id = $purchaseMaster->id;
            $transactionMaster->transaction_date = $inputTransactionMaster->transaction_date;
            $transactionMaster->save();

            //save data into transaction_details
            foreach($inputTransactionDetails as $inputTransactionDetail){
                $transactionDetail = new TransactionDetail();
                $transactionDetail->transaction_master_id = $transactionMaster->id;
                $transactionDetail->ledger_id = $inputTransactionDetail['ledger_id'];
                $transactionDetail->transaction_type_id = $inputTransactionDetail['transaction_type_id'];
                $transactionDetail->amount = $inputTransactionDetail['amount'];
                $transactionDetail->save();
            }

            //save data into purchase_extras
            foreach($inputExtraItems as $inputExtraItem){
                $purchaseExtraDetail = new PurchaseExtra();
                $purchaseExtraDetail->purchase_master_id = $purchaseMaster->id;
                $purchaseExtraDetail->extra_item_id = $inputExtraItem['extra_item_id'];
                $purchaseExtraDetail->amount = $inputExtraItem['amount'];
                $purchaseExtraDetail->item_type = $inputExtraItem['item_type'];
                $purchaseExtraDetail->save();
            }

            DB::commit();
        }
        catch(\Exception $e){
            DB::rollBack();
            return response()->json(['success'=>0,'exception'=>$e->getMessage()], 401);
        }

        $purchaseInfo = TransactionMaster::select('transaction_masters.id','transaction_masters.transaction_number','transaction_details.amount'
        ,'ledgers.ledger_name','ledgers.billing_name')
            ->join('transaction_details','transaction_masters.id','transaction_details.transaction_master_id')
            ->join('ledgers','ledgers.id','transaction_details.ledger_id')
            ->where('transaction_masters.id',$transactionMaster->id)
            ->where('transaction_masters.voucher_type_id',2)
            ->where('transaction_details.transaction_type_id',2)
            ->first();

        return response()->json(['success'=>1,'data'=>array('purchaseMaster' => $purchaseMaster), 'error' => null], 200);
    }
}
