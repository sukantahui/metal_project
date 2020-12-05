<?php

namespace App\Http\Controllers;

use App\Models\Ledger;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class VendorController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator= Validator::make($request->all(),[
           'ledger_name'=> 'required|unique:ledgers,ledger_name',
            'billing_name' => 'required',
            'email' => 'email',
        ]);
        if($validator->fails()){
            return response()->json(['success'=>0,'data'=>null,'error'=>$validator->messages()], 200,[],JSON_NUMERIC_CHECK);
        }
        try{
            $customer = new Ledger();
            $customer->ledger_name = $request->input('ledger_name');
            $customer->billing_name = $request->input('billing_name');
            $customer->ledger_group_id = 15;
            $customer->customer_category_id =0;
            $customer->email = $request->input('email');
            $customer->mobile1 = $request->input('mobile1');
            $customer->mobile2 = $request->input('mobile2');
            $customer->branch = $request->input('branch');
            $customer->account_number = $request->input('account_number');
            $customer->ifsc = $request->input('ifsc');
            $customer->address1 = $request->input('address1');
            $customer->address2 = $request->input('address2');
            $customer->state_id = $request->input('state_id');
            $customer->po = $request->input('po');
            $customer->area = $request->input('area');
            $customer->city = $request->input('city');
            $customer->pin = $request->input('pin');
            $customer->transaction_type_id = $request->input('transaction_type_id');
            $customer->opening_balance = $request->input('opening_balance');

            $customer->save();

            return response()->json(['success'=>1,'data'=>$customer,'error'=>null], 200,[],JSON_NUMERIC_CHECK);
        }catch(Illuminate\Database\QueryException $e){
            return response()->json(['success'=>0,'data'=>null, 'error'=>$e], 200,[],JSON_NUMERIC_CHECK);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Vendor  $vendor
     * @return \Illuminate\Http\Response
     */
    public function show(Vendor $vendor)
    {

    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Vendor  $vendor
     * @return \Illuminate\Http\Response
     */
    public function edit(Vendor $vendor)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Vendor  $vendor
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Vendor $vendor)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Vendor  $vendor
     * @return \Illuminate\Http\Response
     */
    public function destroy(Vendor $vendor)
    {
        //
    }
}
