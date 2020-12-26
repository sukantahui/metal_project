import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {GlobalVariable} from '../shared/global';
import {VendorResponseData} from './vendor.service';
import {throwError} from 'rxjs';
import {PurchaseResponse} from '../models/purchase.model';


@Injectable({
  providedIn: 'root'
})
// @ts-ignore
export class PurchaseService {

  constructor(private http: HttpClient) {
    console.log(GlobalVariable.BASE_API_URL_DEV);
  }

  savePurchase(purchase){
    console.log(GlobalVariable.BASE_API_URL_DEV);
    return this.http.post(GlobalVariable.BASE_API_URL_DEV+'/purchases', purchase);

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
