<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class CreditApplication extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'client_id',
        'phone_id',
        'amount',
        'term',
        'state',
    ];

    protected $casts = [
        'amount' => 'float',
        'term' => 'integer',
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function phone()
    {
        return $this->belongsTo(Phone::class);
    }

    public function instalments()
    {
        return $this->hasMany(Instalment::class);
    }
}
