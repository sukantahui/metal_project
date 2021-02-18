<?php

namespace App\Http\Controllers;

use App\Models\SaleMaster;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SaleController extends Controller
{
    public function  saveSale(Request $request){
        $input=($request->json()->all());
        //separating data from $input
        $inputSaleMaster=(object)($input['sale_master']);

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


            DB::commit();
        }catch(\Exception $e){
            DB::rollBack();
            return response()->json(['success'=>0,'exception'=>$e->getMessage()], 500);
        }

        return response()->json(['success'=>1,'data'=>$saleMaster, 'input' => $input, 'error' => null], 200);
    }
}
