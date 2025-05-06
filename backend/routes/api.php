<?php
// dd('Cargando api.php correctamente');

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ClientController;
use App\Http\Controllers\Api\PhoneController;
use App\Http\Controllers\Api\CreditController;


Route::prefix('clients')->group(function () {
    Route::get('/', [ClientController::class, 'index']);
    Route::get('{id}', [ClientController::class, 'show']);
});

Route::prefix('phones')->group(function () {
    Route::get('/', [PhoneController::class, 'index']);
    Route::post('/', [PhoneController::class, 'store']);
    Route::get('{id}', [PhoneController::class, 'show']);
    Route::patch('{id}', [PhoneController::class, 'update']);
    Route::delete('{id}', [PhoneController::class, 'destroy']);
});

Route::prefix('credits')->group(function () {
    Route::get('/', [CreditController::class, 'index']);
    Route::post('/', [CreditController::class, 'store']);
    Route::get('{id}', [CreditController::class, 'show']);
    Route::patch('{id}', [CreditController::class, 'update']);
});


