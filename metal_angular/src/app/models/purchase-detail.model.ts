import {Product} from './product.model';
import {Unit} from '../pages/product/product.component';


export class PurchaseDetail{
  id?: number;
  purchase_master_id?: number;
  product_id: number;
  purchase_quantity?: number;
  stock_quantity?: number
  rate?: number;
  product: Product;
  unit: Unit
}
