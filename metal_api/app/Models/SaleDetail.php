<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SaleDetail extends Model
{
    use HasFactory;

    /**
     * @var mixed
     */
    private $sale_master_id;
    /**
     * @var mixed
     */
    private $product_id;
    /**
     * @var mixed
     */
    private $quantity;
    /**
     * @var mixed
     */
    private $price;
    /**
     * @var mixed
     */
    private $rate;
}
