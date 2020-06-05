<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Complaint;
use Carbon\Carbon;
use App\State;
use App\Helpers\Common;

class ComplaintController extends Controller
{
    const STATE = 1; //Actual, valor para quejas por meses, actualmente no implmentado
    //  Crea una queja
    public function create(Request $request){
        $json=$request->getContent();
        $params=json_decode($json,true);
        // funcion para limpiar los valores para el validator y evitar error de compatbilidad (int <-> string)
        $params=Common::trimArray($params);
        // Valida los campos con la reglas establecidas abajo 
        $validate=Validator::make($params,[
            'user_id'=> 'required|numeric|exists:users,id', //Checar si este id coincide con el token auten !!!!!!!!!
            'category_id' => 'required|numeric|exists:categories,id',
            'title'=>'max:100',
            'original_id'=>'numeric|exists:complaints,id',
            'description' => 'max:240',
            'image'=>'image',
            'latitude'=> 'required|numeric',
            'longitude'=>'required|numeric'
        ]);
        //Regresa un mensaje si la validacion fallo
        if ($validate->fails()){
            $data= array(
                'status'=>'error',
                'code'=>412,
                'message'=>'Validation error',
                'errors'=> $validate->errors()
            );
        } else {
            //Verifica si ya tiene una queja del mismo tipo creada
            $complaint= Complaint::firstWhere(['user_id'=>$params['user_id'],'category_id'=>$params['category_id'],'state_id'=>self::STATE]);
            if ($complaint!=null){
                $data= array(
                    'status'=>'error',
                    'code'=>400,
                    'message'=>'You already have a complaint with this category',
                    'data'=> [
                        'complaint'=> $complaint
                    ]
                );
            } else {
                // Si no la tiene crea la queja 
                $complaint=Complaint::create([
                    'user_id'=> $params['user_id'],
                    'category_id' => $params['category_id'],
                    'state_id'=> self::STATE,
                    'original_id'=> (array_key_exists ('original_id',$params))? $params['original_id']: null,
                    'description' => $params['description'],
                    'latitude'=> $params['latitude'],
                    'longitude'=> $params['longitude'],
                    'image'=> (array_key_exists ('image',$params))? $params['image']: null,
                ]);
                // Devuelve un mensaje con la queja creada
                $data= array(
                    'status'=>'success',
                    'code'=>200,
                    'message'=>'The complaint created successfully ',
                    'data'=> [
                        'complaint'=> $complaint
                    ]
                );
                
            }
            
        }
        return response()->json($data, $data['code']);
    }

    // Lee todas la quejas 
    public function readAll(Request $request){
        $array = array();
        $complaints=Complaint::where('state_id',self::STATE)->where('created_at', '>=', Carbon::now()->subMonth())->get();
        foreach ($complaints as $complaint){
            $complaint['category']=$complaint->category()->first();
        }
        $data= array(
            'status'=>'success',
            'code'=>200,
            'message'=>'All complaints were successfully recovered',
            'data'=> [
                'complaints'=> $complaints
            ]
        );
        return response()->json($data, $data['code']); 
    }

    //Lee las quejas por usuario o por categoria
    public function readBy(Request $request,$user,$category){
        $params=array('user_id'=>(int)$user,'category_id'=>(int)$category);
        $params=Common::trimArray($params);
        $validate=Validator::make($params,[
            'category_id'=>'numeric|exists:categories,id',
            'user_id'=>'numeric|exists:users,id'
        ]);
        if ($validate->fails()){
            $data= array(
                'status'=>'error',
                'code'=>412,
                'message'=>'Validation error',
                'errors'=> $validate->errors()
            );
        } else {
            $params['state_id']=self::STATE;
            $complaints=Complaint::where($params)->where('created_at', '>=', Carbon::now()->subMonth())->get();
            foreach ($complaints as $complaint){
                $complaint['category']=$complaint->category()->first();
            }
            $data= array(
                'status'=>'success',
                'code'=>200,
                'message'=>'All complaints were successfully recovered',
                'data'=> [
                    'complaints'=> $complaints
                ]
            );
        }
        return response()->json($data, $data['code']); 
    }

