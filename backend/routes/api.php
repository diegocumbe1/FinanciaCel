<?php
// dd('Cargando api.php correctamente');

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ClientController;
use App\Http\Controllers\Api\PhoneController;


Route::prefix('clients')->group(function () {
    Route::get('/', [ClientController::class, 'index']);
    Route::get('{id}', [ClientController::class, 'show']);
});

Route::apiResource('phones', PhoneController::class)->only([
    'index', 'store', 'show', 'update', 'destroy'
]);

