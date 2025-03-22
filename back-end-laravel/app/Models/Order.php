<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'name', 'email', 'phone', 'address', 'payment_method', 'total_price', 'status'
    ];

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}
