<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;
    protected $guarded = ['id'];
    protected $hidden = [
        "inforce","created_at","updated_at"
    ];
    private $hsn_code;
    private $gst_rate;
    private $sale_unit_id;
    private $purchase_unit_id;
    private $product_category_id;
    private $description;
    private $product_name;
    private $opening_balance;

    public function category()
    {
        return $this->belongsTo('App\Models\ProductCategory','product_category_id');
    }
    public function purchase_unit()
    {
        return $this->belongsTo('App\Models\Unit','purchase_unit_id');
    }
    public function sale_unit()
    {
        return $this->belongsTo('App\Models\Unit','sale_unit_id');
    }
}
