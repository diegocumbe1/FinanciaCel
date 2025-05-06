<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Instalment extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'credit_application_id',
        'number',
        'amount',
        'due_date',
    ];

    public function creditApplication()
    {
        return $this->belongsTo(CreditApplication::class);
    }
}
