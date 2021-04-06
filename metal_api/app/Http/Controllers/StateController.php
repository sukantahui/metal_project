<?php

namespace App\Http\Controllers;

use App\Models\Ledger;
use App\Models\State;
use Illuminate\Http\Request;

class StateController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
        $states = State::get();
        return response()->json(['success'=>1,'data'=>$states], 200,[],JSON_NUMERIC_CHECK);
    }
    public function getStateByID($id){
        $state = State::findOrFail($id);
        return response()->json(['success'=>1,'data'=>$state], 200,[],JSON_NUMERIC_CHECK);
    }

    public function create(Request $request)
    {
        $state = new State();
        $state->state_name = $request->input('state_name');
        $state->state_code = $request->input('state_code');
        $state->save();

        return response()->json(['success'=>1,'data'=>$state], 200,[],JSON_NUMERIC_CHECK);
    }

    public function edit(Request $request)
    {
        $state = new State();
        $state = $state::find($request->input('id'));
        $state->state_name = $request->input('state_name');
        $state->state_code = $request->input('state_code');
        $state->save();
        return response()->json(['success'=>1,'data'=>$state], 200,[],JSON_NUMERIC_CHECK);
    }

    public function destroy($id)
    {
        $state = State::find($id);
        if(!empty($state)){
            $result = $state->delete();
        }else{
            $result = false;
        }
        return response()->json(['success'=>$result,'id'=>$id], 200);
    }
}
