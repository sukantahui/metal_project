<?php

namespace App\Http\Controllers;

use App\Http\Resources\TransactionResource;
use App\Models\TransactionMaster;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    public function getTransactionByID($id){
        $transaction_master = TransactionMaster::findOrFail($id);
        return response()->json(['success'=>1,'data'=>new
        ($transaction_master)], 200,[],JSON_NUMERIC_CHECK);
    }
}
