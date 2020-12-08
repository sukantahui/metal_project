import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {CustomerService} from "../../services/customer.service";
import {Customer} from "../../models/customer.model";


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

  customerForm: FormGroup;
  customerCategories: CustomerCategory[]=[];
  customers: Customer[]=[];
  states: State[]=[];
  transactionTypes: TransactionType[]=[];
  constructor(private http: HttpClient, private customerService: CustomerService) {
    this.customerForm = new FormGroup({
      id: new FormControl(null),
      ledger_name: new FormControl(null, [Validators.required, Validators.maxLength(100), Validators.minLength(4)]),
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
  }

  ngOnInit(): void {
    this.http.get('http://127.0.0.1:8000/api/dev/customerCategories').subscribe((response: {success: number,data: CustomerCategory[]}) => {
      this.customerCategories = response.data;
    });

    this.http.get('http://127.0.0.1:8000/api/dev/states').subscribe((response: {success: number,data: State[]}) => {
      this.states = response.data;
    });
    this.http.get('http://127.0.0.1:8000/api/dev/transactionTypes').subscribe((response: {success: number,data: TransactionType[]}) => {
      this.transactionTypes = response.data;
    });

    this.customerService.getCustomerServiceListener().subscribe(response =>{
      console.log(response)
      this.customers = response;
    });
    this.customers = this.customerService.getCustomers();
  }

  saveCustomer() {
    this.customerService.saveCustomer(this.customerForm.value).subscribe(response => {
      console.log(response);
    });
  }
}
