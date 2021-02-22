<?php

namespace App\Http\Controllers;

use App\Models\SaleMaster;
use App\Models\SaleDetail;
use App\Models\SaleExtra;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SaleController extends Controller
{
    public function  saveSale(Request $request){
        $input=($request->json()->all());
        //separating data from $input
        $inputSaleMaster=(object)($input['sale_master']);
        $inputSaleDetails=($input['sale_details']);
        $inputExtraItems=($input['sale_extras']);

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
                $saleDetail->rate = $detail->rate;
                $saleDetail->save();
            }

            //saving sale_extras

            foreach ($inputExtraItems as $inputExtraItem){
                $extra = (object)$inputExtraItem;
                $extraItem = new SaleExtra();
                $extraItem->sale_master_id = $saleMaster->id;
                $extraItem->extra_item_id = $extra->extra_item_id;
                $extraItem->amount = $extra->amount;
                $extraItem->save();
            }

            DB::commit();
        }catch(\Exception $e){
            DB::rollBack();
            return response()->json(['success'=>0,'exception'=>$e->getMessage()], 500);
        }

        return response()->json(['success'=>1,'data'=>$saleMaster, 'input' => $input, 'error' => null], 200);
    }
}
