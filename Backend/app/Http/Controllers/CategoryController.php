<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Category;

class CategoryController extends Controller
{
    public function readAll(){
        $categories=Category::all();
        $data= array(
            'status'=>'success',
            'code'=>200,
            'message'=>'All categories were successfully recovered',
            'data'=> [
                'categories'=> $categories
            ]
        );
        return response()->json($data, $data['code']); 
    }
}
