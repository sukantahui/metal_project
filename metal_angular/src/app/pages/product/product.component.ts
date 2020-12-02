import { Component, OnInit } from '@angular/core';
import {ProductService} from '../../services/product.service';
import {Product} from '../../models/product.model';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import Swal from 'sweetalert2';
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
  products: Product[];
  productForm: FormGroup;
  productCategories: ProductCategory[] = [];
  units: Unit[] = [];
  isProductUpdateAble: any;

  constructor(private productService: ProductService, private http: HttpClient) {

    this.productForm = new FormGroup({
      id: new FormControl(null),
      product_name: new FormControl(null,[Validators.required]),
      description: new FormControl(null),
      product_category_id: new FormControl(1,[Validators.required]),
      purchase_unit_id: new FormControl(1),
      sale_unit_id: new FormControl(1),
      gst_rate: new FormControl(12),
      hsn_code: new FormControl(12),
    });
  }

  ngOnInit(): void {
    this.http.get('http://127.0.0.1:8000/api/dev/productCategories')
      .subscribe((response: {success: number, data: ProductCategory[]})=>{
      this.productCategories = response.data;
    });

    this.http.get('http://127.0.0.1:8000/api/dev/units')
      .subscribe((response: {success: number, data: Unit[]}) =>{
        this.units = response.data;
      });

    this.productService.getProductServiceListener().subscribe(response =>{
      this.products = response;
    });

  }

  onSubmit() {
    // Swal.fire({
    //   title: 'Confirmation',
    //   text: 'Do you sure to add this product',
    //   icon: 'info',
    //   showCancelButton: true,
    //   confirmButtonColor: '#3085d6',
    //   cancelButtonColor: '#d33',
    //   confirmButtonText: 'Yes, Create It!'
    // }).then((result) => {
    //     console.log(result);
    // });
    this.productService.saveProduct(this.productForm.value)
      .subscribe(response  => {
      console.log(response.data);
    }, (error) => {
        // when error occured
        console.log(error);
    });
  }

  updateProduct() {

  }

  clearProductForm() {
    this.productForm.reset();
    this.productForm.patchValue({purchase_unit_id: 1, sale_unit_id:1, gst_rate:12, hsn_code:12});
  }
}
