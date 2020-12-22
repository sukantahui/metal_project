<?php

namespace App\Http\Controllers;

use App\Models\ExtraItem;
use Illuminate\Http\Request;

class ExtraItemController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $items = ExtraItem::get();
        return response()->json(['success'=>1,'data'=>$items], 200,[],JSON_NUMERIC_CHECK);
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
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\ExtraItem  $extraItem
     * @return \Illuminate\Http\Response
     */
    public function show(ExtraItem $extraItem)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\ExtraItem  $extraItem
     * @return \Illuminate\Http\Response
     */
    public function edit(ExtraItem $extraItem)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\ExtraItem  $extraItem
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, ExtraItem $extraItem)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\ExtraItem  $extraItem
     * @return \Illuminate\Http\Response
     */
    public function destroy(ExtraItem $extraItem)
    {
        //
    }
}
