<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Phone extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'phones';

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'brand',
        'model',
        'storage',
        'ram',
        'display',
        'os',
        'processor',
        'description',
        'price',
        'stock',
    ];
}
