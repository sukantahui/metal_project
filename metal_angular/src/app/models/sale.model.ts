import {Product} from './product.model';
import {Unit} from '../pages/product/product.component';

export class SaleMaster{
  id?: number;
  bill_number?: string;
  order_date?: string;
  delivery_date?: string;
  comment?: string;
  customer_name?: string;
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
  success: number;
  data: {
    id: number;
    transaction_number: string;
    ledger_name: string;
    transaction_date: string;
    amount: 48;
  };
  error?: any;
}

export class SaleItem{
  id?: number;
  transaction_number?: string;
  ledger_name?: string;
  transaction_date?: string;
  amount?: number;
}
