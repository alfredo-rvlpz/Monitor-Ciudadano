<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\User;
use App\Role;
use App\Complain;

class PruebasController extends Controller
{
    public function index(){
        $titulo='Animales';
        $animales=['Perro','Gato','Tigre'];
        return view('pruebas.index',array(
            'titulo' => $titulo,
            'animales' => $animales
        ));
    }

    public function testORM(){
        $comps=Complain::all();
        foreach($comps as $comp){
            echo "<h3>{$comp->id}.-{$comp->title}</h3>";
            echo "<hr/>";
            if ($comp->original !=null)
                echo "<span>{$comp->original->id}.-{$comp->original->title}</span><br/>";
            echo "<hr/>";
            foreach($comp->copies as $cop){
                echo "<span>{$cop->id}.-{$cop->title}</span><br/>";
            }
        }
        die();
    }
}
