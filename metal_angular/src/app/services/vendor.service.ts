import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {GlobalVariable} from '../shared/global';
import {Vendor} from '../models/vendor.model';
import {Subject, throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {CustomerResponseData} from './customer.service';

export interface ValidatorErrorResponse {
  ledger_name?: string[];
  billing_name?: string[];
  email?: string[];
}

export interface VendorResponseData {
  success: number;
  data: Vendor;
  error: ValidatorErrorResponse;
}

@Injectable({
  providedIn: 'root'
})
// @ts-ignore
export class VendorService {

  vendors: Vendor[] = [];
  vendorSubject = new Subject<Vendor[]>();
  constructor(private http: HttpClient) {
    this.http.get(GlobalVariable.BASE_API_URL_DEV + '/vendors')
      .subscribe((response: {success: number, data: Vendor[]}) => {
        this.vendors = response.data;
        this.vendorSubject.next([...this.vendors]);
      });
  }

  getVendors(){
    return [...this.vendors];
  }

  getVendorServiceListener(){
    return this.vendorSubject.asObservable();
  }

  saveVendor(vendor){
    return this.http.post(GlobalVariable.BASE_API_URL_DEV + '/vendors', vendor)
      .pipe(catchError(this.serverError), tap((response: VendorResponseData) => {
        if (response.success === 1){
          this.vendors.unshift(response.data);
          this.vendorSubject.next([...this.vendors]);
        }
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

  updateVendor(vendor){
    return this.http.patch(GlobalVariable.BASE_API_URL_DEV + '/vendors', vendor)
      .pipe(catchError(this.serverError), tap((response: CustomerResponseData) => {
        if (response.success === 1){
          const index = this.vendors.findIndex(x => x.id === vendor.id);
          this.vendors[index] = response.data;
          this.vendorSubject.next([...this.vendors]);
        }
      }));
  }
  deleteVendor(vendorId){
    return this.http.delete(GlobalVariable.BASE_API_URL_DEV + '/vendors/' + vendorId)
      .pipe(catchError(this.serverError), tap((response: {success: boolean, id: number}) => {
        if (response.success){
          const index = this.vendors.findIndex(x => x.id === vendorId);
          this.vendors.splice(index, 1);
          this.vendorSubject.next([...this.vendors]);
        }
      }));
  }


}
