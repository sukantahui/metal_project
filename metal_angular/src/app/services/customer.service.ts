import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { GlobalVariable } from '../shared/global';
import {Customer} from '../models/customer.model';
import {Subject, throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {ErrorService} from './error.service';

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

  constructor(private http: HttpClient, private errorService: ErrorService) {
    this.http.get(GlobalVariable.BASE_API_URL_DEV + '/customers')
      .subscribe((response: {success: number, data: Customer[]}) => {
          this.customers = response.data;
          //sending update information to the listeners
          this.customerSubject.next([...this.customers]);
    });
  }
  // to get customers' copy when required, this method will be called b the component
  getCustomers(){
    return [...this.customers];
  }

  getCustomerServiceListener(){
    return this.customerSubject.asObservable();
  }

  saveCustomer(customer){
    return this.http.post(GlobalVariable.BASE_API_URL_DEV + '/customers', customer)
      .pipe(catchError(this.errorService.serverError), tap((response: CustomerResponseData) => {
        if (response.success === 1){
          this.customers.unshift(response.data);
          this.customerSubject.next([...this.customers]);
        }
      }));
  }

  updateCustomer(customer){
    return this.http.patch(GlobalVariable.BASE_API_URL_DEV + '/customers', customer)
      .pipe(catchError(this.errorService.serverError), tap((response: CustomerResponseData) => {
        if (response.success === 1){
          const index = this.customers.findIndex(x => x.id === customer.id);
          this.customers[index] = response.data;
          this.customerSubject.next([...this.customers]);
        }
      }));
  }

  deleteCustomer(CustomerId){
    return this.http.delete(GlobalVariable.BASE_API_URL_DEV + '/customers/' + CustomerId)
      .pipe(catchError(this.errorService.serverError), tap((response: {success: boolean, id: number}) => {
        if (response.success){
          const index = this.customers.findIndex(x => x.id === CustomerId);
          this.customers.splice(index, 1);
          this.customerSubject.next([...this.customers]);
        }
      }));
  }
}
