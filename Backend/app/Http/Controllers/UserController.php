<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use App\User;
use App\Role;

class UserController extends Controller
{
    public function login(Request $request){
        $json=$request->getContent();
        $params=json_decode($json,true);
        $params=array_map('trim',$params);
        $model=json_decode(json_encode($params));
        $validate= Validator::make($params,[
            'email' => 'required|max:50|email'
        ]);
        if ($validate->fails()){
            $data= array(
                'status'=>'error',
                'code'=>412,
                'message'=>'Validation error',
                'errors'=> $validate->errors()
            );
        } else {
            $validate=Validator::make($params,[
                'email' => 'exists:users,email'
            ]);
            if ($validate->fails()){
                $role=Role::firstWhere('name','Usuario')['id'];
                $user = new User;
                $user->role_id=$role;
                $user->fill(['email'=>$model->email]);
                $user->save();
            }
            $user=User::firstWhere('email',$params['email']);
            $data= array(
                'status'=>'success',
                'code'=>200,
                'message'=>'Log in successfully',
                'data' => [
                    'user'=> $user
                ]
            ); 
        }
        return response()->json($data, $data['code']);
    }
}
