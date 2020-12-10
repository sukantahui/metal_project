import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-vendor',
  templateUrl: './vendor.component.html',
  styleUrls: ['./vendor.component.scss']
})
export class VendorComponent implements OnInit {

  vendorForm: FormGroup;

  constructor() {
    this.vendorForm = new FormGroup({
      id: new FormControl(null),
      ledger_name: new FormControl(null, [Validators.required, Validators.maxLength(100), Validators.minLength(4)]),
      billing_name: new FormControl(null, [Validators.required, Validators.maxLength(100), Validators.minLength(4)]),
      customer_category_id: new FormControl(1),
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
      transaction_type_id: new FormControl(2,[Validators.required]),
      opening_balance: new FormControl(0),

    });
  }

  ngOnInit(): void {
  }

  onSubmit() {

  }

  onUpdate() {

  }
}
