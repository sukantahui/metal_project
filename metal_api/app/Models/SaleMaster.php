<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SaleMaster extends Model
{
    use HasFactory;

    /**
     * @var mixed
     */
    private $bill_number;
    /**
     * @var mixed
     */
    private $order_date;
    /**
     * @var mixed
     */
    private $delivery_date;
    /**
     * @var mixed
     */
    private $comment;
    /**
     * @var mixed
     */
    private $id;
    protected $hidden = [
        "inforce","created_at","updated_at"
    ];
    public function sale_details()
    {
        return $this->hasMany( 'App\Models\SaleDetail', 'sale_master_id');
    }
}
