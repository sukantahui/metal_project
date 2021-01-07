<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PurchaseDetail extends Model
{
    use HasFactory;

    /**
     * @var mixed
     */
    private $purchase_master_id;
    /**
     * @var mixed
     */
    private $product_id;
    /**
     * @var mixed
     */
    private $rate;
    /**
     * @var mixed
     */
    private $purchase_quantity;
    /**
     * @var mixed
     */
    private $stock_quantity;
}
