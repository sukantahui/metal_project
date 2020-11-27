import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Product} from "../models/product.model";
import {Subject} from "rxjs";


@Injectable({
  providedIn: 'root'
})
// @ts-ignore
export class ProductService {
  products: Product[] = [];
  productSubject = new Subject<Product[]>();

  constructor(private http: HttpClient) {
    this.http.get('http://127.0.0.1:8000/api/dev/products').subscribe((response: {success: number, data: Product[]})=>{
      this.products = response.data;
      this.productSubject.next([...this.products]);
    });
  }

  getProductServiceListener(){
    return this.productSubject.asObservable();
  }
}
