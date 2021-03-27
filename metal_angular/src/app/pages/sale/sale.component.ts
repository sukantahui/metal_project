import {
  AfterViewInit,
  Component,
  DoCheck,
  ElementRef,
  IterableDiffer,
  IterableDiffers,
  KeyValueDiffers,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {formatDate} from '@angular/common';
import {Customer} from '../../models/customer.model';
import {CustomerService} from '../../services/customer.service';
import {ProductCategory, Unit} from '../product/product.component';
import {HttpClient} from '@angular/common/http';
import {Product} from '../../models/product.model';
import {ProductService} from '../../services/product.service';
import {StorageMap} from '@ngx-pwa/local-storage';
import {SaleDetail, SaleItem, SaleMaster} from '../../models/sale.model';
import {NgxMousetrapService} from 'ngx-mousetrap';
import {Subscription} from 'rxjs';
import {trigger, state, style, animate, transition, keyframes} from '@angular/animations';
import {SaleAnimation} from './animation.sale';
import { faUserEdit, faTrashAlt, faPencilAlt} from '@fortawesome/free-solid-svg-icons';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import {PurchaseDetail, PurchaseMaster} from '../../models/purchase.model';
import {TransactionDetail, TransactionMaster} from '../../models/transaction.model';
import {ExtraItem, ExtraItemDetails} from '../purchase/purchase.component';
import {SaleService} from '../../services/sale.service';



@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.scss'],
  animations: [SaleAnimation]
})
export class SaleComponent implements OnInit, OnDestroy, DoCheck {

  faUserEdit = faUserEdit;
  faTrashAlt = faTrashAlt;
  faPencilAlt = faPencilAlt;
  faCheck = faCheck;

  isDeveloperAreaShowable = true;

  transactionMasterForm: FormGroup;
  transactionDetailsForm: FormGroup;
  saleMasterForm: FormGroup;
  saleDetailsForm: FormGroup;
  extraItemsForm: FormGroup;

  customers: Customer[] = [];
  selectedLedger: Customer;
  selectedProductCategoryId = 1;
  productsByCategory: Product[] = [];
  productCategories: ProductCategory[] = [];
  products: Product[] = [];
  selectedProduct: Product;
  currentItemAmount = 0;
  units: Unit[];

  clickedAt = null;
  private subscription: Subscription;

  transactionMaster: TransactionMaster = null;
  transactionDetails: TransactionDetail[] = [];
  saleMaster: SaleMaster;
  saleDetails: SaleDetail[] = [];
  extraItemDetails: ExtraItemDetails[] = [];
  extraItems: ExtraItem[] = [];

  extraItemTypes = [{value: 1, name: 'Add'}, {value: -1, name: 'Less'}];

  editableSaleDetailItemIndex = -1;

  isGreen = 'true';
  arc = 'false';
  pageSize = 10;
  p = 1;
  isShowAllSalesList = false;
  currentSaleTotal = 0;
  roundedOff = 0;
  grossTotal = 0;
  saleContainer: {
    tm?: TransactionMaster,
    td?: TransactionDetail[],
    sm?: SaleMaster,
    sd?: SaleDetail[],
    currentSaleTotal?: number,
    roundedOff?: number,
    grossTotal?: number,
    extraItems?: ExtraItemDetails[]
  };
  private differSaleDetail: IterableDiffer<SaleDetail>;
  private differExtraItemDetail: IterableDiffer<ExtraItemDetails>;
  testDiffer: any;
  isExtraItemAdded = false;
  private extraItemTotal = 0;
  // tslint:disable-next-line:max-line-length
  saleMasterData: { transaction_master: TransactionMaster; sale_master: SaleMaster; sale_details: { rate: number; product_id: number; id: number; sale_quantity: number }[]; sale_extras: ExtraItemDetails[]; transaction_details: TransactionDetail[] };
  saleList: SaleItem[] = [];
  validatorError: any = null;
  private pattern1: string;
  private regex: RegExp = new RegExp(/^\d*\.?\d{0,2}$/g);


