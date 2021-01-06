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
import {State} from '../vendor/vendor.component';
import Swal from 'sweetalert2';
import {PurchaseService} from '../../services/purchase.service';
import * as cloneDeep from 'lodash/cloneDeep';

export interface ExtraItem {
  id: number;
  item_name: string;
}
export interface ExtraItemDetails{
  extra_item_id: number;
  amount: number;
  item_type: number;
  item_name?: string;
}

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
  extraItemsForm: FormGroup;
  paidAmountForm: FormGroup;
  vendors: Vendor[] = [];
  productCategories: ProductCategory[] = [];
  products: Product[] = [];
  units: Unit[] = [];
  productsByCategory: Product[] = [];
  selectedLedger: Vendor = null;
  selectedProduct: Product = null;
  extraItems: ExtraItem[] = [];
  extraItemDetails: ExtraItemDetails[] = [];
  extraItemTypes = [{value: 1, name: 'Add'}, {value: -1, name: 'Less'}];
  paymentModes = [{id: 1, name: 'Cash'}, {id: 2, name: 'Cheque'}];
  paymentTransactionMaster = null;
  paymentTransactionDetails = [];

  purchaseMaster: PurchaseMaster = null;
  purchaseDetails: PurchaseDetail[] = [];

  transactionMaster: TransactionMaster = null;
  transactionDetails: TransactionDetail[] = [];
  currentPurchaseTotal = 0;
  roundedOff = 0;
  grossTotal = 0;
  // tslint:disable-next-line:max-line-length
  purchaseContainer: {tm: TransactionMaster, td: TransactionDetail[], pm: PurchaseMaster, pd: PurchaseDetail[], paymentTransactionMaster: TransactionMaster,
    paymentTransactionDetails: TransactionDetail[], currentPurchaseTotal: number, roundedOff: number, extraItems: ExtraItemDetails[]};
  defaultValues: any;
  validatorError: any = null;

  selectedProductCategoryId = 1;
  private formattedMessage: string;
  pageSize: string | number;

  faUserEdit = faUserEdit;
  faTrashAlt = faTrashAlt;
  saveablePurchaseDetails: { rate: number; id: number }[];

  // tslint:disable-next-line:max-line-length
  currentItemAmount = 0;
  // tslint:disable-next-line:max-line-length
  checked: any;
  constructor(private http: HttpClient, private vendorService: VendorService, private productService: ProductService,
              private purchaseService: PurchaseService, private storage: StorageMap) {
    const now = new Date();
    const currentSQLDate = formatDate(now, 'yyyy-MM-dd', 'en');
    this.purchaseMasterForm = new FormGroup({
      id: new FormControl(null),
      invoice_number: new FormControl(null),
      case_number: new FormControl(null),
      comment: new FormControl(null),

    });

    this.purchaseDetailsForm = new FormGroup({
      id: new FormControl(null),
      product_category_id: new FormControl(1),
      product_id: new FormControl(null),
      rate: new FormControl(null),
      purchase_quantity: new FormControl(null),
      stock_quantity: new FormControl(null),
      amount: new FormControl(null),
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
      amount: new FormControl(0),
    });
    this.extraItemsForm = new FormGroup({
      id: new FormControl(null),
      extra_item_id: new FormControl(null),
      amount: new FormControl(null),
      item_type: new FormControl(1),
    });
    this.paidAmountForm = new FormGroup({
      id: new FormControl(),
      voucher_id: new FormControl(3),
      ledger_id: new FormControl(1),
      amount: new FormControl(0)
    });

  }

  ngOnInit(): void {
    // this.purchaseMasterForm.valueChanges.subscribe(val => {
    //   console.log(val);
    // });
    this.defaultValues = {
      transactionMasterFormValue: this.transactionMasterForm.value,
      transactionDetailsFormValue: this.transactionDetailsForm.value,
      purchaseMasterFormValue: this.purchaseMasterForm.value,
      purchaseDetailsFormValue: this.purchaseDetailsForm.value,
      extraItemsFormValue: this.extraItemsForm.value
    };

    // Transaction master will be updated
    this.http.get('http://127.0.0.1:8000/api/dev/extraItems').subscribe((response: {success: number, data: ExtraItem[]}) => {
      this.extraItems = response.data;
    });


    this.transactionMasterForm.valueChanges.subscribe( val => {
      const x = val.transaction_date;
      val.transaction_date =  formatDate(x, 'yyyy-MM-dd', 'en');
      this.transactionMaster = val;
      this.paymentTransactionMaster = val;
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
      // when we are loading data from storage, purchaseContainer, changing the transactionDetailsForm to reflect the venture
      // hence transactionDetails are initialising again with amount 0 for position 0
      // we need to resolve it #problem 2
      let transactionAmount = 0;
      if (this.purchaseContainer && this.purchaseContainer.td){
        transactionAmount = this.purchaseContainer.td[0].amount;
      }


      // tslint:disable-next-line:max-line-length
      this.transactionDetails.push({id: null, transaction_master_id: null, ledger_id: 5, transaction_type_id: 1, amount: transactionAmount});
      this.transactionDetails.push(val);

      const paidAmount = this.paidAmountForm.value.amount;
      this.paymentTransactionDetails = [];
      // the reference val is generated when we select vendor ledger it is part of transactionDetailsForm
      // we also pushing this value to paymentTransactionDetails and changing the transaction type here
      // being reference it is also changing the value of transactionDetails array
      // hence i am copying the val to new object first and then pushing the value
      // this way delinking the objects
      // npm install lodash to use cloneDeep
      // const valObject = cloneDeep(val); or we can use Angular with ECMAScript6 by using the spread operator:
      this.paymentTransactionDetails.push({...val});  // copying object to new object
      this.paymentTransactionDetails[0].transaction_type_id = 1;
      this.paymentTransactionDetails[0].amount = paidAmount;
      // Getting payment Ledger current value i.e. Cash = 1 or Bank = 2
      const paymentCreditableLedger = this.paidAmountForm.get('ledger_id').value;
      // tslint:disable-next-line:max-line-length
      this.paymentTransactionDetails.push({id: null, transaction_master_id: null, ledger_id: paymentCreditableLedger, transaction_type_id: 2, amount: paidAmount});
    });

    this.purchaseMasterForm.valueChanges.subscribe(val => {
      // val.order_date =  formatDate(x, 'yyyy-MM-dd', 'en');
      // if(this.purchaseContainer.pm){
      //   this.purchaseContainer.pm.comment = val.comment;
      // }
    });
    this.purchaseDetailsForm.valueChanges.subscribe(val => {
      if (val.rate && val.purchase_quantity){
        this.currentItemAmount = val.rate * val.purchase_quantity;
      }
    });
    // this.paidAmountForm.valueChanges.subscribe(val => {
    //   if(val.amount>0){
    //     this.paymentTransactionDetails[0].amount = val.amount;
    //     this.paymentTransactionDetails[1].amount = val.amount;
    //
    //     this.purchaseContainer = {
    //       tm: this.transactionMaster,
    //       td: this.transactionDetails,
    //       pm: this.purchaseMaster,
    //       pd: this.purchaseDetails,
    //       paymentTransactionMaster: this.paymentTransactionMaster,
    //       paymentTransactionDetails: this.paymentTransactionDetails,
    //       currentPurchaseTotal: this.currentPurchaseTotal,
    //       roundedOff: this.roundedOff,
    //       extraItems: this.extraItemDetails
    //     };
    //     this.storage.set('purchaseContainer', this.purchaseContainer).subscribe(() => {});
    //   }
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
        if (!purchaseContainer.pd){
          this.purchaseDetails = [];
        }else{
          this.purchaseDetails = purchaseContainer.pd;
        }
        this.transactionMaster = purchaseContainer.tm;
        if (!purchaseContainer.td){
          this.transactionDetails = [];
        }else{
          this.transactionDetails = purchaseContainer.td;
          this.selectedLedger = this.vendors.find(x => x.id === this.transactionDetails[1].ledger_id);
        }
        if (!purchaseContainer.extraItems){
          this.extraItemDetails = [];
        }else{
          this.extraItemDetails = purchaseContainer.extraItems;
        }
        this.paymentTransactionMaster = purchaseContainer.paymentTransactionMaster;
        if (!purchaseContainer.paymentTransactionDetails){
          this.paymentTransactionDetails = [];
        }else{
          this.paymentTransactionDetails = purchaseContainer.paymentTransactionDetails;
          this.paidAmountForm.patchValue({amount: this.paymentTransactionDetails[0].amount});
        }

        this.purchaseMasterForm.setValue(purchaseContainer.pm);
        this.transactionMasterForm.setValue(purchaseContainer.tm);
        // this area has problem, need to be sorted out
        // as transactionDetailsForm is changing again it will change the transaction details again
        this.transactionDetailsForm.setValue(purchaseContainer.td[1]);

        this.currentPurchaseTotal = this.purchaseContainer.currentPurchaseTotal;
        this.roundedOff = this.purchaseContainer.roundedOff;
        this.grossTotal = this.currentPurchaseTotal + this.roundedOff;
      }
    }, (error) => {console.log('error getting purchase container'); });

    // console.log('on load purchaseContainer ', this.purchaseContainer);
  }

  onSelectedVendor(value){
    this.selectedLedger = value;
  }
  onSelectedPaymentMode(value){
    this.paymentTransactionDetails[1].ledger_id = value;
  }

  onProductCategorySelected(value){
    this.selectedProductCategoryId = value;
    this.productsByCategory = this.products.filter(item => item.product_category_id === this.selectedProductCategoryId);
    this.purchaseDetailsForm.patchValue({product_id: null});
  }

  onSelectedProduct(value) {
    this.selectedProduct = value;
  }

  // adding product details here when add button is pushed
  addItem(){
    const tempPurchaseMasterObj = this.purchaseMasterForm.value;
    const tempPurchaseDetailObj = this.purchaseDetailsForm.value;
    const index = this.products.findIndex(x => x.id === tempPurchaseDetailObj.product_id);
    tempPurchaseDetailObj.product = this.products[index];

    tempPurchaseDetailObj.unit = this.units.find(x => x.id === tempPurchaseDetailObj.product.purchase_unit_id);
    // tempPurchaseMasterObj.ledger = this.vendors.find(x => x.id === tempPurchaseMasterObj.ledger_id);

    this.purchaseDetails.unshift(tempPurchaseDetailObj);
    this.purchaseMaster = tempPurchaseMasterObj;

    const tempPurchaseTotal = this.purchaseDetails.reduce( (total, record) => {
      // @ts-ignore
      return total + (record.rate * record.purchase_quantity);
    }, 0);
    this.currentPurchaseTotal = tempPurchaseTotal;
    this.currentPurchaseTotal = parseFloat(this.currentPurchaseTotal.toFixed(2));
    const round =  Math.round(this.currentPurchaseTotal) - this.currentPurchaseTotal;
    this.roundedOff = parseFloat(round.toFixed(2));
    this.grossTotal = this.currentPurchaseTotal + this.roundedOff;
    this.transactionMaster = this.transactionMasterForm.value;

    this.transactionDetails = [];
    this.transactionDetails.push({id: null, transaction_master_id: null, ledger_id: 5, transaction_type_id: 1, amount: this.grossTotal});
    this.transactionDetails[1] = this.transactionDetailsForm.value;
    this.transactionDetails[1].amount = this.grossTotal;

    // this.transactionDetailsForm.patchValue({amount: this.grossTotal});
    // console.log(this.transactionDetailsForm.value);

    this.extraItemDetails[0] = {extra_item_id: 1, amount: this.roundedOff, item_type: 1, item_name: 'Rounded off'};

    this.purchaseContainer = {
      tm: this.transactionMaster,
      td: this.transactionDetails,
      pm: this.purchaseMaster,
      pd: this.purchaseDetails,
      paymentTransactionMaster: this.paymentTransactionMaster,
      paymentTransactionDetails: this.paymentTransactionDetails,
      currentPurchaseTotal: this.currentPurchaseTotal,
      roundedOff: this.roundedOff,
      extraItems: this.extraItemDetails
    };
    this.storage.set('purchaseContainer', this.purchaseContainer).subscribe(() => {});

  }

  clearPurchaseForm() {
    this.purchaseMasterForm.patchValue(this.defaultValues.purchaseMasterFormValue);
    this.purchaseDetailsForm.patchValue(this.defaultValues.purchaseDetailsFormValue);
    this.transactionMasterForm.patchValue(this.defaultValues.transactionMasterFormValue);
    this.transactionDetailsForm.patchValue(this.defaultValues.transactionDetailsFormValue);
    this.extraItemsForm.patchValue(this.defaultValues.extraItemsFormValue);

    this.purchaseMaster = null;
    this.purchaseDetails = [];
    this.transactionMaster = null;
    this.transactionDetails = [];
    this.extraItemDetails = [];
    this.paymentTransactionMaster = null;
    this.paymentTransactionDetails = [];
    this.selectedLedger = null;
    this.currentPurchaseTotal = 0;
    this.roundedOff = 0;
    this.grossTotal = 0;
    this.storage.delete('purchaseContainer').subscribe(() => {
      console.log('purchaseMaster storage cleared');
      this.purchaseContainer = null;
    });
    this.currentItemAmount = 0;

  }

  itemToEdit(item) {

  }

  deleteItem(item) {

  }

  onSubmit() {

    /* This way we will fetch particular fields to save */
    const tempPurchaseDetails = this.purchaseContainer.pd.map(
      ({id , product_id , rate
      , purchase_quantity , stock_quantity}) => ({id, product_id, rate, purchase_quantity, stock_quantity})
    );

    const masterData = {
      transaction_master: this.purchaseContainer.tm,
      transaction_details: this.purchaseContainer.td,
      purchase_master: this.purchaseContainer.pm,
      purchase_details: tempPurchaseDetails,
      extra_items: this.purchaseContainer.extraItems,
      payment_transaction_master: this.purchaseContainer.paymentTransactionMaster,
      payment_transaction_details: this.purchaseContainer.paymentTransactionDetails
    };
    this.purchaseService.savePurchase(masterData).subscribe(response => {
      if (response.success === 1){
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Purchase successful',
          showConfirmButton: false,
          timer: 1000
        });
        this.clearPurchaseForm();
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

  handleTransactionMasterDateChange($event: MatDatepickerInputEvent<unknown>) {
    let val = this.transactionMasterForm.value.transaction_date;
    val = formatDate(val, 'yyyy-MM-dd', 'en');
    this.transactionMasterForm.patchValue({transaction_date: val});
  }

  addExtraItemForPurchase() {
      const extraItem = this.extraItemsForm.value;
      const extraItemObj =  this.extraItems.find(x => x.id === extraItem.extra_item_id);
      extraItem.item_name = extraItemObj.item_name;
      this.extraItemDetails.push(extraItem);
      this.grossTotal += extraItem.amount * extraItem.item_type;
      this.purchaseContainer.extraItems = this.extraItemDetails;
      this.storage.set('purchaseContainer', this.purchaseContainer).subscribe(() => {});
  }

  setStockQuantity() {
    this.purchaseDetailsForm.patchValue({stock_quantity: this.purchaseDetailsForm.value.purchase_quantity});
  }
}
