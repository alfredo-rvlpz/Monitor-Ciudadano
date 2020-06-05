import { User } from './../models/user';
import { Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Global} from './global';

@Injectable({providedIn:'root'})
export class UserService{

  public url: string;
  public id:number;
  public user=new Subject<any>();

  constructor(
    public http: HttpClient
    ) {
    this.url = Global.url;
  }        

  // Recupera la informacion de un unsario segun su correo
  logIn(user: User):Observable<any>{
    let temp;
    return this.http.post(this.url+'/login',{'email':user.email});
  }

  // Crea un usuario en el servicio para ser visto por todos
  setUser( user:User ) {
    this.user.next({ user:user });
  }

  // Quita al usuario del servicio.
  logOutUser(){
    this.user.next();
  }

  //Obtiene el usuario del servicio para ser mostrado a los componentes que los soliciten, asi complaint ve el usuario de app component 
  getUser(){
    return this.user.asObservable();
  }
}