  constructor(private customerService: CustomerService
              // tslint:disable-next-line:align
              , private http: HttpClient
              // tslint:disable-next-line:align
              , private productService: ProductService
              // tslint:disable-next-line:align
              , private storage: StorageMap
              // tslint:disable-next-line:align
              , private service: NgxMousetrapService
              // tslint:disable-next-line:align
              , private iterableDiff: IterableDiffers
              // tslint:disable-next-line:align
              , private saleService: SaleService) {
    this.differSaleDetail = this.iterableDiff.find(this.saleDetails).create();
    this.differExtraItemDetail = this.iterableDiff.find(this.extraItemDetails).create();

    const now = new Date();
    const currentSQLDate = formatDate(now, 'yyyy-MM-dd', 'en');

    // this will fill up local customers variable from customerService
    this.customers = this.customerService.getCustomers();
    this.customerService.getCustomerServiceListener().subscribe(response => {
      this.customers = response;
    });
    // getting products
    this.products = this.productService.getProducts();
    this.productsByCategory = this.products.filter(item => item.product_category_id === this.selectedProductCategoryId);
    this.productService.getProductServiceListener().subscribe(response => {
      this.products = response;
      this.productsByCategory = this.products.filter(item => item.product_category_id === this.selectedProductCategoryId);

    });

    this.saleMasterForm = new FormGroup({
      id: new FormControl(null),
      bill_number: new FormControl(null),
      comment: new FormControl(null, [Validators.maxLength(15)]),
      order_date: new FormControl(currentSQLDate),
      delivery_date: new FormControl(currentSQLDate),
    });

    this.saleDetailsForm = new FormGroup({
      id: new FormControl(null),
      product_category_id: new FormControl(1),
      product_id: new FormControl(null),
      rate: new FormControl(null),
      sale_quantity: new FormControl(null, [Validators.max(50), Validators.pattern(this.regex)]),
      isEditable: new FormControl(false)
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
      transaction_type_id: new FormControl(1),
      amount: new FormControl(0),
    });
    this.extraItemsForm = new FormGroup({
      id: new FormControl(null),
      extra_item_id: new FormControl(null),
      amount: new FormControl(null),
      item_type: new FormControl(1),
    });
  }
  updateItem(){
    // here we are going to update the current item
    const tempSaleDetailsObj = {...this.saleDetailsForm.value};
    const index = this.products.findIndex(x => x.id === tempSaleDetailsObj.product_id);
    tempSaleDetailsObj.product = this.products[index];

    tempSaleDetailsObj.unit = this.units.find(x => x.id === tempSaleDetailsObj.product.purchase_unit_id);

    this.saleDetails[this.editableSaleDetailItemIndex] = tempSaleDetailsObj;


    this.saleDetailsForm.patchValue({
      product_category_id: null,
      product_id: null,
      rate: null,
      sale_quantity: null
    });
    this.currentItemAmount = null;
    this.selectedProduct = null;
    this.editableSaleDetailItemIndex = -1;
    this.selectedProduct = null;
    // adding data to local storage
    this.saleContainer = {
      tm: this.transactionMaster,
      td: this.transactionDetails,
      sd: this.saleDetails
    };
    this.storage.set('saleContainer', this.saleContainer).subscribe(() => {

    });
  }

