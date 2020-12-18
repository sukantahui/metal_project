import {Vendor} from "./vendor.model";


export class TransactionDetail{
  id?: number;
  transaction_master_id?: number;
  ledger_id?: number;
  ledger: Vendor
}
