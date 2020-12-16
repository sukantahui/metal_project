import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Vendor} from "../../models/vendor.model";
import {VendorService} from "../../services/vendor.service";
import {ProductCategory} from "../product/product.component";
import {HttpClient} from "@angular/common/http";
import {ProductService} from "../../services/product.service";
import {Product} from "../../models/product.model";
import {PurchaseMaster} from "../../models/purchase-master.model";
import {PurchaseDetails} from "../../models/purchase-details.model";

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.scss']
})
export class PurchaseComponent implements OnInit {
  p: number;
  purchaseMasterForm: FormGroup;
  purchaseDetailsForm: FormGroup;
  vendors: Vendor[] = [];
  productCategories: ProductCategory[] = [];
  products: Product[] = [];
  productsByCategory: Product[] = [];
  selectedLedger: Vendor = null;
  selectedProduct: Product = null;

  purchaseMaster: PurchaseMaster = null;
  purchaseDetails: PurchaseDetails[] = [];

  selectedProductCategoryId = 1;
  constructor(private http: HttpClient, private vendorService: VendorService, private productService: ProductService) {

    this.purchaseMasterForm = new FormGroup({
      id: new FormControl(null),
      ledger_id: new FormControl(null),
      invoice_number: new FormControl(null),
      reference_number: new FormControl(null),
      challan_number: new FormControl(null),
      order_number: new FormControl(null),
      purchase_date: new FormControl(null),
      order_date: new FormControl(null)

    });

    this.purchaseDetailsForm = new FormGroup({
      id: new FormControl(null),
      product_category_id: new FormControl(1),
      product_id: new FormControl(null),
      rate: new FormControl(null),
      purchase_quantity: new FormControl(null),
      stock_quantity: new FormControl(null),
      comment: new FormControl(null),

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
    this.productsByCategory = this.products.filter(item => item.product_category_id === this.selectedProductCategoryId);
    this.productService.getProductServiceListener().subscribe(response => {
      this.products = response;
      this.productsByCategory = this.products.filter(item => item.product_category_id === this.selectedProductCategoryId);
    });
  }

  onSelectedVendor(value){
    this.selectedLedger = value;
  }

  onProductCategorySelected(value){
    this.selectedProductCategoryId = value;
    this.productsByCategory = this.products.filter(item => item.product_category_id === this.selectedProductCategoryId);
  }

  onSelectedProduct(value) {
    this.selectedProduct = value;
  }

  addItem(){
    this.purchaseDetails.unshift(this.purchaseDetailsForm.value);
  }
}
