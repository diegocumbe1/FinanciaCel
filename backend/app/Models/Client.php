<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Client extends Model
{
    use HasUuids;

    protected $fillable = [
        'name',
        'email',
        'document_number',
        'document_type_id',
        'address',
        'phone_number',
    ];

    protected $casts = [
        'document_type_id' => 'string',
    ];
    public function creditApplications() {
        return $this->hasMany(CreditApplication::class);
    }
    public function documentType() {
        return $this->belongsTo(DocumentType::class);
    }
}
