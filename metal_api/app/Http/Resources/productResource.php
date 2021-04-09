<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class productResource extends JsonResource
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
            'id' => $this->id,
            'name' => $this->product_name,
            'description' => $this->description,
            'productCategoryId' =>$this->product_category_id,
            'productCategory' => $this->category,
            'purchaseUnitId' => $this->purchase_unit_id,
            'purchaseUnit' => $this->purchase_unit,
            'saleUnitId' => $this->sale_unit_id,
            'saleUnit' => $this->sale_unit,
            'gst_rate' => $this->gst_rate,
            'hsn_code' => $this->hsn_code

        ];
    }
}
