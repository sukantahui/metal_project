import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { GlobalVariable } from '../shared/global';
import {Customer} from '../models/customer.model';
import {Subject, throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';

export interface ValidatorErrorResponse {
  ledger_name?: string[];
  billing_name?: string[];
  email?: string[];
}

export interface CustomerResponseData {
  success: number;
  data: Customer;
  error: ValidatorErrorResponse;
}

@Injectable({
  providedIn: 'root'
})
// @ts-ignore
export class CustomerService {
  customers: Customer[] = [];
  customerSubject = new Subject<Customer[]>();

  constructor(private http: HttpClient) {
    this.http.get(GlobalVariable.BASE_API_URL_DEV + '/customers')
      .subscribe((response: {success:number,data:Customer[]}) => {
          this.customers = response.data;
          this.customerSubject.next([...this.customers]);
    });
  }
  getCustomers(){
    return [...this.customers];
  }

  getCustomerServiceListener(){
    return this.customerSubject.asObservable();
  }
  saveCustomer(customer){
    return this.http.post(GlobalVariable.BASE_API_URL_DEV + '/customers', customer)
      .pipe(catchError(this.serverError), tap((response: CustomerResponseData) => {
        if (response.success === 1){
          this.customers.unshift(response.data);
          this.customerSubject.next([...this.customers]);
        }
      }));
  }

  updateCustomer(customer){
    return this.http.patch(GlobalVariable.BASE_API_URL_DEV + '/customers', customer)
      .pipe(catchError(this.serverError), tap((response: CustomerResponseData) => {
        if (response.success === 1){
          const index = this.customers.findIndex(x => x.id === customer.id);
          this.customers[index] = response.data;
          this.customerSubject.next([...this.customers]);
        }
      }));
  }

  deleteCustomer(CustomerId){
    return this.http.delete(GlobalVariable.BASE_API_URL_DEV + '/customers/'+CustomerId)
      .pipe(catchError(this.serverError), tap((response: {success:boolean, id:number}) => {
        if (response.success){
          const index = this.customers.findIndex(x => x.id === CustomerId);
          this.customers.splice(index,1);
          this.customerSubject.next([...this.customers]);
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
}
