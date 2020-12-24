<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\PurchaseMaster;
use App\Models\PurchaseDetail;
use App\Models\TransactionMaster;
use App\Models\TransactionDetail;

class PurchaseController extends Controller
{
    public function  PurchaseController(Request $request){
        $input=($request->json()->all());
        $inputPurchaseMaster=(object)($input['purchase_master']);
        $inputPurchaseDetails=($input['purchase_details']);
        $inputTransactionMaster=(object)($input['transaction_master']);
        $inputTransactionDetails=($input['transaction_details']);
        $inputExtraItems=($input['extraItems']);

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
            $transactionMaster = new TransactionMaster();
            $transactionMaster->transaction_number = $inputTransactionMaster->transaction_number;
            $transactionMaster->user_id = $inputTransactionMaster->user_id;
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
            DB::commit();
        }
        catch(\Exception $e){
            DB::rollBack();
            return response()->json(['success'=>0,'exception'=>$e->getMessage()], 401);
        }
        return response()->json(['success'=>1,'data'=>$purchaseMaster], 200);
    }
}
