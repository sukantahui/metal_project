import { Component, OnInit } from '@angular/core';
import {ProductService} from "../../services/product.service";
import {Product} from "../../models/product.model";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  products: Product[];
  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.productService.getProductServiceListener().subscribe(response=>{
      this.products=response;
    });

  }

}
