import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {CustomerService} from '../../services/customer.service';
import {Customer} from '../../models/customer.model';
import Swal from 'sweetalert2';
import { faTrashAlt} from '@fortawesome/free-regular-svg-icons';
import { faUserEdit } from '@fortawesome/free-solid-svg-icons';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { faUserAlt, faEnvelope, faMobileAlt, faMobile } from '@fortawesome/free-solid-svg-icons';
import * as deepEqual from 'fast-deep-equal';
// import {NGXLogger} from 'ngx-logger';
// import {NGXLoggerMonitor, NGXLogInterface} from 'ngx-logger';
import {NgxFancyLoggerService} from 'ngx-fancy-logger';

export interface CustomerCategory {
  id: number;
  customer_category_name: string;
}
export interface State {
  id: number;
  state_name: string;
  state_code: number;
}
export interface TransactionType {
  id: number;
  transaction_name: string;
  formal_name: string;
  transaction_type_value: number;
}
@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {
  faTrashAlt = faTrashAlt;
  faUserEdit = faUserEdit;
  faUserCircle = faUserCircle;
  faUserAlt = faUserAlt;
  faEnvelope = faEnvelope;
  faMobileAlt = faMobileAlt;
  faMobile = faMobile;

  page: number;
  pageSize = 15;
  p = 1;
  currentPage = 1;
  searchTerm: any;

  customerForm: FormGroup;
  customerCategories: CustomerCategory[] = [];
  customers: Customer[] = [];
  states: State[] = [];
  transactionTypes: TransactionType[] = [];
  validatorError: any = null;
  updateableCustomerID = 0;
  defaultCustomerFormValue: any;
  private letname: any;

  constructor(private http: HttpClient, private customerService: CustomerService, private logger: NgxFancyLoggerService) {
    // this.logger.registerMonitor(new MyLoggerMonitor());

    this.customerForm = new FormGroup({
      id: new FormControl(null),
      ledger_name: new FormControl(null, [Validators.required, Validators.maxLength(25), Validators.minLength(4)]),
      billing_name: new FormControl(null, [Validators.required, Validators.maxLength(100), Validators.minLength(4)]),
      customer_category_id: new FormControl(2),
      email: new FormControl(null),
      mobile1: new FormControl(null),
      mobile2: new FormControl(null),
      address1: new FormControl(null),
      address2: new FormControl(null),
      state_id: new FormControl(20),
      po: new FormControl(null),
      area: new FormControl(null),
      city: new FormControl(null),
      pin: new FormControl(null),
      transaction_type_id: new FormControl(1,[Validators.required]),
      opening_balance: new FormControl(0),

    });
    this.defaultCustomerFormValue = this.customerForm.value;
  }

  ngOnInit(): void {
    this.http.get('http://127.0.0.1:8000/api/dev/customerCategories').subscribe((response: {success: number, data: CustomerCategory[]}) => {
      this.customerCategories = response.data;
    });

    this.http.get('http://127.0.0.1:8000/api/dev/states').subscribe((response: {success: number, data: State[]}) => {
      this.states = response.data;
    });
    this.http.get('http://127.0.0.1:8000/api/dev/transactionTypes').subscribe((response: {success: number, data: TransactionType[]}) => {
      this.transactionTypes = response.data;
    });

    this.customerService.getCustomerServiceListener().subscribe(response => {
      this.customers = response;
    });
    this.customers = this.customerService.getCustomers();
  }

  onSubmit() {
    this.validatorError = null;
    Swal.fire({
      title: 'Confirmation',
      text: 'Do you sure to add this customer',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Create It!'
    }).then((result) => {
      if (result.isConfirmed){
        this.customerService.saveCustomer(this.customerForm.value).subscribe(response => {
          if (response.success === 1){
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Customer saved',
              showConfirmButton: false,
              timer: 1000
            });
          }else{
            this.validatorError = response.error;
            Swal.fire({
              position: 'top-end',
              icon: 'error',
              title: 'Validation error',
              showConfirmButton: false,
              timer: 3000
            });
          }
        });
      }
    });
  }


  populateCustomerForm(customer: Customer) {
    this.customerForm.patchValue(customer);
    this.updateableCustomerID = customer.id;
  }

  onUpdate() {
    this.validatorError = null;
    Swal.fire({
      title: 'Confirmation',
      text: 'Do you sure to update this customer',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Create It!'
    }).then((result) => {
      if (result.isConfirmed){
        this.customerService.updateCustomer(this.customerForm.value).subscribe(response => {
          if (response.success === 1){
            this.updateableCustomerID = 0;
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Customer updated',
              showConfirmButton: false,
              timer: 1000
            });
          }else{
            this.validatorError = response.error;
            Swal.fire({
              position: 'top-end',
              icon: 'error',
              title: 'Validation error',
              showConfirmButton: false,
              timer: 3000
            });
          }
        });
      }
    });
  }

  deleteCustomer(CustomerId) {
    Swal.fire({
      title: 'Confirmation',
      text: 'Are you sure to delete this customer',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Create It!'
    }).then((result) => {
      if (result.isConfirmed){
        this.customerService.deleteCustomer(CustomerId)
          .subscribe(response  => {
            if (response.success){
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Customer deleted',
                showConfirmButton: false,
                timer: 1000
              });
            }

          }, (error) => {
            // when error occured
            console.log(error);
          });
      }
    });
  }
  clearCustomerForm() {
    this.customerForm.reset();
    this.customerForm.patchValue({customer_category_id: 2, state_id: 20, transaction_type_id: 1, opening_balance: 0});
    this.validatorError = null;
    this.updateableCustomerID = 0;
  }
  isCustomerFormEmpty(){
    return deepEqual(this.defaultCustomerFormValue, this.customerForm.value);
  }

  copyLedgerNameToBillingName() {
    const name = this.customerForm.value.ledger_name;
    this.customerForm.patchValue({billing_name: name});

  }
}
