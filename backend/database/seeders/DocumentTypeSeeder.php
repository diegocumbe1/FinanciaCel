<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\DocumentType;

class DocumentTypeSeeder extends Seeder
{
    public function run(): void
    {
        $types = [
            ['code' => 'CC', 'name' => 'Cédula de Ciudadanía'],
            ['code' => 'CE', 'name' => 'Cédula de Extranjería'],
            ['code' => 'NIT', 'name' => 'Número de Identificación Tributaria'],
            ['code' => 'TI', 'name' => 'Tarjeta de Identidad'],
            ['code' => 'PA', 'name' => 'Pasaporte'],
        ];

        foreach ($types as $type) {
            DocumentType::firstOrCreate($type);
        }
    }
}

