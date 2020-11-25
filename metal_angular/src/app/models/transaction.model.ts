

export class Transaction{
  id?: number;
  transaction_date: string;
  formatted_date?: string;
  ledger_id: number;
  ledger_name?: string
  asset_id: number;
  assets_name?: string;
  voucher_number?: number;
  amount: number;
  voucher_id: number;
  particulars: string;
  user_id: number;
}
