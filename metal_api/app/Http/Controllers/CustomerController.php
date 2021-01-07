<?php

namespace App\Http\Controllers;

use App\Models\Ledger;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CustomerController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
        $customers=Ledger::select('id','ledger_name','billing_name','ledger_group_id','customer_category_id','email','mobile1','mobile2'
            ,'address1','address2','state_id','po','area','city','pin','transaction_type_id','opening_balance')
            ->where('ledger_group_id',16)->get();
        return response()->json(['success'=>1,'data'=>$customers], 200,[],JSON_NUMERIC_CHECK);

    }


    public function create()
    {
        //
    }

    public function store(Request $request)
    {
        //
        $validator = Validator::make($request->all(),[
            'ledger_name' => 'required|unique:ledgers,ledger_name',
            'billing_name' => 'required',
            'email' => 'email|required',
        ]);
        if($validator->fails()){
            return response()->json(['success'=>0,'data'=>null,'error'=>$validator->messages()], 200,[],JSON_NUMERIC_CHECK);
        }
        try{
            $customer = new Ledger();
            $customer->ledger_name = $request->input('ledger_name');
            $customer->billing_name = $request->input('billing_name');
            $customer->ledger_group_id = 16;
            $customer->customer_category_id = $request->input('customer_category_id');
            $customer->email = $request->input('email');
            $customer->mobile1 = $request->input('mobile1');
            $customer->mobile2 = $request->input('mobile2');
//            $customer->branch = $request->input('branch');
//            $customer->account_number = $request->input('account_number');
//            $customer->ifsc = $request->input('ifsc');
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
     * @param  \App\Models\Ledger  $ledger
     * @return \Illuminate\Http\Response
     */
    public function show(Ledger $ledger)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Ledger  $ledger
     * @return \Illuminate\Http\Response
     */
    public function edit(Ledger $ledger)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Ledger  $ledger
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Ledger $ledger)
    {
        //
        $ledger_id = $request->input('id');
        $validator = Validator::make($request->all(),[
            'ledger_name' => 'required|unique:ledgers,ledger_name,'.$ledger_id,
            'billing_name' => 'required'
        ]);
        if($validator->fails()){
            return response()->json(['success'=>0,'data'=>null,'error'=>$validator->messages()], 200,[],JSON_NUMERIC_CHECK);
        }
        try{
            $customer = new Ledger();
            $customer = $customer::find($request->input('id'));

            $customer->ledger_name = $request->input('ledger_name');
            $customer->billing_name = $request->input('billing_name');
            $customer->ledger_group_id = 16;
            $customer->customer_category_id = $request->input('customer_category_id');
            $customer->email = $request->input('email');
            $customer->mobile1 = $request->input('mobile1');
            $customer->mobile2 = $request->input('mobile2');
//            $customer->branch = $request->input('branch');
//            $customer->account_number = $request->input('account_number');
//            $customer->ifsc = $request->input('ifsc');
            $customer->address1 = $request->input('address1');
            $customer->address2 = $request->input('address2');
            $customer->state_id = $request->input('state_id');
            $customer->po = $request->input('po');
            $customer->area = $request->input('area');
            $customer->city = $request->input('city');
            $customer->pin = $request->input('pin');
            $customer->transaction_type_id = $request->input('transaction_type_id');
            $customer->opening_balance = $request->input('opening_balance');

            $customer->update();

            return response()->json(['success'=>1,'data'=>$customer,'error'=>null], 200,[],JSON_NUMERIC_CHECK);
        }catch(Illuminate\Database\QueryException $e){
            return response()->json(['success'=>0,'data'=>null, 'error'=>$e], 200,[],JSON_NUMERIC_CHECK);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Ledger  $ledger
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
        $customer = Ledger::find($id);
        if(!empty($customer)){
            $result = $customer->delete();
        }else{
            $result = false;
        }
        return response()->json(['success'=>$result,'id'=>$id], 200);

    }
}
