<?php

namespace App\Http\Controllers;

use App\Models\CustomVoucher;
use App\Models\ExtraItem;
use App\Models\Ledger;
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

        $validator = Validator::make($input,[
            'sale_master' => 'required',
            'sale_details' => 'required',
            'transaction_master' => 'required',
            'transaction_details' => 'required',
        ]);
        if($validator->fails()){
            return response()->json(['success'=>0,'data'=>null,'error'=>$validator->messages()], 200,[],JSON_NUMERIC_CHECK);
        }
        //separating data from $input
        $inputSaleMaster=(object)($input['sale_master']);
        $inputSaleDetails=($input['sale_details']);
        $inputExtraItems=($input['sale_extras']);
        $inputTransactionMaster=(object)($input['transaction_master']);
        $inputTransactionDetails=($input['transaction_details']);
        $inputReceiveTransactionMaster=(object)($input['receive_transaction_master']);
        $inputReceiveTransactionDetails=($input['receive_transaction_details']);
        $isReceiving = $input['is_receiving'];

        //validating sale_masters
        $validator = Validator::make($input['sale_master'],[
            'comment' => 'max:255',
            'delivery_date'=> 'date_format:Y-m-d'
        ]);
        if($validator->fails()){
            return response()->json(['success'=>0,'data'=>null,'error'=>$validator->messages()], 200,[],JSON_NUMERIC_CHECK);
        }

        //validating sale_details
        $validator = Validator::make($input['sale_details'], [
            '*.product_id' => 'required|exists:products,id',
            '*.sale_quantity' => 'required|numeric|min:1|not_in:0',
            '*.rate' => 'required|numeric|min:1|not_in:0'
        ]);

        if($validator->fails()) {
            return response()->json(['success'=>0,'data'=>null,'error'=>$validator->messages()], 200,[],JSON_NUMERIC_CHECK);
        }

        //validating sale_extras
        $validator = Validator::make($input['sale_extras'], [
            '*.extra_item_id' => 'required|exists:extra_items,id',
            '*.amount' => 'required|numeric',
            '*.item_type' => 'required|numeric|in:1,-1'
        ]);

        if($validator->fails()) {
            return response()->json(['success'=>0,'data'=>null,'error'=>$validator->messages()], 200,[],JSON_NUMERIC_CHECK);
        }

        //transaction_master validation
        $validator = Validator::make($input['transaction_master'],[
            'user_id' => 'required|exists:users,id',
            'transaction_date'=> 'required|date_format:Y-m-d'
        ]);
        if($validator->fails()){
            return response()->json(['success'=>0,'data'=>null,'error'=>$validator->messages()], 200,[],JSON_NUMERIC_CHECK);
        }

        //transaction detail validation
        $validator = Validator::make($input['transaction_details'], [
            '*.ledger_id' => 'required|exists:ledgers,id',
            '*.transaction_type_id' => 'required|exists:transaction_types,id'
        ]);

        if($validator->fails()) {
            return response()->json(['success'=>0,'data'=>null,'error'=>$validator->messages()], 200,[],JSON_NUMERIC_CHECK);
        }

        $temp_date = explode("-",$inputTransactionMaster->transaction_date);
        $accounting_year="";
        if($temp_date[1]>3){
            $x = $temp_date[0]%100;
            $accounting_year = $x*100 + ($x+1);
        }else{
            $x = $temp_date[0]%100;
            $accounting_year =($x-1)*100+$x;
        }

        $customVoucher=CustomVoucher::where('voucher_name','=',"Bill")->where('accounting_year',"=",$accounting_year)->first();
        if($customVoucher) {
            //already exist
            $customVoucher->last_counter = $customVoucher->last_counter + 1;
            $customVoucher->save();
        }else{
            //fresh entry
            $customVoucher= new CustomVoucher();
            $customVoucher->voucher_name="Bill";
            $customVoucher->accounting_year= $accounting_year;
            $customVoucher->last_counter=1;
            $customVoucher->delimiter='-';
            $customVoucher->prefix='MTL';
            $customVoucher->save();
        }
        //adding Zeros before number
        $counter = str_pad($customVoucher->last_counter,5,"0",STR_PAD_LEFT);
        //creating sale bill number
        $bill_number = $customVoucher->prefix.'-'.$counter."-".$accounting_year;

        // if any record is failed then whole entry will be rolled back
        //try portion execute the commands and catch execute when error.
        DB::beginTransaction();
        try{
            //saving to saleMaster Table
            $saleMaster = new SaleMaster();
            $saleMaster->bill_number = $bill_number;
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
                $saleDetail->quantity = $detail->sale_quantity;
                $saleDetail->price = $detail->rate;
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
            $counter = str_pad($customVoucher->last_counter,5,"0",STR_PAD_LEFT);
            $voucher_number = $customVoucher->prefix.'-'.$counter."-".$accounting_year;


            //calculating sale bill total by calling function
            $sale = DB::select('SELECT get_sale_total_by_id(?) AS sale_total', [$saleMaster->id])[0];

            //adding transaction_masters
            $transactionMaster = new TransactionMaster();
            $transactionMaster->transaction_number = $voucher_number;
            $transactionMaster->user_id = $inputTransactionMaster->user_id;
            $transactionMaster->voucher_type_id = 1;
            $transactionMaster->sale_master_id = $saleMaster->id;
            $transactionMaster->transaction_date = $inputTransactionMaster->transaction_date;
            $transactionMaster->comment = "Sale";
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

            if($isReceiving){
                $customVoucher = CustomVoucher::where('voucher_name', '=', "Transaction")->where('accounting_year', "=", $accounting_year)->first();
                if ($customVoucher) {
                    $customVoucher->last_counter = $customVoucher->last_counter + 1;
                    $customVoucher->save();
                } else {
                    $customVoucher = new CustomVoucher();
                    $customVoucher->voucher_name = "Transaction";
                    $customVoucher->accounting_year = $accounting_year;
                    $customVoucher->last_counter = 1;
                    $customVoucher->delimiter = '-';
                    $customVoucher->prefix = 'TRN';
                    $customVoucher->save();
                }
                $counter = str_pad($customVoucher->last_counter,5,"0",STR_PAD_LEFT);
                $voucher_number = $customVoucher->prefix.'-'.$counter."-".$accounting_year;

                $transactionMaster2 = new TransactionMaster();
                $transactionMaster2->transaction_number = $voucher_number;
                $transactionMaster2->reference_transaction_master_id = $transactionMaster->id;
                $transactionMaster2->user_id = $inputReceiveTransactionMaster->user_id;
                $transactionMaster2->voucher_type_id = 4;
                $transactionMaster2->sale_master_id = $saleMaster->id;
                $transactionMaster2->transaction_date = $inputReceiveTransactionMaster->transaction_date;
                $transactionMaster2->comment = 'Received';
                $transactionMaster2->save();

                //            save into transaction details for receive voucher
                foreach ($inputReceiveTransactionDetails as $inputReceiveTransactionDetail) {
                    $transactionDetail = new TransactionDetail();
                    $transactionDetail->transaction_master_id = $transactionMaster2->id;
                    $transactionDetail->ledger_id = $inputReceiveTransactionDetail['ledger_id'];
                    $transactionDetail->transaction_type_id = $inputReceiveTransactionDetail['transaction_type_id'];
                    $transactionDetail->amount = $inputReceiveTransactionDetail['amount'];
                    $transactionDetail->save();
                }
            }


            $saleInfo = TransactionMaster::select("transaction_masters.id","transaction_masters.transaction_number","sale_masters.bill_number","ledgers.ledger_name",
                DB::raw('DATE_FORMAT(transaction_masters.transaction_date,"%d/%m/%Y") as transaction_date'),"transaction_details.amount")
                ->join('transaction_details','transaction_masters.id','transaction_details.transaction_master_id')
                ->join('ledgers','ledgers.id','transaction_details.ledger_id')
                ->join('sale_masters','sale_masters.id','transaction_masters.sale_master_id')
                ->where('transaction_masters.id',$transactionMaster->id)
                ->where('transaction_details.transaction_type_id',1)
                ->first();

            DB::commit();
        }catch(\Exception $e){
            DB::rollBack();
            return response()->json(['success'=>0,'exception'=>$e->getMessage()], 500);
        }

        return response()->json(['success'=>1,'data'=>$saleInfo, 'error' => null], 200);
    }

    function getAllSales(){
        $saleInfo = TransactionMaster::select("transaction_masters.id","transaction_masters.transaction_number","sale_masters.bill_number","ledgers.ledger_name",
            DB::raw('DATE_FORMAT(transaction_masters.transaction_date,"%d/%m/%Y") as transaction_date'),"transaction_details.amount")
            ->join('transaction_details','transaction_masters.id','transaction_details.transaction_master_id')
            ->join('ledgers','ledgers.id','transaction_details.ledger_id')
            ->join('sale_masters','sale_masters.id','transaction_masters.sale_master_id')
            ->where('transaction_masters.voucher_type_id',1)
            ->where('transaction_details.transaction_type_id',1)
            ->orderBy('transaction_masters.transaction_date', 'DESC')
            ->orderBy('transaction_masters.id','DESC')
            ->get();
        return response()->json(['success'=>1,'data'=>$saleInfo], 200);
    }

    function getSaleByTransactionID($id){

        $output = array();
        $saleInfo = TransactionMaster::select("transaction_masters.id","transaction_masters.transaction_number")
            ->where('transaction_masters.id',$id)
            ->first();
        $output['transaction_master']=$saleInfo;

        $saleInfo = TransactionDetail::select('id','transaction_master_id','ledger_id','transaction_type_id')
            ->where('transaction_master_id',$id)
            ->get();
        $output['transaction_details']=$saleInfo;
        $transactionMaster = TransactionMaster::find($id);
        $output['sale_master']=$transactionMaster->sale_master;
        $output['transaction_details']=$transactionMaster->transaction_details;

        $saleMaster =SaleMaster::find($transactionMaster->sale_master->id);
        $output['sale_details']=$saleMaster->sale_details;
        $output['sale_extras']=$saleMaster->sale_extras;


        return response()->json(['success'=>1,'data'=>$output], 200);
    }

    function getSaleDetailForPrint($id){
        $output = array();
        $saleInfo = TransactionMaster::select("transaction_masters.id","transaction_masters.transaction_number"
            ,DB::raw('DATE_FORMAT(transaction_masters.transaction_date,"%d/%m/%Y") as transaction_date')
            ,"transaction_masters.sale_master_id")
            ->where('transaction_masters.id',$id)
            ->first();
        $output['transaction_master']=$saleInfo;

        $saleInfo = TransactionDetail::select()
            ->where('transaction_details.transaction_master_id',$id)
            ->where('transaction_details.transaction_type_id',1)
            ->first();
        $customer = Ledger::find($saleInfo->ledger_id);
        $output['customer']=$customer;

        $saleInfo = SaleMaster::select()
            ->where('id',$output['transaction_master']->sale_master_id)
            ->first();
        $output['sale_master']=$saleInfo;

        $saleInfo = SaleDetail::select( 'sale_details.id'
                            ,'sale_details.sale_master_id'
                            ,'sale_details.product_id'
                            ,'sale_details.quantity'
                            ,'sale_details.price'
                            ,'products.product_name')
                    ->where('sale_master_id',$output['sale_master']->id)
                    ->join('products','products.id','sale_details.sale_master_id')
                    ->get();
        $output['sale_details']=$saleInfo;

        $saleInfo = SaleExtra::select()
                    ->where('sale_master_id',$output['sale_master']->id)
                    ->get();
        $output['sale_extras']=$saleInfo;
        return response()->json(['success'=>1,'data'=>$output], 200);
    }
}
