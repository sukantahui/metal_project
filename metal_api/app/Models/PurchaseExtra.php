<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PurchaseExtra extends Model
{
    use HasFactory;

    /**
     * @var mixed
     */
    private $purchase_master_id;
    /**
     * @var mixed
     */
    private $extra_item_id;
    /**
     * @var mixed
     */
    private $amount;
    /**
     * @var mixed
     */
    private $item_type;
}
