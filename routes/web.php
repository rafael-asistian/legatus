<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Auth/Login');
});

Route::get('/login', function () {
    return Inertia::render('Auth/Login');
})->name('login');

Route::post('/login', function () {
    // Placeholder for login logic
    return redirect()->route('clients.index');
});

Route::resource('clients', \App\Http\Controllers\ClientController::class)->only(['index']);
