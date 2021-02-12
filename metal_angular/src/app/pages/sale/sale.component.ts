import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.scss']
})
export class SaleComponent implements OnInit {
  isDeveloperAreaShowable = false;
  saleMasterForm: FormGroup;
  saleDetailsForm: FormGroup;
  constructor() {
    this.saleMasterForm = new FormGroup({
      id: new FormControl(null),
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
  }

  ngOnInit(): void {
  }

}
