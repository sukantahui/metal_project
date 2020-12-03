<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use http\Exception;
use Illuminate\Support\Facades\Validator;

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
                    ,DB::raw('(select unit_name from units where units.id=products.purchase_unit_id) as purchase_unit_name'),'products.sale_unit_id'
                    ,DB::raw('(select unit_name from units where units.id=products.sale_unit_id) as sale_unit_name'))
                    ->join('product_categories','product_categories.id','products.product_category_id')
                    ->get();
        return response()->json(['success'=>1,'data'=>$products], 200,[],JSON_NUMERIC_CHECK);
    }

    public function saveProduct(Request $request){
        $validator = Validator::make($request->all(), [
            'product_name' => 'required|unique:products,product_name',
            'description' => 'required|max:25',
            'product_category_id' => 'required|exists:product_categories,id',
            'purchase_unit_id' => 'required',
            'sale_unit_id' => 'required',
//             to use between
            'gst_rate' => 'required|integer|between:1,18',
//              for greater than value
//            'gst_rate' => 'required|integer|gt:1',
            'hsn_code' => 'required',
        ]);

        if ($validator->fails()) {

            return response()->json(['success'=>0,'data'=>null,'error'=>$validator->messages()], 200,[],JSON_NUMERIC_CHECK);

        }
        /*
             {
                "product_name": "teste234",
                "description": "asdfasfdas dfgh d dfdf sd sdf sdf sdfg sdf sdf sd df sdfg  sdfgsdgsdggh",
                "product_category_id": 2,
                "purchase_unit_id": 1,
                "sale_unit_id": 1,
                "hsn_code": "asdf",
                "gst_rate": 12

             }
         */

        /*
         * This way we can check the product is updated or created
         * */
//        $product = Product::updateOrCreate ([
//            'product_name'=>$request->input('product_name')
//            ,'description'=>$request->input('description')
//            ,'product_category_id'=>$request->input('product_category_id')
//            ,'purchase_unit_id'=>$request->input('purchase_unit_id')
//            ,'sale_unit_id'=>$request->input('sale_unit_id')
//            ,'gst_rate'=>$request->input('gst_rate')
//            ,'hsn_code'=>$request->input('hsn_code')
//        ]);
//        return response()->json(['success'=>1,'data'=>$product,'stat'=>$product->wasRecentlyCreated], 200,[],JSON_NUMERIC_CHECK);



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
            $product->setAttribute('category_name', $product->category->category_name);
            $product->setAttribute('purchase_unit_name', $product->purchase_unit->unit_name);
            $product->setAttribute('sale_unit_name', $product->sale_unit->unit_name);

            return response()->json(['success'=>1,'data'=>$product, 'error'=>null], 200,[],JSON_NUMERIC_CHECK);
        }catch (Illuminate\Database\QueryException $e){
            $errorCode = $e->errorInfo[1];
            if($errorCode == 1062){
                // houston, we have a duplicate entry problem
                return response()->json(['success'=>0,'data'=>null, 'error'=>$e], 200,[],JSON_NUMERIC_CHECK);
            }else{
                return response()->json(['success'=>0,'data'=>null, 'error'=>$e], 200,[],JSON_NUMERIC_CHECK);
            }
        }
    }


    public function updateProduct(Request $request){
        $validator = Validator::make($request->all(), [
            'product_name' => 'required',
            'description' => 'required|max:25',
            'product_category_id' => 'required|exists:product_categories,id',
            'purchase_unit_id' => 'required',
            'sale_unit_id' => 'required',
//             to use between
            'gst_rate' => 'required|integer|between:1,18',
//              for greater than value
//            'gst_rate' => 'required|integer|gt:1',
            'hsn_code' => 'required',
        ]);
       if($validator->fails()){
           return response()->json(['success'=>0,'data'=>null,'error'=>$validator->messages()], 200,[],JSON_NUMERIC_CHECK);
       }

        try{
            $product = new Product();
            $product=Product::find($request->input('id'));
            $product->product_name = $request->input('product_name');
            $product->description = $request->input('description');
            $product->product_category_id = $request->input('product_category_id');
            $product->purchase_unit_id = $request->input('purchase_unit_id');
            $product->sale_unit_id = $request->input('sale_unit_id');
            $product->gst_rate = $request->input('gst_rate');
            $product->hsn_code = $request->input('hsn_code');

            $product->update();
            $product->setAttribute('category_name', $product->category->category_name);
            $product->setAttribute('purchase_unit_name', $product->purchase_unit->unit_name);
            $product->setAttribute('sale_unit_name', $product->sale_unit->unit_name);

            return response()->json(['success'=>1,'data'=>$product, 'error'=>null], 200,[],JSON_NUMERIC_CHECK);
        }catch(Illuminate\Database\QueryException $e){
            return response()->json(['success'=>0,'data'=>null, 'error'=>$e], 200,[],JSON_NUMERIC_CHECK);
        }

    }





}
