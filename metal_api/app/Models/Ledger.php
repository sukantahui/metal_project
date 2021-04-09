<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ledger extends Model
{
    use HasFactory;
    private $ledger_name;
    private $billing_name;
    private $ledger_group_id;
    private $customer_category_id;
    private $email;
    private $mobile1;
    private $mobile2;
    private $branch;
    private $account_number;
    private $ifsc;
    private $address1;
    private $address2;
    private $state_id;
    private $po;
    private $area;
    private $city;
    private $pin;
    private $transaction_type_id;
    private $opening_balance;
    protected $hidden = [
        "inforce","created_at","updated_at",'password', 'remember_token',
    ];


    protected $guarded = ['id'];

    public function customer_category()
    {
        return $this->belongsTo('App\Models\CustomerCategory','customer_category_id');
    }

    public function ledger_group()
    {
        return $this->belongsTo('App\Models\LedgerGroup','ledger_group_id');
    }

    public function state()
    {
        return $this->belongsTo('App\Models\State','state_id');
    }

    public function transaction_type()
    {
        return $this->belongsTo('App\Models\TransactionType','transaction_type_id');
    }
}


