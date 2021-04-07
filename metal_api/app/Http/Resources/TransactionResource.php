<?php

namespace App\Http\Resources;

use App\Models\TransactionMaster;
use App\Models\VoucherType;
use Illuminate\Http\Resources\Json\JsonResource;


/**
 * @property mixed transaction_number
 * @property mixed reference_transaction_master_id
 * @property mixed id
 * @property mixed user_id
 * @property mixed inforce
 * @property mixed comment
 * @property mixed transaction_date
 * @property mixed sale_master_id
 * @property mixed purchase_master_id
 * @property mixed voucher_type_id
 * @property mixed voucher_type
 * @property mixed sale_master
 */
class TransactionResource extends JsonResource
{

    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            "id"=> $this->id,
            "transaction_number"=> $this->transaction_number,
            "reference_transaction_master_id"=> $this->reference_transaction_master_id,
            "user_id"=> $this->user_id,
            "voucher_type_id"=> $this->voucher_type_id,
            "purchase_master_id"=> $this->purchase_master_id,
            "sale_master_id"=> $this->sale_master_id,
            'sale_master' => $this->sale_master_id? $this->sale_master: 'not sale',
            "transaction_date"=> $this->transaction_date,
            "transaction_date_display"=> date('d/m/Y', strtotime($this->transaction_date)),
            'voucher_type' => $this->voucher_type->voucher_type_name,
            "comment"=> $this->comment,
            "inforce"=> $this->inforce,
            'transaction_details'=>TransactionDetailResource::collection(TransactionMaster::find($this->id)->transaction_details)
        ];


    }
}
