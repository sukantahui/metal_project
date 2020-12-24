<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProductCategoryController;
use App\Http\Controllers\UnitController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\VendorController;
use App\Http\Controllers\CustomerCategoryController;
use App\Http\Controllers\StateController;
use App\Http\Controllers\TransactionTypeController;
use App\Http\Controllers\ExtraItemController;
use App\Http\Controllers\PurchaseController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});
Route::post("login",[UserController::class,'login']);
Route::post("register",[UserController::class,'register']);

Route::group(['middleware' => 'auth:sanctum'], function(){
    //All secure URL's
    Route::get("user",[UserController::class,'getCurrentUser']);
    Route::get("logout",[UserController::class,'logout']);

    //get all users
    Route::get("users",[UserController::class,'getAllUsers']);
});




Route::group(array('prefix' => 'dev'), function() {
    //products
    Route::get("products",[ProductController::class,'getAllProducts']);
    Route::post("products",[ProductController::class,'saveProduct']);
    Route::put("products",[ProductController::class,'updateProduct']);
    Route::delete("products/{id}",[ProductController::class,'deleteProduct']);

    //product_category
    Route::get("productCategories",[ProductCategoryController::class,'getProductCategories']);
    Route::get("productCategories/isDeletable/{id}",[ProductCategoryController::class,'isDeletable']);

    //units
    Route::get("units",[UnitController::class,'getAllUnits']);

    //customers
    Route::get("customers",[CustomerController::class,'index']);
    Route::post("customers",[CustomerController::class,'store']);
    Route::patch("customers",[CustomerController::class,'update']);
    Route::delete("customers/{id}",[CustomerController::class,'destroy']);
    Route::get("customerCategories",[CustomerCategoryController::class,'index']);

    //vendors
    Route::get("vendors",[VendorController::class,'index']);
    Route::post("vendors",[VendorController::class,'store']);
    Route::patch("vendors",[VendorController::class,'updateVendor']);
    Route::patch("vendors/{id}",[VendorController::class,'updateVendorById']);
    Route::delete("vendors/{id}",[VendorController::class,'destroy']);

    //others
    Route::get("states",[StateController::class,'index']);
    Route::get("transactionTypes",[TransactionTypeController::class,'index']);

    Route::get("extraItems",[ExtraItemController::class,'index']);

    //purchase
    Route::post("purchases",[PurchaseController::class,'PurchaseController']);

});

