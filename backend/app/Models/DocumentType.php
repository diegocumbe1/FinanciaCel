<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class DocumentType extends Model
{
    use HasUuids;

    protected $fillable = ['name', 'code']; // Example: "Cédula de Ciudadanía", "CC"

    public function clients() {
        return $this->hasMany(Client::class);
    }
}
