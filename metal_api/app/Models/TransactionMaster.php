<?php

namespace App\Models;

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
}
