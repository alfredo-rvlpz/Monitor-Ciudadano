import { Complaint } from './../models/complaint';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Global} from './global';
import { Category } from '../models/category';



@Injectable()
export class ComplaintService {
    public url: string;
    constructor(
        public http: HttpClient
        ) {
            this.url = Global.url;
        }
    //Crea una queja
    create(complaint:Complaint ){
        let json = JSON.stringify(complaint);
        //console.log(json);
        return this.http.post(this.url+'/Complaint/Create',json)
    }
    // Obtiene las quejas filtradas por un parametro
    readBy(user_id:number=null,category_id:number=null){
        let array = new Array<Complaint>();
        let data;
        return this.http.get(this.url+'/Complaint/'+user_id+'/'+category_id)
    }
    // Elimina una queja
    delete(id:number,user_id:number){
        let json={id:id,user_id:user_id}
        let j=JSON.stringify(json);
        //console.log(j);
        return this.http.post(this.url+'/Complaint/Delete', j)
    }

}