    // Lee por cateogoria
    public function readByCategory(Request $request){
        $json=$request->getContent();
        $params=json_decode($json,true);
        $params=Common::trimArray($params);
        $validate=Validator::make($params,[
            'id'=>'required|numeric|exists:categories,id'
        ]);
        if ($validate->fails()){
            $data= array(
                'status'=>'error',
                'code'=>412,
                'message'=>'Validation error',
                'errors'=> $validate->errors()
            );
        } else {
            $complaints=Complaint::where(['state_id'=>self::STATE,'category_id'=>$params['id']])->where('created_at', '>=', Carbon::now()->subMonth())->get();
            $data= array(
                'status'=>'success',
                'code'=>200,
                'message'=>'All complaints were successfully recovered',
                'data'=> [
                    'complaints'=> $complaints
                ]
            );
        }
        return response()->json($data, $data['code']); 
    }

    public function readByUser(Request $request){
        $json=$request->getContent();
        $params=json_decode($json,true);
        $params=Common::trimArray($params);
        $validate=Validator::make($params,[
            'id'=>'required|numeric|exists:users,id'
        ]);
        if ($validate->fails()){
            $data= array(
                'status'=>'error',
                'code'=>412,
                'message'=>'Validation error',
                'errors'=> $validate->errors()
            );
        } else {
            $complaints=Complaint::where(['state_id'=>self::STATE,'user_id'=>$params['id']])->get();
            $data= array(
                'status'=>'success',
                'code'=>200,
                'message'=>'All complaints were successfully recovered',
                'data'=> [
                    'complaints'=> $complaints
                ]
            );
        }
        return response()->json($data, $data['code']); 
    }

    public function readByState(Request $request){
        $json=$request->getContent();
        $params=json_decode($json,true);
        $params=Common::trimArray($params);
        $validate=Validator::make($params,[
            'id'=>'required|numeric|exists:states,id'
        ]);
        if ($validate->fails()){
            $data= array(
                'status'=>'error',
                'code'=>412,
                'message'=>'Validation error',
                'errors'=> $validate->errors()
            );
        } else {
            $complaints=Complaint::where('state_id',$params['id'])->get();
            $data= array(
                'status'=>'success',
                'code'=>200,
                'message'=>'All complaints were successfully recovered',
                'data'=> [
                    'complaints'=> $complaints
                ]
            );
        }
        return response()->json($data, $data['code']); 
    }

    public function update(Request $request){
        //You can't update, you have to delete and create a new one
    }

    public function updateState(Request $request){
        $json=$request->getContent();
        $params=json_decode($json,true);
        $params=Common::trimArray($params);
        $validate=Validator::make($params,[
            'id'=> 'required|numeric|exists:complaints,id',
            'state_id'=>'required|numeric|exists:states,id'
        ]);
        if ($validate->fails()){
            $data= array(
                'status'=>'error',
                'code'=>412,
                'message'=>'Validation error',
                'errors'=> $validate->errors()
            );
        } else {
            $complaint=Complaint::firstWhere(['id'=>$params['id'],'state_id'=>self::STATE]);
            $complaint->state_id=$params['state_id'];
            $complaint->save();
            $data= array(
                'status'=>'success',
                'code'=>200,
                'message'=>'The complaint were successfully modified',
                'data'=> [
                    'complaint'=> $complaint
                ]
            );
        }
        return response()->json($data, $data['code']); 
    }

    public function delete(Request $request){
        $json=$request->getContent();
        $params=json_decode($json,true);
        $params=Common::trimArray($params);
        $validate=Validator::make($params,[
            'id'=> 'required|numeric|exists:complaints,id',
            'user_id'=>'required|numeric|exists:users,id'
        ]);
        if ($validate->fails()){
            $data= array(
                'status'=>'error',
                'code'=>412,
                'message'=>'Validation error',
                'errors'=> $validate->errors()
            );
        } else {
            $complaint=Complaint::firstWhere(['id'=>$params['id'],'user_id'=>$params['user_id']]);
            $complaint->delete();
            $data= array(
                'status'=>'success',
                'code'=>200,
                'message'=>'The complaint were successfully deleted'
            );
        }
        return response()->json($data, $data['code']); 
    }
}
