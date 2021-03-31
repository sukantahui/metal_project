<?php

namespace App\Models;

use App\Models\SaleMaster;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class TransactionMaster extends Model
{
    use HasFactory;

    /**
     * @var mixed|string
     */
    private $transaction_number;
    /**
     * @var mixed
     */
    private $user_id;
    /**
     * @var int|mixed
     */
    private $voucher_type_id;
    /**
     * @var mixed
     */
    private $purchase_master_id;
    /**
     * @var mixed
     */
    private $transaction_date;
    /**
     * @var mixed
     */
    private $reference_transaction_master_id;
    /**
     * @var mixed
     */
    private $sale_master_id;
    /**
     * @var mixed
     */
    private $id;
    private $comment;

    public function sale_master()
    {
        return $this->belongsTo('App\Models\SaleMaster','sale_master_id');
    }

    public function transaction_details()
    {
        return $this->hasMany('App\Models\TransactionDetail','transaction_master_id');
    }


}
