<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class State extends Model
{
    use HasFactory;
    protected $hidden = [
        "inforce","created_at","updated_at"
    ];
    /**
     * @var mixed
     */
    private $state_name;
    /**
     * @var mixed
     */
    private $state_code;
}
