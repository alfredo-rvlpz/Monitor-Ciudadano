import { Category } from './../models/category';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Global} from './global';

@Injectable()
export class CategoryService{
    public url: string;
    constructor(
        public http: HttpClient
        ) {
            this.url = Global.url;
        }

    // Recupera todas la categorias
    readAll(){
        let array=new Array<Category>();
        let data;
        this.http.get(this.url+'/Category/All').subscribe(
            response => {
                data=response['data']['categories'];
                data.forEach(item => {
                    array.push(new Category(
                        item['id'],
                        item['name'],
                        item['icon']
                    ));
                });
            }
        );
        return array;
    }
}