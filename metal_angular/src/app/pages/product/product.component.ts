import { Component, OnInit } from '@angular/core';
import {ProductService} from '../../services/product.service';
import {Product} from '../../models/product.model';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import Swal from 'sweetalert2';
import { faFacebook} from '@fortawesome/free-brands-svg-icons';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { faTimes} from '@fortawesome/free-solid-svg-icons';

export interface Unit {
  id: number;
  unit_name: string;
  formal_name: string;
}

export interface ProductCategory {
  id: number;
  category_name: string;
}
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  faFB = faFacebook;
  faTimes = faTimes;
  faCheck = faCheck;
  products: Product[];
  productForm: FormGroup;
  productCategories: ProductCategory[] = [];
  units: Unit[] = [];
  isProductUpdateAble = false;
  validatorError: any = null;
  isLoading = false;
  page: number;
  pageSize = 10;
  p = 1;
  currentPage = 1;
  searchTerm: any;
  cost = 100;
  constructor(private productService: ProductService, private http: HttpClient) {

    this.productForm = new FormGroup({
      id: new FormControl(null),
      product_name: new FormControl(null, [Validators.required, Validators.maxLength(100), Validators.minLength(4)]),
      description: new FormControl(null, [Validators.required, Validators.maxLength(50), Validators.minLength(5)]),
      product_category_id: new FormControl(1, [Validators.required]),
      purchase_unit_id: new FormControl(1),
      sale_unit_id: new FormControl(1),
      gst_rate: new FormControl(12),
      hsn_code: new FormControl(12),
      opening_balance: new FormControl(0, [Validators.required, Validators.pattern('^[0-9]*$')]),
    });
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.http.get('http://127.0.0.1:8000/api/dev/productCategories')
      .subscribe((response: {success: number, data: ProductCategory[]}) => {
      this.productCategories = response.data;
    });

    this.http.get('http://127.0.0.1:8000/api/dev/units')
      .subscribe((response: {success: number, data: Unit[]}) => {
        this.units = response.data;
      });

    this.productService.getProductServiceListener().subscribe(response => {
      this.products = response;
      this.isLoading = false;
    });

    this.products = this.productService.getProducts();

  }

  onSubmit() {
    this.validatorError = null;
    Swal.fire({
      title: 'Confirmation',
      text: 'Do you sure to add this product',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Create It!'
    }).then((result) => {
        if (result.isConfirmed){
          this.productService.saveProduct(this.productForm.value)
            .subscribe(response  => {
              if (response.success === 1){
                Swal.fire({
                  position: 'top-end',
                  icon: 'success',
                  title: 'Product saved',
                  showConfirmButton: false,
                  timer: 1000
                });
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

            }, (error) => {
              // when error occured
              console.log(error);
            });
        }
    });

  }

  updateProduct() {
    this.validatorError = null;
    this.productService.updateProduct(this.productForm.value).subscribe((response) => {
      if (response.success){
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Product updated',
          showConfirmButton: false,
          timer: 1000
        });
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

    },(error) => {
      console.log(error);
    });
  }

  clearProductForm() {
    this.productForm.reset();
    this.productForm.patchValue({purchase_unit_id: 1, sale_unit_id: 1, gst_rate: 12, hsn_code: 12});
    this.validatorError = null;
    this.isProductUpdateAble = false;
  }

  editProduct(product) {
    this.productForm.patchValue(product);
    this.isProductUpdateAble = true;
  }

  deleteProduct(productId) {
    Swal.fire({
      title: 'Confirmation',
      text: 'Are you sure to delete this product',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Create It!'
    }).then((result) => {
      if (result.isConfirmed){
        this.productService.deleteProduct(productId)
          .subscribe(response  => {
            if (response.success){
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Product deleted',
                showConfirmButton: false,
                timer: 1000
              });
            }

          }, (error) => {
            // when error occured
            console.log(error);
          });
      }
    });
  }

  saveCost(value, index){

    const z = this.products[index];
    const x = Object.assign({}, z);
    x.opening_balance = value ;

    Swal.fire({
      title: 'Confirmation',
      text: 'Do you want to update opening stock',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Update It!',
      allowEnterKey: false
    }).then(result => {
      if (result.isConfirmed){
        this.productService.updateProduct(x).subscribe((response) => {
          if (response.success){
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Opening Stock updated',
              showConfirmButton: false,
              timer: 1000
            });
          }else{
            this.validatorError = response.error;
            console.log(response.error);
            Swal.fire({
              position: 'top-end',
              icon: 'error',
              title: 'Validation error',
              showConfirmButton: false,
              timer: 3000
            });
          }

        }, (error) => {

        });
      }
    });


  }
}