  ngOnInit(): void {
    this.http.get('http://127.0.0.1:8000/api/dev/extraItems').subscribe((response: {success: number, data: ExtraItem[]}) => {
      this.extraItems = response.data;
    });
    // adding saleMasterForm change value to saleMaster
    this.saleMasterForm.valueChanges.subscribe(val => {
      this.saleMaster = val;
      this.saleContainer.sm = this.saleMaster;
      this.storage.set('saleContainer', this.saleContainer).subscribe(() => {});
    });

    this.saleList = this.saleService.getSaleList();
    this.saleService.getSaleListListener().subscribe(response => {
      this.saleList = response;
    });

    // The following code is used to fetch data from local storage
    // tslint:disable-next-line:max-line-length
    this.storage.get('saleContainer').subscribe((tempSaleContainer: { tm?: TransactionMaster, td?: TransactionDetail[], sm?: SaleMaster, sd?: SaleDetail[]}) => {
      if (tempSaleContainer){
        this.saleContainer = tempSaleContainer;
        // updating transaction master from storage
        if (this.saleContainer.tm){
          this.transactionMaster = this.saleContainer.tm;
          this.transactionMasterForm.patchValue(this.transactionMaster);
        }else{
          this.transactionMaster = null;
        }

        // updating transaction detail
        if (this.saleContainer.td){
          this.transactionDetails = this.saleContainer.td;
          this.transactionDetailsForm.patchValue({ledger_id: this.transactionDetails[0].ledger_id});
        }else{
          this.transactionDetails = [];
        }

        // updating saleMaster
        if (this.saleContainer.sm){
          this.saleMaster = this.saleContainer.sm;
          this.saleMasterForm.patchValue(this.saleMaster);
        }else{
          this.saleMaster = null;
        }

        // updating saleDetails from storage
        if (this.saleContainer.sd){
          this.saleDetails = this.saleContainer.sd;
          // const tempSaleTotal = this.saleDetails.reduce( (total, record) => {
          //   // @ts-ignore
          //   return total + (record.rate * record.sale_quantity);
          // }, 0);
          //
          // this.currentSaleTotal = tempSaleTotal;
          // console.log('current sale total', this.currentSaleTotal);
        }else{
          this.saleDetails = [];
          this.currentSaleTotal = 0;
        }

        // updating extraItemDetails
        if (this.saleContainer.extraItems){
          this.extraItemDetails = this.saleContainer.extraItems;
        }else{
          this.extraItemDetails = [];
        }

      }else{
        // storage is empty for saleContainer
        this.saleContainer = null;
      }

    });

    this.transactionMasterForm.valueChanges.subscribe( val => {
      const x = val.transaction_date;
      val.transaction_date =  formatDate(x, 'yyyy-MM-dd', 'en');
      this.transactionMaster = val;
    });

    // this will fill up local customers variable from customerService
    this.customers = this.customerService.getCustomers();
    this.customerService.getCustomerServiceListener().subscribe(response => {
      this.customers = response;
    });

    // getting product categories
    this.http.get('http://127.0.0.1:8000/api/dev/productCategories')
      .subscribe((response: {success: number, data: ProductCategory[]}) => {
        this.productCategories = response.data;
      });

    this.saleDetailsForm.valueChanges.subscribe(val => {
      if (val.rate && val.sale_quantity){
        const ans = val.rate * val.sale_quantity;
        this.currentItemAmount = +ans.toFixed(2);
        // @ts-ignore
      }
    });

    // getting units
    this.http.get('http://127.0.0.1:8000/api/dev/units')
      .subscribe((response: {success: number, data: Unit[]}) => {
        this.units = response.data;
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
      const transactionAmount = 0;
      // if (this.saleContainer && this.saleContainer.td){
      //   transactionAmount = this.saleContainer.td[0].amount;
      // }
      // tslint:disable-next-line:max-line-length
      this.transactionDetails.push(val);
      // tslint:disable-next-line:max-line-length
      this.transactionDetails.push({id: null, transaction_master_id: null, ledger_id: 6, transaction_type_id: 2, amount: transactionAmount});
    });
  }




  onSelectedCustomer(value) {
    this.selectedLedger = value;
  }
  onProductCategorySelected(value){
    this.selectedProductCategoryId = value;
    this.productsByCategory = this.products.filter(item => item.product_category_id === this.selectedProductCategoryId);
  }
  onSelectedProduct(value) {
    this.selectedProduct = value;
    console.log(this.selectedProduct);
  }

