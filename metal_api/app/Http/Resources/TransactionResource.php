<?php

namespace App\Http\Resources;

use App\Models\TransactionMaster;
use Illuminate\Http\Resources\Json\JsonResource;


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
            "transaction_date"=> $this->transaction_date,
            "comment"=> $this->comment,
            "inforce"=> $this->inforce,
            'transaction_details'=>TransactionDetailResource::collection(TransactionMaster::find($this->id)->transaction_details)
        ];


    }
}
