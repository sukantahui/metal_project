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
        $inputPaymentTransactionMaster=(object)($input['payment_transaction_master']);
        $inputPaymentTransactionDetails=($input['payment_transaction_details']);



        $validator = Validator::make($input['purchase_master'],[
//            'inforce' => 'required'
        ]);
        if($validator->fails()){
            return response()->json(['success'=>0,'data'=>null,'error'=>$validator->messages()], 200,[],JSON_NUMERIC_CHECK);
        }

        // Purchase Master validation
        $validator = Validator::make($input['purchase_details'], [
            '*.product_id' => 'required|exists:products,id',
            '*.purchase_quantity' => 'required|numeric|min:1|not_in:0',
            '*.rate' => 'required|numeric|min:1|not_in:0',
            '*.stock_quantity' => 'required|numeric|min:1|not_in:0'
        ]);

        if($validator->fails()) {
            return response()->json(['success'=>0,'data'=>null,'error'=>$validator->messages()], 200,[],JSON_NUMERIC_CHECK);
        }

        // Transaction Master validation
        $validator = Validator::make($input['transaction_master'], [
            'transaction_date' => 'required|date_format:Y-m-d'
        ]);
        if($validator->fails()) {
            return response()->json(['success'=>0,'data'=>null,'error'=>$validator->messages()], 200,[],JSON_NUMERIC_CHECK);
        }


        // Transaction Details validation
        $validator = Validator::make($input['transaction_details'], [
            '*.ledger_id' => 'required|exists:ledgers,id',
            '*.transaction_type_id' => 'required|exists:transaction_types,id',
            '*.amount' => 'required|numeric|min:1|not_in:0'
        ]);

        if($validator->fails()) {
            return response()->json(['success'=>0,'data'=>null,'error'=>$validator->messages()], 200,[],JSON_NUMERIC_CHECK);
        }

        // Extra Items validation
        $validator = Validator::make($input['extra_items'], [
            '*.extra_item_id' => 'required|exists:extra_items,id',
            '*.amount' => 'required|numeric'
        ]);

        if($validator->fails()) {
            return response()->json(['success'=>0,'data'=>null,'error'=>$validator->messages()], 200,[],JSON_NUMERIC_CHECK);
        }

        DB::beginTransaction();
        try{
            //save data into purchase_masters
            $purchaseMaster= new PurchaseMaster();
            $purchaseMaster->invoice_number = $inputPurchaseMaster->invoice_number;
            $purchaseMaster->case_number = $inputPurchaseMaster->case_number;
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
            $customVoucher=CustomVoucher::where('voucher_name','=',"Transaction")->where('accounting_year',"=",$accounting_year)->first();
            if($customVoucher) {
                $customVoucher->last_counter = $customVoucher->last_counter + 1;
                $customVoucher->save();
            }else{
                $customVoucher= new CustomVoucher();
                $customVoucher->voucher_name="Transaction";
                $customVoucher->accounting_year= $accounting_year;
                $customVoucher->last_counter=1;
                $customVoucher->delimiter='-';
                $customVoucher->prefix='TRN';
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

//            save into transaction master for payment voucher
            $customVoucher=CustomVoucher::where('voucher_name','=',"Transaction")->where('accounting_year',"=",$accounting_year)->first();
            if($customVoucher) {
                $customVoucher->last_counter = $customVoucher->last_counter + 1;
                $customVoucher->save();
            }else{
                $customVoucher= new CustomVoucher();
                $customVoucher->voucher_name="Transaction";
                $customVoucher->accounting_year= $accounting_year;
                $customVoucher->last_counter=1;
                $customVoucher->delimiter='-';
                $customVoucher->prefix='TRN';
                $customVoucher->save();
            }
            $voucher_number = $customVoucher->prefix.'-'.$customVoucher->last_counter."-".$accounting_year;

            $transactionMaster2 = new TransactionMaster();
            $transactionMaster2->transaction_number = $voucher_number;
            $transactionMaster2->reference_transaction_master_id = $transactionMaster->id;
            $transactionMaster2->user_id = $inputPaymentTransactionMaster->user_id;
            $transactionMaster2->voucher_type_id = 3;
            $transactionMaster2->purchase_master_id = $purchaseMaster->id;
            $transactionMaster2->transaction_date = $inputPaymentTransactionMaster->transaction_date;
            $transactionMaster2->save();

//            save into transaction details for payment voucher
            foreach($inputPaymentTransactionDetails as $inputPaymentTransactionDetail){
                $transactionDetail = new TransactionDetail();
                $transactionDetail->transaction_master_id = $transactionMaster2->id;
                $transactionDetail->ledger_id = $inputPaymentTransactionDetail['ledger_id'];
                $transactionDetail->transaction_type_id = $inputPaymentTransactionDetail['transaction_type_id'];
                $transactionDetail->amount = $inputPaymentTransactionDetail['amount'];
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
            return response()->json(['success'=>0,'exception'=>$e->getMessage()], 500);
        }

        $purchaseInfo = TransactionMaster::select("transaction_masters.id","transaction_masters.transaction_number","ledgers.ledger_name",
            "transaction_masters.transaction_date","transaction_details.amount")
            ->join('transaction_details','transaction_masters.id','transaction_details.transaction_master_id')
            ->join('ledgers','ledgers.id','transaction_details.ledger_id')
            ->where('transaction_masters.id',$transactionMaster->id)
            ->where('transaction_masters.voucher_type_id',2)
            ->where('transaction_details.transaction_type_id',2)
            ->first();

        return response()->json(['success'=>1,'data'=>$purchaseInfo, 'error' => null], 200);
    }

    public function  getAllPurchase(){
        $purchaseList = TransactionDetail::select("transaction_masters.id","transaction_masters.transaction_number","ledgers.ledger_name",
            "transaction_masters.transaction_date","transaction_details.amount")
            ->join('transaction_masters','transaction_details.transaction_master_id','transaction_masters.id')
            ->join('ledgers','transaction_details.ledger_id','ledgers.id')
            ->where('transaction_masters.voucher_type_id',2)
            ->where('transaction_details.transaction_type_id',2)
            ->orderBy('transaction_masters.transaction_date')
            ->get();

        return response()->json(['success'=>1,'data'=>$purchaseList], 200,[],JSON_NUMERIC_CHECK);
    }

    public function  getAllPurchaseByDateRange($startDate,$endDate){
        $purchaseList = TransactionDetail::select("transaction_masters.id","transaction_masters.transaction_number","ledgers.ledger_name",
            "transaction_masters.transaction_date","transaction_details.amount")
            ->join('transaction_masters','transaction_details.transaction_master_id','transaction_masters.id')
            ->join('ledgers','transaction_details.ledger_id','ledgers.id')
            ->where('transaction_details.transaction_type_id',2)
            ->whereBetween('transaction_masters.transaction_date', [$startDate, $endDate])
            ->orderBy('transaction_masters.transaction_date')
            ->get();

        return response()->json(['success'=>1,'data'=>$purchaseList], 200,[],JSON_NUMERIC_CHECK);
    }
}
