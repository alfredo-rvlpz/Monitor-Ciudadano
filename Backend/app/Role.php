<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    protected $table = 'roles';
    protected $fillable=['*'];

    //Relación de uno a muchos, un rol tiene muchos usuarios
    public function users(){
        return $this->hasMany('App\User');
    }
}
