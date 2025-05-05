<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Phone;
use Illuminate\Support\Str;

class PhoneSeeder extends Seeder
{
    public function run(): void
    {
        $phones = [
            // Apple
            [
                'brand' => 'Apple',
                'model' => 'iPhone 14',
                'storage' => '128GB',
                'ram' => '6GB',
                'display' => '6.1"',
                'os' => 'iOS 16',
                'processor' => 'A15 Bionic',
                'description' => 'iPhone 14 con diseño renovado, chip A15 y mejor cámara.',
                'price' => 3800000,
                'stock' => 10,
            ],
            [
                'brand' => 'Apple',
                'model' => 'iPhone 14 Pro',
                'storage' => '256GB',
                'ram' => '6GB',
                'display' => '6.1"',
                'os' => 'iOS 16',
                'processor' => 'A16 Bionic',
                'description' => 'iPhone 14 Pro con Dynamic Island y cámara de 48 MP.',
                'price' => 4600000,
                'stock' => 7,
            ],
            [
                'brand' => 'Apple',
                'model' => 'iPhone 15',
                'storage' => '128GB',
                'ram' => '6GB',
                'display' => '6.1"',
                'os' => 'iOS 17',
                'processor' => 'A16 Bionic',
                'description' => 'iPhone 15 con puerto USB-C y mejoras en batería.',
                'price' => 4200000,
                'stock' => 9,
            ],
            [
                'brand' => 'Apple',
                'model' => 'iPhone 15 Pro Max',
                'storage' => '256GB',
                'ram' => '8GB',
                'display' => '6.7"',
                'os' => 'iOS 17',
                'processor' => 'A17 Pro',
                'description' => 'iPhone 15 Pro Max con titanio y cámara periscópica.',
                'price' => 5500000,
                'stock' => 5,
            ],
            [
                'brand' => 'Apple',
                'model' => 'iPhone 16 Pro Max',
                'storage' => '512GB',
                'ram' => '8GB',
                'display' => '6.7"',
                'os' => 'iOS 18',
                'processor' => 'A18 Pro',
                'description' => 'iPhone 16 Pro Max con mejoras IA, pantalla y cámara.',
                'price' => 6800000,
                'stock' => 3,
            ],

            // Samsung
            [
                'brand' => 'Samsung',
                'model' => 'Galaxy S21 Ultra',
                'storage' => '256GB',
                'ram' => '12GB',
                'display' => '6.8"',
                'os' => 'Android 11',
                'processor' => 'Exynos 2100',
                'description' => 'Pantalla AMOLED, zoom 100x y batería duradera.',
                'price' => 3200000,
                'stock' => 10,
            ],
            [
                'brand' => 'Samsung',
                'model' => 'Galaxy S22 Ultra',
                'storage' => '256GB',
                'ram' => '12GB',
                'display' => '6.8"',
                'os' => 'Android 12',
                'processor' => 'Snapdragon 8 Gen 1',
                'description' => 'Cámara de 108 MP y S-Pen integrado.',
                'price' => 3900000,
                'stock' => 9,
            ],
            [
                'brand' => 'Samsung',
                'model' => 'Galaxy S23 Ultra',
                'storage' => '256GB',
                'ram' => '12GB',
                'display' => '6.8"',
                'os' => 'Android 13',
                'processor' => 'Snapdragon 8 Gen 2',
                'description' => 'Cámara de 200 MP y rendimiento de gama alta.',
                'price' => 4200000,
                'stock' => 8,
            ],
            [
                'brand' => 'Samsung',
                'model' => 'Galaxy S24',
                'storage' => '128GB',
                'ram' => '8GB',
                'display' => '6.2"',
                'os' => 'Android 14',
                'processor' => 'Exynos 2400',
                'description' => 'Rendimiento optimizado y conectividad avanzada.',
                'price' => 4400000,
                'stock' => 6,
            ],
            [
                'brand' => 'Samsung',
                'model' => 'Galaxy S24 Ultra',
                'storage' => '512GB',
                'ram' => '12GB',
                'display' => '6.8"',
                'os' => 'Android 14',
                'processor' => 'Snapdragon 8 Gen 3',
                'description' => 'Pantalla curva, S-Pen, y cámara mejorada IA.',
                'price' => 5700000,
                'stock' => 4,
            ],

            // Xiaomi
            [
                'brand' => 'Xiaomi',
                'model' => 'Redmi Note 13 Pro',
                'storage' => '128GB',
                'ram' => '8GB',
                'display' => '6.67"',
                'os' => 'MIUI 14',
                'processor' => 'Snapdragon 7s Gen 2',
                'description' => 'Gran relación calidad-precio con cámara de 200 MP.',
                'price' => 1500000,
                'stock' => 10,
            ],
        ];

        foreach ($phones as $data) {
            Phone::firstOrCreate(
                [
                    'brand' => $data['brand'],
                    'model' => $data['model'],
                    'storage' => $data['storage'],
                ],
                $data
            );
        }
    }
}
