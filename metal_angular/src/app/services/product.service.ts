import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Product} from '../models/product.model';
import {Subject, throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
export interface ValidatorErrorResponse {
  product_name?: string;
  description?: string;
}

export interface PostResponseData{
  success: number;
  data: Product;
  error: ValidatorErrorResponse ;
}

@Injectable({
  providedIn: 'root'
})
// @ts-ignore
export class ProductService {
  products: Product[] = [];
  productSubject = new Subject<Product[]>();

  constructor(private http: HttpClient) {
    this.http.get('http://127.0.0.1:8000/api/dev/products')
      .subscribe((response: {success: number, data: Product[]}) => {
      this.products = response.data;
      for (const value of this.products) {
          value.isEditMode = false;
      }
      this.productSubject.next([...this.products]);
    });
  } // end of constructor

  getProducts(){
    return [...this.products];
  }
  getProductServiceListener(){
    return this.productSubject.asObservable();
  }

  // saving data in product
  saveProduct(product){
    return this.http.post<PostResponseData>('http://127.0.0.1:8000/api/dev/products', product)
      .pipe(catchError(this.serverError), tap((response: PostResponseData) => {
          if (response.success === 1){
            this.products.unshift(response.data);
            this.productSubject.next([...this.products]);
          }

      }));
  }

  // update product
  updateProduct(product){
    return this.http.put<PostResponseData>('http://127.0.0.1:8000/api/dev/products', product)
      .pipe(catchError(this.serverError), tap((response: PostResponseData) => {
        if (response.success){
          const index = this.products.findIndex(x => x.id === product.id);
          this.products[index] = response.data;
          this.productSubject.next([...this.products]);
        }
      }));

  }
  deleteProduct(productId){
    return this.http.delete('http://127.0.0.1:8000/api/dev/products/'+productId)
      .pipe(catchError(this.serverError),tap((response:{success: boolean, id: number}) => {
        const index = this.products.findIndex(x => x.id === productId);
        this.products.splice(index,1);
        this.productSubject.next([...this.products]);
      }));
  }

  private serverError(err: any) {
    // console.log('sever error:', err);  // debug
    if (err instanceof Response) {
      return throwError('backend server error');
      // if you're using lite-server, use the following line
      // instead of the line above:
      // return Observable.throw(err.text() || 'backend server error');
    }
    if (err.status === 0){
      // tslint:disable-next-line:label-position
      return throwError ({status: err.status, message: 'Backend Server is not Working', statusText: err.statusText});
    }
    if (err.status === 401){
      // tslint:disable-next-line:label-position
      return throwError ({status: err.status, message: 'Your are not authorised', statusText: err.statusText});
    }
    return throwError(err);
  }
  private handleError(errorResponse: HttpErrorResponse){
    if (errorResponse.error.message.includes('1062')){
      return throwError('Record already exists');
    }else {
      return throwError(errorResponse.error.message);
    }
  }

}
