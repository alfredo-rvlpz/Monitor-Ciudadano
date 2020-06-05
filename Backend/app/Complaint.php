<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Complaint extends Model
{
    protected $table="complaints";
    protected $guarded=[];

    public function user()
    {
        return $this->belongsTo('App\User','user_id');
    }

    public function category()
    {
        return $this->belongsTo('App\Category','category_id');
    }

    public function state()
    {
        return $this->belongsTo('App\State', 'state_id');
    }

    public function copies()
    {   
        return $this->hasMany('App\Complaint', 'original_id');
    }

    public function original()
    {
        return $this->belongsTo('App\Complaint', 'original_id');
    }
}
