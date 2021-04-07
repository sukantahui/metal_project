<?php

namespace App\Http\Controllers;

use App\Models\SaleMaster;
use Illuminate\Http\Request;

class SaleMasterController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $saleMasters= SaleMaster::select(
            'bill_number','order_date','delivery_date','comment'
        )->get();

        return response()->json(['success'=>1,'data'=>$saleMasters], 200,[],JSON_NUMERIC_CHECK);
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
        $saleMasters= new SaleMaster();
        $saleMasters->bill_number=  $request->input('bill_number');
        $saleMasters->order_date=  $request->input('order_date');
        $saleMasters->delivery_date=  $request->input('delivery_date');
        $saleMasters->comment=  $request->input('comment');

        $saleMasters->save();
        return response()->json(['success'=>1,'data'=>$saleMasters,'error'=>null], 200,[],JSON_NUMERIC_CHECK);


    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\SaleMaster  $saleMaster
     * @return \Illuminate\Http\Response
     */
    public function show(SaleMaster $saleMaster)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\SaleMaster  $saleMaster
     * @return \Illuminate\Http\Response
     */
    public function edit(SaleMaster $saleMaster)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\SaleMaster  $saleMaster
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, SaleMaster $saleMaster)
    {

    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\SaleMaster  $saleMaster
     * @return \Illuminate\Http\Response
     */
    public function destroy(SaleMaster $saleMaster)
    {
        //
    }
}
