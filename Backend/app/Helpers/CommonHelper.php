<?php
namespace App\Helpers;

class Common {
    static public function trimArray(array $array){
        $array = array_map(function($value){
            if (gettype($value)=="string")
                return trim($value);
            else
                return $value;
        },$array);
        $array = array_filter($array ,function($value) {
            if(gettype($value)=='int'&&$value===0)
                return false;
            if ($value==""||$value==null)
                return false;
            return true;
         } );
         return $array;
    }
}
