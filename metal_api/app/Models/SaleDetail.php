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
    protected $hidden = [
        "inforce","created_at","updated_at"
    ];
    public function transaction_type()
    {
        return $this->belongsTo('App\Models\TransactionType','transaction_type_id');
    }
    public function product()
    {
        return $this->belongsTo('App\Models\Product','product_id');
    }
}
