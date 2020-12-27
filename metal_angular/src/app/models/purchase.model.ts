import {Vendor} from "./vendor.model";
import {Product} from "./product.model";
import {Unit} from "../pages/product/product.component";


export class PurchaseMaster{
  id?: number;
  invoice_number: string;
  reference_number?: string;
  challan_number?: string
  order_number?: string;
  order_date: string;
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
    "id": number,
    "transaction_number": string,
    "amount": number,
    "ledger_name": string,
    "billing_name": string
  };
  error: any
}
