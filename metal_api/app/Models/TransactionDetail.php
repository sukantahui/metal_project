<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TransactionDetail extends Model
{
    use HasFactory;

    /**
     * @var mixed
     */
    private $transaction_master_id;
    /**
     * @var mixed
     */
    private $ledger_id;
    /**
     * @var mixed
     */
    private $transaction_type_id;
    /**
     * @var mixed
     */
    private $amount;
}
