<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SaleExtra extends Model
{
    use HasFactory;

    /**
     * @var mixed
     */
    private $sale_master_id;
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
    protected $hidden = [
        "inforce","created_at","updated_at"
    ];
}
