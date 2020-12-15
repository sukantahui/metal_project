import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Vendor} from "../../models/vendor.model";
import {VendorService} from "../../services/vendor.service";
import {ProductCategory} from "../product/product.component";
import {HttpClient} from "@angular/common/http";
import {ProductService} from "../../services/product.service";
import {Product} from "../../models/product.model";

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.scss']
})
export class PurchaseComponent implements OnInit {
  p: number;
  purchaseForm: FormGroup;
  vendors: Vendor[] = [];
  productCategories: ProductCategory[] = [];
  products: Product[] = [];
  selectedLedger: Vendor = null;
  constructor(private http: HttpClient, private vendorService: VendorService, private productService: ProductService) {

    this.purchaseForm = new FormGroup({
      id: new FormControl(null),
      ledger_id: new FormControl(null),
      invoice_number: new FormControl(null),
      reference_number: new FormControl(null),
      challan_number: new FormControl(null),
      order_number: new FormControl(null),
      purchase_date: new FormControl(null),
      order_date: new FormControl(null),
      product_category_id: new FormControl(null),
      product_id: new FormControl(null),

    });
  }

  ngOnInit(): void {

    this.vendors = this.vendorService.getVendors();
    this.vendorService.getVendorServiceListener().subscribe(response => {
      this.vendors = response;
    });

    this.http.get('http://127.0.0.1:8000/api/dev/productCategories')
      .subscribe((response: {success: number, data: ProductCategory[]}) => {
        this.productCategories = response.data;
      });

    this.products = this.productService.getProducts();
    this.productService.getProductServiceListener().subscribe(response => {
      this.products = response;
    });
  }

  onSelectedVendor(value){
    this.selectedLedger = value;
  }

}
