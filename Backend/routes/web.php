<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::get('/pruebas/{nombre?}',function($nombre=null){
    $texto='<h2>Texto desde una ruta</h2>';
    $texto.=' Nombre: '.$nombre;
    return view('pruebas',array(
        'texto' => $texto
    ));
});

Route::get('/test-orm','PruebasController@testORM');

Route::post('/login','UserController@login');

Route::post('/Complaint/Create','ComplaintController@create');
Route::get('/Complaint/All',"ComplaintController@readAll");
Route::get('/Complaint/{user}/{category}',"ComplaintController@readBy");
Route::get('/Complaint/Category',"ComplaintController@readByCategory");
Route::get('/Complaint/User',"ComplaintController@readByUser");
Route::get('/Complaint/State',"ComplaintController@readByState");
Route::put('/Complaint/Update/State','ComplaintController@updateState');
Route::post('/Complaint/Delete','ComplaintController@delete');

Route::get('/Category/All',"CategoryController@readAll");
Route::get('/test', function (Request $request) {
    return response()->json(['Laravel 6 CORS Example from ItSolutionStuff.com']);
});