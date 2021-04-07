<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class TransactionDetailResource extends JsonResource
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
            "id"=>$this->id,
            "transaction_master_id"=>$this->transaction_master_id,
            "ledger_id"=>$this->ledger_id,
            'ledger' => $this->ledger,
            "transaction_type_id" => $this->transaction_type_id,
            "amount"=>$this->amount
        ];
    }
}
