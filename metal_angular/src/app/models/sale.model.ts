import {Product} from './product.model';
import {Unit} from '../pages/product/product.component';
import {TransactionDetail, TransactionMaster} from './transaction.model';
import {ExtraItem, ExtraItemDetails} from '../pages/purchase/purchase.component';
import {Customer} from './customer.model';

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
  product_name?: string;
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
  bill_number?: string;
  ledger_name?: string;
  transaction_date?: string;
  amount?: number;
}

export class SaleContainer{
  tm?: TransactionMaster;
  td?: TransactionDetail[];
  sm?: SaleMaster;
  sd?: SaleDetail[];
  extraItems?: ExtraItemDetails[];
  receiveTransactionMaster?: TransactionMaster;
  receiveTransactionDetails?: TransactionDetail[];
  currentSaleTotal?: number;
  roundedOff?: number;
  grossTotal?: number;
  isAmountReceived?: boolean;
  selectedLedger?: Customer;
}

export class SaleBill{
  transaction_master?: TransactionMaster;
  customer?: Customer;
  sale_master?: SaleMaster;
  sale_details?: SaleDetail[];
  sale_extras?: ExtraItem[];
}

