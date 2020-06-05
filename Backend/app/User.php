<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    protected $table = 'users';
    protected $fillable = ['email'];

    //Relación de uno a muchos, user tiene solo un rol
    public function users(){
        return $this->belongsTo('App\Role','role_id');
    }
}
