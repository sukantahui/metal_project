import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Vendor} from '../../models/vendor.model';
import {VendorService} from '../../services/vendor.service';
import {ProductCategory, Unit} from '../product/product.component';
import {HttpClient} from '@angular/common/http';
import {ProductService} from '../../services/product.service';
import {Product} from '../../models/product.model';
import {PurchaseMaster} from '../../models/purchase-master.model';
import {PurchaseDetail} from '../../models/purchase-detail.model';
import {formatDate} from '@angular/common';
import { faUserEdit, faTrashAlt} from '@fortawesome/free-solid-svg-icons';
import {StorageMap} from '@ngx-pwa/local-storage';

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
  units: Unit[] = [];
  productsByCategory: Product[] = [];
  selectedLedger: Vendor = null;
  selectedProduct: Product = null;

  purchaseMaster: PurchaseMaster = null;
  purchaseDetails: PurchaseDetail[] = [];

  selectedProductCategoryId = 1;
  private formattedMessage: string;
  pageSize: string | number;

  faUserEdit = faUserEdit;
  faTrashAlt = faTrashAlt;
  saveablePurchaseDetails: { rate: number; id: number }[];
  purchaseContainer: {pm: PurchaseMaster, pd: PurchaseDetail[]};

  constructor(private http: HttpClient, private vendorService: VendorService, private productService: ProductService, private storage: StorageMap) {
    const now = new Date();
    const val = formatDate(now, 'yyyy-MM-dd', 'en');
    this.purchaseMasterForm = new FormGroup({
      id: new FormControl(null),
      ledger_id: new FormControl(null),
      invoice_number: new FormControl(null),
      reference_number: new FormControl(null),
      challan_number: new FormControl(null),
      order_number: new FormControl(null),
      purchase_date: new FormControl(val),
      order_date: new FormControl(val),
      comment: new FormControl(null),

    });

    this.purchaseDetailsForm = new FormGroup({
      id: new FormControl(null),
      product_category_id: new FormControl(1),
      product_id: new FormControl(null),
      rate: new FormControl(null),
      purchase_quantity: new FormControl(null),
      stock_quantity: new FormControl(null),

    });


  }

  ngOnInit(): void {
    // this.purchaseMasterForm.valueChanges.subscribe(val => {
    //   console.log(val);
    // });

    this.vendors = this.vendorService.getVendors();
    this.vendorService.getVendorServiceListener().subscribe(response => {
      this.vendors = response;
    });

    this.http.get('http://127.0.0.1:8000/api/dev/productCategories')
      .subscribe((response: {success: number, data: ProductCategory[]}) => {
        this.productCategories = response.data;
      });

    this.http.get('http://127.0.0.1:8000/api/dev/units')
      .subscribe((response: {success: number, data: Unit[]}) => {
        this.units = response.data;
      });

    this.products = this.productService.getProducts();
    this.productsByCategory = this.products.filter(item => item.product_category_id === this.selectedProductCategoryId);
    this.productService.getProductServiceListener().subscribe(response => {
      this.products = response;
      this.productsByCategory = this.products.filter(item => item.product_category_id === this.selectedProductCategoryId);

    });

    this.storage.get('purchaseContainer').subscribe((purchaseContainer: any) => {
      if (purchaseContainer){
        this.purchaseContainer = purchaseContainer;
        this.purchaseMaster = purchaseContainer.pm;
        this.purchaseDetails = purchaseContainer.pd;
        this.purchaseMasterForm.patchValue(purchaseContainer.pm);
        this.purchaseDetailsForm.patchValue(purchaseContainer.pd);
      }
    }, (error) => {});
  }

  onSelectedVendor(value){
    this.selectedLedger = value;
  }

  onProductCategorySelected(value){
    this.selectedProductCategoryId = value;
    this.productsByCategory = this.products.filter(item => item.product_category_id === this.selectedProductCategoryId);
    this.purchaseDetailsForm.patchValue({product_id: null});
  }

  onSelectedProduct(value) {
    this.selectedProduct = value;
  }

  addItem(){
    const tempPurchaseMasterObj = this.purchaseMasterForm.value;
    const tempPurchaseDetailObj = this.purchaseDetailsForm.value;
    let index = this.products.findIndex(x => x.id == tempPurchaseDetailObj.product_id);
    tempPurchaseDetailObj.product = this.products[index];

    tempPurchaseDetailObj.unit = this.units.find(x => x.id === tempPurchaseDetailObj.product.purchase_unit_id);
    tempPurchaseMasterObj.ledger = this.vendors.find(x => x.id === tempPurchaseMasterObj.ledger_id);

    this.purchaseDetails.unshift(tempPurchaseDetailObj);
    this.purchaseMaster = tempPurchaseMasterObj;

    this.purchaseContainer = {
      pm: this.purchaseMaster,
      pd: this.purchaseDetails
    };

    this.storage.set('purchaseContainer', this.purchaseContainer).subscribe(() => {});
  }

  clearPurchaseForm() {
    this.purchaseMasterForm.reset();
    this.purchaseDetailsForm.reset();
  }

  itemToEdit(purchaseDetail: PurchaseDetails) {

  }

  deleteItem(purchaseDetail: PurchaseDetails) {

  }

  savePurchase() {
    /* This way we will fetch particular fields to save */
    this.saveablePurchaseDetails = this.purchaseDetails.map(({ id, rate }) => ({ id, rate }));
  }
}
