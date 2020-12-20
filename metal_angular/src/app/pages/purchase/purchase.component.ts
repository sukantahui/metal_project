import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Vendor} from '../../models/vendor.model';
import {VendorService} from '../../services/vendor.service';
import {ProductCategory, Unit} from '../product/product.component';
import {HttpClient} from '@angular/common/http';
import {ProductService} from '../../services/product.service';
import {Product} from '../../models/product.model';
import {PurchaseDetail, PurchaseMaster} from '../../models/purchase.model';
import {formatDate} from '@angular/common';
import { faUserEdit, faTrashAlt} from '@fortawesome/free-solid-svg-icons';
import {StorageMap} from '@ngx-pwa/local-storage';
import {TransactionDetail, TransactionMaster} from '../../models/transaction.model';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.scss']
})
export class PurchaseComponent implements OnInit {
  p: number;
  purchaseMasterForm: FormGroup;
  purchaseDetailsForm: FormGroup;
  transactionMasterForm: FormGroup;
  transactionDetailsForm: FormGroup;
  vendors: Vendor[] = [];
  productCategories: ProductCategory[] = [];
  products: Product[] = [];
  units: Unit[] = [];
  productsByCategory: Product[] = [];
  selectedLedger: Vendor = null;
  selectedProduct: Product = null;

  purchaseMaster: PurchaseMaster = null;
  purchaseDetails: PurchaseDetail[] = [];

  transactionMaster: TransactionMaster = null;
  transactionDetails: TransactionDetail[] = [];

  purchaseContainer: {tm: TransactionMaster, td: TransactionDetail[], pm: PurchaseMaster, pd: PurchaseDetail[]};

  selectedProductCategoryId = 1;
  private formattedMessage: string;
  pageSize: string | number;

  faUserEdit = faUserEdit;
  faTrashAlt = faTrashAlt;
  saveablePurchaseDetails: { rate: number; id: number }[];

  // tslint:disable-next-line:max-line-length
  currentItemAmount: number;
  // tslint:disable-next-line:max-line-length
  constructor(private http: HttpClient, private vendorService: VendorService, private productService: ProductService, private storage: StorageMap) {
    const now = new Date();
    const currentSQLDate = formatDate(now, 'yyyy-MM-dd', 'en');
    this.purchaseMasterForm = new FormGroup({
      id: new FormControl(null),
      invoice_number: new FormControl(null),
      reference_number: new FormControl(null),
      challan_number: new FormControl(null),
      order_number: new FormControl(null),
      order_date: new FormControl(currentSQLDate),
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
    const userData: {id: number, personName: string, _authKey: string, personTypeId: number} = JSON.parse(localStorage.getItem('user'));
    this.transactionMasterForm = new FormGroup({
      id: new FormControl(null),
      transaction_number: new FormControl(null),
      user_id: new FormControl(userData.id),
      transaction_date: new FormControl(currentSQLDate),
    });

    this.transactionDetailsForm = new FormGroup({
      id: new FormControl(null),
      transaction_master_id: new FormControl(null),
      ledger_id: new FormControl(null),
      transaction_type_id: new FormControl(2),
      amount: new FormControl(null),
    });

  }

  ngOnInit(): void {
    // this.purchaseMasterForm.valueChanges.subscribe(val => {
    //   console.log(val);
    // });

    // Transaction master will be updated

    this.transactionMasterForm.valueChanges.subscribe( val => {
      const x = val.transaction_date;
      val.transaction_date =  formatDate(x, 'yyyy-MM-dd', 'en');
      this.transactionMaster = val;
    });

    /* Transaction detail will be updated if vendor is selected */
    this.transactionDetailsForm.valueChanges.subscribe(val => {
      /* first it will erase all previous data, then it will first push the purchase ledger, its id is 5 and it is  permanent */
      /* in step2 i am pushing the vendor ledger */
      /*
      * In purchase Journal is:-
      * Purchase account Dr.
      * Vendor/Cash/Bank A/C Cr.
      * Amount to be adjusted latter
      */
      this.transactionDetails = [];
      this.transactionDetails.push({id: null, transaction_master_id: null, ledger_id: 5, transaction_type_id: 1, amount: 0});
      this.transactionDetails.push(val);
    });

    this.purchaseMasterForm.valueChanges.subscribe(val => {
      const x = val.order_date;
      val.order_date =  formatDate(x, 'yyyy-MM-dd', 'en');
      this.purchaseMaster = val;
    });
    this.purchaseDetailsForm.valueChanges.subscribe(val => {
      this.currentItemAmount = val.rate * val.purchase_quantity;
    });




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
        this.transactionMaster = purchaseContainer.tm;
        this.transactionDetails = purchaseContainer.td;
        this.transactionMasterForm.patchValue(purchaseContainer.tm);
        this.transactionDetailsForm.patchValue(purchaseContainer.td[1]);
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

    const index = this.products.findIndex(x => x.id === tempPurchaseDetailObj.product_id);
    tempPurchaseDetailObj.product = this.products[index];

    tempPurchaseDetailObj.unit = this.units.find(x => x.id === tempPurchaseDetailObj.product.purchase_unit_id);
    tempPurchaseMasterObj.ledger = this.vendors.find(x => x.id === tempPurchaseMasterObj.ledger_id);

    this.purchaseDetails.unshift(tempPurchaseDetailObj);
    this.purchaseMaster = tempPurchaseMasterObj;

    this.purchaseContainer = {
      tm: this.transactionMaster,
      td: this.transactionDetails,
      pm: this.purchaseMaster,
      pd: this.purchaseDetails,
    };

    this.storage.set('purchaseContainer', this.purchaseContainer).subscribe(() => {});
  }

  clearPurchaseForm() {
    this.purchaseMasterForm.reset();
    this.purchaseDetailsForm.reset();
  }

  itemToEdit(item) {

  }

  deleteItem(item) {

  }

  savePurchase() {
    /* This way we will fetch particular fields to save */
    this.saveablePurchaseDetails = this.purchaseDetails.map(({ id, rate }) => ({ id, rate }));
  }

  handleTransactionMasterDateChange($event: MatDatepickerInputEvent<unknown>) {
    let val = this.transactionMasterForm.value.transaction_date;
    val = formatDate(val, 'yyyy-MM-dd', 'en');
    this.transactionMasterForm.patchValue({transaction_date: val});
  }
}
