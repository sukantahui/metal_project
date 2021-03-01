import {Product} from "./product.model";
import {Unit} from "../pages/product/product.component";

export class SaleDetail{
  id?: number;
  sale_master_id?: number;
  product_category_id?: number;
  product_id: number;
  sale_quantity?: number;
  rate?: number;
  product?: Product;
  unit?: Unit;
  isEditable?: boolean;
}
