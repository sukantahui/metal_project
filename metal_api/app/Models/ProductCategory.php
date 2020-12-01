<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductCategory extends Model
{
    use HasFactory;
    protected $guarded = ['id'];
    protected $hidden = [
        "inforce","created_at","updated_at"
    ];

    public function products()
    {
        return $this->hasMany('App\Models\Product','product_category_id');
    }
}
