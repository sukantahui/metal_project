<?php

namespace App\Http\Resources;

use App\Http\Resources\UnitResource;
use Illuminate\Http\Resources\Json\JsonResource;


/**
 * @property mixed purchase_unit
 * @property mixed sale_unit
 * @property mixed sale_unit_id
 * @property mixed gst_rate
 * @property mixed hsn_code
 * @property mixed purchase_unit_id
 * @property mixed category
 * @property mixed product_category_id
 * @property mixed description
 * @property mixed product_name
 * @property mixed id
 */
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
            'purchaseUnit' => new UnitResource($this->purchase_unit),
            'saleUnitId' => $this->sale_unit_id,
            'saleUnit' => new UnitResource($this->sale_unit),
            'gst_rate' => $this->gst_rate,
            'hsn_code' => $this->hsn_code

        ];
    }
}
