<?php

namespace App\Http\Controllers;

use App\Models\State;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

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
        $validator = Validator::make($request->all(),[
            'state_name' => 'required|unique:states,state_name',
            'state_code' => 'required'
        ]);
        if($validator->fails()){
            return response()->json(['success'=>0,'data'=>null,'error'=>$validator->messages()], 200,[],JSON_NUMERIC_CHECK);
        }

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
