import {Product} from './product.model';
import {Unit} from '../pages/product/product.component';

export class SaleMaster{
  id?: number;
  bill_number?: string;
  order_date?: string;
  delivery_date?: string;
  comment?: string;
}


export class SaleDetail{
  id?: number;
  sale_master_id?: number;
  product_category_id?: number;
  product_id?: number;
  sale_quantity?: number;
  rate?: number;
  product?: Product;
  unit?: Unit;
  isEditable?: boolean;
}

export class SaleResponse{
  'success': number;
  'data': {
    'bill_number': string;
    'order_date': string;
    'delivery_date': string;
    'comment': string;
    'updated_at': string,
    'created_at': string,
    'id': number
  };
  'sale_total': number;
  'error': any;
}
