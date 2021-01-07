<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PurchaseMaster extends Model
{
    use HasFactory;

    /**
     * @var mixed
     */
    private $invoice_number;
    /**
     * @var mixed
     */
    private $case_number;
    /**
     * @var mixed
     */
    private $comment;
}
