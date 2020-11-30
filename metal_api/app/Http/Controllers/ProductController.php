<?php

namespace App\Http\Controllers;

use App\Models\Model\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use http\Exception;

class ProductController extends Controller
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

    public function getAllProducts(){
        $products = Product::select('products.id', 'products.product_name', 'products.description', 'product_categories.category_name',
                    'products.product_category_id', 'products.purchase_unit_id'
                    ,DB::raw('(select unit_name from units where units.id=products.purchase_unit_id) as purchase_unit'),'products.sale_unit_id'
                    ,DB::raw('(select unit_name from units where units.id=products.sale_unit_id) as sale_unit'))
                    ->join('product_categories','product_categories.id','products.product_category_id')
                    ->get();
        return response()->json(['success'=>1,'data'=>$products], 200,[],JSON_NUMERIC_CHECK);
    }

    public function saveProduct(Request $request){
        try{
            $product = new Product();
            $product->product_name = $request->input('product_name');
            $product->description = $request->input('description');
            $product->product_category_id = $request->input('product_category_id');
            $product->purchase_unit_id = $request->input('purchase_unit_id');
            $product->sale_unit_id = $request->input('sale_unit_id');
            $product->gst_rate = $request->input('gst_rate');
            $product->hsn_code = $request->input('hsn_code');

            $product->save();
            return response()->json(['success'=>1,'data'=>$product], 200,[],JSON_NUMERIC_CHECK);
        }catch (Illuminate\Database\QueryException $e){
            $errorCode = $e->errorInfo[1];
            if($errorCode == 1062){
                // houston, we have a duplicate entry problem
                return response()->json(['success'=>0,'data'=>$e], 200,[],JSON_NUMERIC_CHECK);
            }else{
                return response()->json(['success'=>0,'data'=>$e], 200,[],JSON_NUMERIC_CHECK);
            }
        }
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
     * @param  \App\Models\Model\Product  $product
     * @return \Illuminate\Http\Response
     */
    public function show(Product $product)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Model\Product  $product
     * @return \Illuminate\Http\Response
     */
    public function edit(Product $product)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Model\Product  $product
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Product $product)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Model\Product  $product
     * @return \Illuminate\Http\Response
     */
    public function destroy(Product $product)
    {
        //
    }
}
