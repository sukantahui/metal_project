<?php

namespace App\Http\Controllers;

use App\Models\ProductCategory;
use Illuminate\Http\Request;

class ProductCategoryController extends Controller
{

    public function isDeletable($id){
        $totalIntegrityCount = 0;
        $productCategory=ProductCategory::find($id);
        $productCount=$productCategory->products->count();
        $totalIntegrityCount = $totalIntegrityCount + $productCount;
        if($totalIntegrityCount == 0){
            return true;
        }else{
            return  false;
        }
    }

    public function index()
    {
        //
    }

    public function getProductCategories(){
        $productCategories = ProductCategory::get();
        return response()->json(['success'=>1,'data'=>$productCategories], 200,[],JSON_NUMERIC_CHECK);
    }

    public function create()
    {
        //
    }

    public function store(Request $request)
    {
        //
    }

    public function show(ProductCategory $productCategory)
    {
        //
    }

    public function edit(ProductCategory $productCategory)
    {
        //
    }

    public function update(Request $request, ProductCategory $productCategory)
    {
        //
    }


    public function destroy(ProductCategory $productCategory)
    {
        //
    }
}
