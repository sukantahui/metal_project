import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {formatDate} from '@angular/common';
import {Customer} from '../../models/customer.model';
import {CustomerService} from '../../services/customer.service';
import {ProductCategory, Unit} from '../product/product.component';
import {HttpClient} from '@angular/common/http';
import {Product} from '../../models/product.model';
import {ProductService} from '../../services/product.service';
import {StorageMap} from '@ngx-pwa/local-storage';
import {SaleDetail} from '../../models/sale.model';
import {NgxMousetrapService} from 'ngx-mousetrap';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.scss']
})
export class SaleComponent implements OnInit, OnDestroy {
  isDeveloperAreaShowable = true;
  saleMasterForm: FormGroup;
  saleDetailsForm: FormGroup;
  transactionMasterForm: FormGroup;
  transactionDetailsForm: FormGroup;
  customers: Customer[] = [];
  selectedLedger: Customer;
  selectedProductCategoryId = 1;
  productsByCategory: Product[] = [];
  productCategories: ProductCategory[] = [];
  products: Product[] = [];
  selectedProduct: Product;
  currentItemAmount = 0;
  units: Unit[];
  saleDetails: SaleDetail[] = [];

  clickedAt = null;
  keypressed: string[] = [];
  keysBound = '? | esc | up up down down | command+shift+k | ctrl+s | command+s | alt+r | h e l l o';
  private subscription: Subscription;
  @ViewChild('demoArea', { read: ElementRef, static: true })
  demoArea: ElementRef;


  constructor(private customerService: CustomerService
              // tslint:disable-next-line:align
              , private http: HttpClient
              // tslint:disable-next-line:align
              , private productService: ProductService
              // tslint:disable-next-line:align
              , private storage: StorageMap
              // tslint:disable-next-line:align
              , private service: NgxMousetrapService) {
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
      comment: new FormControl(null),
    });

    this.saleDetailsForm = new FormGroup({
      id: new FormControl(null),
      product_category_id: new FormControl(1),
      product_id: new FormControl(null),
      rate: new FormControl(null),
      sale_quantity: new FormControl(null)
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
    this.subscription = this.service.register(this.keysBound, this.demoArea.nativeElement).subscribe(evt => {
      this.keypressed.push(`Detected ${evt.key}`);
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
  }

  addItem() {
    // copying object
    const tempSaleDetailsObj = {...this.saleDetailsForm.value};
    const index = this.products.findIndex(x => x.id === tempSaleDetailsObj.product_id);
    tempSaleDetailsObj.product = this.products[index];

    tempSaleDetailsObj.unit = this.units.find(x => x.id === tempSaleDetailsObj.product.purchase_unit_id);
    this.saleDetails.unshift(tempSaleDetailsObj);
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
}
