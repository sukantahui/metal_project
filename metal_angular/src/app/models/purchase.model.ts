import {Vendor} from "./vendor.model";
import {Product} from "./product.model";
import {Unit} from "../pages/product/product.component";


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
  unit?: Unit
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
  data?: {
    purchaseMaster: {
      invoice_number?: string;
      case_number?: string;
      comment?: string;
      updated_at?: string;
      created_at?: string;
      id?: number;
    }
  };
  error?: string;
  exception?: string;
}
