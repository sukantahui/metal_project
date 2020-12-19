<?php

namespace App\Http\Controllers;

use App\Models\Ledger;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class VendorController extends Controller
{

    public function index()
    {
        $vendor= Ledger::select('id',
            'ledger_name',
            'billing_name',
            'ledger_group_id',
            'email',
            'mobile1',
            'mobile2',
            'mobile2',
            'branch',
            'account_number',
            'ifsc',
            'address1',
            'address2',
            'state_id',
            'area',
            'city',
            'pin',
            'transaction_type_id',
            'opening_balance'
            )->where('ledger_group_id',15)->get();

        return response()->json(['success'=>1,'data'=>$vendor,'error'=>null], 200,[],JSON_NUMERIC_CHECK);

    }
    public function create()
    {
        //
    }
    public function store(Request $request)
    {
        $validator= Validator::make($request->all(),[
           'ledger_name'=> 'required|unique:ledgers,ledger_name',
            'billing_name' => 'required',
            'email' => 'email'
        ],
        [
            'ledger_name.required' => 'Vendor can not be blank',
            'ledger_name.unique' => 'Vendor already exists'

        ]);
        if($validator->fails()){
            return response()->json(['success'=>0,'data'=>null,'error'=>$validator->messages()], 200,[],JSON_NUMERIC_CHECK);
        }
        try{
            $customer = new Ledger();
            $customer->ledger_name = $request->input('ledger_name');
            $customer->billing_name = $request->input('billing_name');
            $customer->ledger_group_id = 15;
            $customer->customer_category_id =1;
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
    public function updateVendor(Request $request)
    {
        $id = $request->input('id');
        $validator = Validator::make($request->all(),[

            'ledger_name'=> 'required|unique:ledgers,ledger_name,'.$id,
            'billing_name'=> 'required',
            "email"=>'email'
        ],
        [
            'ledger_name.required' => 'Vendor can not be blank',
            'ledger_name.unique' => 'Vendor already exists'
        ]);
        if($validator->fails()){
            return response()->json(['success'=>0,'data'=>null,'error'=>$validator->messages()], 200,[],JSON_NUMERIC_CHECK);
        }

        try {

            $customer = Ledger::find($request->input('id'));

            $customer->ledger_name = $request->input('ledger_name');
            $customer->billing_name = $request->input('billing_name');
            $customer->ledger_group_id = 15;
            $customer->customer_category_id = 1;
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

            $customer->update();

            return response()->json(['success' => 1, 'data' => $customer, 'error' => null], 200, [], JSON_NUMERIC_CHECK);
        }catch(Illuminate\Database\QueryException $e){
            return response()->json(['success'=>0,'data'=>null, 'error'=>$e], 200,[],JSON_NUMERIC_CHECK);
        }
    }
    public function updateVendorById(Request $request, $id)
    {
        $validator = Validator::make($request->all(),[

            'ledger_name'=> 'required|unique:ledgers,ledger_name,'.$id,
            'billing_name'=> 'required',
            "email"=>'email'
        ],
            [
                'ledger_name.required' => 'Vendor can not be blank',
                'ledger_name.unique' => 'Vendor already exists'
            ]);
        if($validator->fails()){
            return response()->json(['success'=>0,'data'=>null,'error'=>$validator->messages()], 200,[],JSON_NUMERIC_CHECK);
        }

        try {

            $customer = Ledger::find($id);
            $customer->ledger_name = $request->input('ledger_name');
            $customer->billing_name = $request->input('billing_name');
            $customer->ledger_group_id = 15;
            $customer->customer_category_id = 1;
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

            $customer->update();

            return response()->json(['success' => 1, 'data' => $customer, 'error' => null], 200, [], JSON_NUMERIC_CHECK);
        }catch(Illuminate\Database\QueryException $e){
            return response()->json(['success'=>0,'data'=>null, 'error'=>$e], 200,[],JSON_NUMERIC_CHECK);
        }
    }
    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Vendor  $vendor
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
        $vendor = Ledger::find($id);
        if(!empty($vendor)){
            $result = $vendor->delete();
        }else{
            $result = false;
        }
        return response()->json(['success'=>$result,'id'=>$id], 200);

    }
}
