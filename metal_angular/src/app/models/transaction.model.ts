import {Vendor} from "./vendor.model";


export class TransactionMaster{
  id?: number;
  transaction_number: string;
  user_id: string;
  purchase_master_id?: number;
  transaction_date: string;
}
export class TransactionDetail{
  id?: number;
  transaction_type_id?: number;
  transaction_master_id?: number;
  ledger_id?: number;
  ledger?: Vendor;
  amount: number;
}
