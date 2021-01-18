import {Vendor} from './vendor.model';
import {Product} from './product.model';
import {Unit} from '../pages/product/product.component';


export class PurchaseMaster{
  id?: number;
  invoice_number: string;
  case_number: string;
  comment?: string
}
export class PurchaseDetail{
  id?: number;
  purchase_master_id?: number;
  product_category_id?: number;
  product_id: number;
  purchase_quantity?: number;
  stock_quantity?: number
  rate?: number;
  product?: Product;
  unit?: Unit;
  isEditable?: boolean;
}

export class PurchaseResponse{
  success: number;
  data: {
    'id': number,
    'transaction_number': string,
    'amount': number,
    'ledger_name': string,
    'billing_name': string
  };
  error: any;
}



export class SavePurchaseResponse {
  success: number;
  data?: PurchaseList;
  error?: string;
}

export class PurchaseList {
  id?: number;
  transaction_number: string;
  ledger_name: string;
  transaction_date: string;
  amount: number;
}
