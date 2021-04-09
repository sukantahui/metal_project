<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CustomerCategory extends Model
{
    use HasFactory;
    protected $hidden = [
        "inforce","created_at","updated_at"
    ];

    public function ledgers()
    {
        return $this->hasMany('App\Models\Ledger','customer_category_id');
    }
}