  addItem() {
    // copying object
    const tempSaleDetailsObj = {...this.saleDetailsForm.value};
    const index = this.products.findIndex(x => x.id === tempSaleDetailsObj.product_id);
    tempSaleDetailsObj.product = this.products[index];

    tempSaleDetailsObj.unit = this.units.find(x => x.id === tempSaleDetailsObj.product.purchase_unit_id);
    this.saleDetails.unshift(tempSaleDetailsObj);

    this.transactionMaster = this.transactionMasterForm.value;
    this.saleMaster = this.saleMasterForm.value;


    this.saleDetailsForm.patchValue({
      product_id: null,
      rate: null,
      sale_quantity: null
    });
    this.currentItemAmount = null;
    this.selectedProduct = null;

      // adding data to local storage
    this.saleContainer = {
      tm: this.transactionMaster,
      td: this.transactionDetails,
      sm: this.saleMaster,
      sd: this.saleDetails
    };
    this.storage.set('saleContainer', this.saleContainer).subscribe(() => {

    });


    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Product adding successful',
      showConfirmButton: false,
      timer: 1000
    });

  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  onClick() {
    this.clickedAt = new Date();
  }

  onClick2() {
    console.log('testing');
  }
  toggleIsCorrect() {
    this.isGreen = this.isGreen === 'true' ? 'false' : 'true'; // change in data-bound value
  }
  toggleBounce(){
    this.arc = this.arc === 'false' ? 'true' : 'false';
  }

  onToggle(event) {
    console.log(event);
    if (event.checked) {
      this.isShowAllSalesList = true;
    }else{
      this.isShowAllSalesList = false;
    }
  }

  populateSaleDetailsForm(saleDetails: SaleDetail, index) {
    this.saleDetailsForm.patchValue({
      product_category_id: saleDetails.product_category_id,
      product_id: saleDetails.product_id,
      rate: saleDetails.rate,
      sale_quantity: saleDetails.sale_quantity
    });
    this.selectedProduct = saleDetails.product;
    // storing the current editable item to variable
    this.editableSaleDetailItemIndex = index;
  }


  deleteSaleDetailItem(saleDetail) {
    const productName = saleDetail.product.product_name;
    Swal.fire({
      title: 'Confirmation',
      text: 'Are you sure to delete ' + productName,
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes,Delete It!'
    }).then((result) => {
      if (result.isConfirmed) {
        const productId = saleDetail.product.id;
        const itemIndex = this.saleDetails.findIndex(x => x.product_id === productId);
        this.saleDetails.splice(itemIndex, 1);
      }
    });
  }

  ngDoCheck(): void {
    const changeSaleDetail = this.differSaleDetail.diff(this.saleDetails);

    if (changeSaleDetail) {
      const tempSaleTotal = this.saleDetails.reduce( (total, record) => {
        // @ts-ignore
        return total + (record.rate * record.sale_quantity);
      }, 0);

      this.currentSaleTotal = parseFloat(tempSaleTotal.toFixed(2));
      const round = Math.round(this.currentSaleTotal) - this.currentSaleTotal;
      this.roundedOff = parseFloat(round.toFixed(2));
      this.grossTotal = this.currentSaleTotal + this.roundedOff;
      this.extraItemDetails[0] = {extra_item_id: 1, amount: this.roundedOff, item_type: 1, item_name: 'Rounded off'};
      this.transactionDetails[0].amount = this.grossTotal;
      this.transactionDetails[1].amount = this.grossTotal;
      this.saleContainer.td = this.transactionDetails;
      this.saleContainer.sd = this.saleDetails;

      // changes.forEachChangedItem(r => console.log('changed ', r.currentValue));
      changeSaleDetail.forEachIdentityChange(r => console.log('Identity Updatd ' ));
      changeSaleDetail.forEachAddedItem(r => console.log('added ', r ));
      changeSaleDetail.forEachRemovedItem(r => console.log('removed ' ));
    } else {

    }

    const changeExtraItem = this.differExtraItemDetail.diff(this.extraItemDetails);
    if (changeExtraItem) {
      this.saleContainer.extraItems = this.extraItemDetails;
      const tempTotal = this.extraItemDetails.reduce( (total, record) => {
        // @ts-ignore
        return total + (record.amount * record.item_type);
      }, 0);
      this.extraItemTotal = tempTotal;
      this.grossTotal = this.currentSaleTotal + this.extraItemTotal;
      this.transactionDetails[0].amount = this.grossTotal;
      this.transactionDetails[1].amount = this.grossTotal;
      this.saleContainer.td = this.transactionDetails;
      changeExtraItem.forEachIdentityChange(r => console.log('Identity Updatd ' ));
      changeExtraItem.forEachAddedItem(r => console.log('added ', r.item ));
      changeExtraItem.forEachRemovedItem(r => console.log('removed ' ));
    } else {

    }

  }

  directUpdateSaleDetailRate(saleDetail: SaleDetail, rateHtmlInputElement: HTMLInputElement, currentIndex: number) {
     const x = {...saleDetail};
     x.isEditable = false;
     x.rate = parseFloat(rateHtmlInputElement.value);
     console.log(saleDetail, currentIndex);
     this.saleDetails[currentIndex] = x;
  }

  directUpdateSaleDetailQty(saleDetail: SaleDetail, qtyHtmlInputElement: HTMLInputElement, currentIndex: number) {
    const x = {...saleDetail};
    x.isEditable = false;
    x.sale_quantity = parseFloat(qtyHtmlInputElement.value);
    console.log(saleDetail, currentIndex);
    this.saleDetails[currentIndex] = x;
  }


  addExtraItemForSale() {
    const extraItem = this.extraItemsForm.value;
    const extraItemObj =  this.extraItems.find(x => x.id === extraItem.extra_item_id);
    extraItem.item_name = extraItemObj.item_name;
    this.extraItemDetails.push(extraItem);

    this.storage.set('saleContainer', this.saleContainer).subscribe(() => {});
    this.extraItemsForm.patchValue({
      extra_item_id: null,
      amount: null,
      item_type: null,
      item_name: null,
    });
  }

  clearAll() {
    this.storage.delete('saleContainer').subscribe(() => {
      console.log('SaleContainer storage cleared');
      this.saleContainer = null;
    });
  }

  deleteExtraItem(extraItem: any, indexOfElement: number) {
    Swal.fire({
      title: 'Confirmation',
      text: 'Are you sure to delete ' + extraItem.item_name,
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes,Delete It!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.extraItemDetails.splice(indexOfElement, 1);
        this.saleContainer.extraItems = this.extraItemDetails;
        this.storage.set('saleContainer', this.saleContainer).subscribe(() => {});
      }
    });
  }

  saveSale() {
    const tempSaleDetails = this.saleContainer.sd.map(
      ({id , product_id , rate, sale_quantity }) => ({id, product_id, rate, sale_quantity})
    );
    const masterData = {
      transaction_master: this.saleContainer.tm,
      transaction_details: this.saleContainer.td,
      sale_master: this.saleContainer.sm,
      sale_details: tempSaleDetails,
      sale_extras: this.saleContainer.extraItems
    };
    this.saleMasterData = masterData;
    this.saleService.saveSale(masterData).subscribe(response => {
      if (response.success === 1){
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Save successful',
          showConfirmButton: false,
          timer: 1000
        });
      }else{
        console.log(response.error);
        this.validatorError = response.error;
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Validation error',
          showConfirmButton: false,
          timer: 3000
        }).then(r => {});
      }
    });
  }
}
