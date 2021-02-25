import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {formatDate} from "@angular/common";
import {Customer} from "../../models/customer.model";
import {CustomerService} from "../../services/customer.service";

@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.scss']
})
export class SaleComponent implements OnInit {
  isDeveloperAreaShowable = false;
  saleMasterForm: FormGroup;
  saleDetailsForm: FormGroup;
  transactionMasterForm: FormGroup;
  transactionDetailsForm: FormGroup;
  customers: Customer[] = [];
  selectedLedger: Customer;
  constructor(private customerService: CustomerService) {
    const now = new Date();
    const currentSQLDate = formatDate(now, 'yyyy-MM-dd', 'en');

    //this will fill up local customers variable from customerService
    this.customers = this.customerService.getCustomers();
    this.customerService.getCustomerServiceListener().subscribe(response => {
      this.customers = response;
    });

    this.saleMasterForm = new FormGroup({
      id: new FormControl(null),
      bill_number: new FormControl(null),
      comment: new FormControl(null),
    });

    this.saleDetailsForm = new FormGroup({
      id: new FormControl(null),
      product_category_id: new FormControl(1),
      product_id: new FormControl(null),
      rate: new FormControl(null),
      sale_quantity: new FormControl(null),
      amount: new FormControl(null)
    });
    const userData: {id: number, personName: string, _authKey: string, personTypeId: number} = JSON.parse(localStorage.getItem('user'));
    this.transactionMasterForm = new FormGroup({
      id: new FormControl(null),
      transaction_number: new FormControl(null),
      user_id: new FormControl(userData.id),
      transaction_date: new FormControl(currentSQLDate)
    });

    this.transactionDetailsForm = new FormGroup({
      id: new FormControl(null),
      transaction_master_id: new FormControl(null),
      ledger_id: new FormControl(null),
      transaction_type_id: new FormControl(2),
      amount: new FormControl(0),
    });
  }

  ngOnInit(): void {
    //this will fill up local customers variable from customerService
    this.customers = this.customerService.getCustomers();
    this.customerService.getCustomerServiceListener().subscribe(response => {
      this.customers = response;
    });
  }

  onSelectedCustomer(value) {
    this.selectedLedger = value;
  }
}
