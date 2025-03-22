<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'price',
        'is_active',
        'category_id',
        'image',
        'sale_attribute',
    ];

    // Relation avec Category
    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
