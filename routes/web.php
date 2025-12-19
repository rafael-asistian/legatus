<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Controllers\CaseController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\JuicioController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\JuicioUpdateController;
use App\Http\Controllers\Auth\GoogleAuthController;

// Public routes
Route::get('/', function () {
    if (Auth::check()) {
        return redirect('/home');
    }
    return redirect('/login');
});

Route::get('/login', function () {
    if (Auth::check()) {
        return redirect('/home');
    }
    return Inertia::render('Auth/Login');
})->name('login');

// Google OAuth routes
Route::get('/auth/google', [GoogleAuthController::class, 'redirect'])->name('auth.google');
Route::get('/auth/google/callback', [GoogleAuthController::class, 'callback'])->name('auth.google.callback');

// Logout
Route::post('/logout', function (Request $request) {
    Auth::logout();
    $request->session()->invalidate();
    $request->session()->regenerateToken();
    return redirect('/login');
})->name('logout');

// Protected routes
Route::middleware(['auth'])->group(function () {
    // Home
    Route::get('/home', function () {
        return Inertia::render('Home', [
            'user' => Auth::user(),
        ]);
    })->name('home');

    // Clients
    Route::resource('clients', ClientController::class);

    // Cases
    Route::resource('cases', CaseController::class);

    // Juicios
    Route::resource('juicios', JuicioController::class);
    
    // Juicio Updates
    Route::post('/juicios/{juicio}/updates', [JuicioUpdateController::class, 'store'])->name('juicio-updates.store');
    Route::put('/juicio-updates/{update}', [JuicioUpdateController::class, 'update'])->name('juicio-updates.update');
    Route::delete('/juicio-updates/{update}', [JuicioUpdateController::class, 'destroy'])->name('juicio-updates.destroy');
    Route::post('/juicio-updates/{update}/reanalyze', [JuicioUpdateController::class, 'reanalyze'])->name('juicio-updates.reanalyze');

    // Settings routes
    Route::prefix('settings')->name('settings.')->group(function () {
        Route::get('/', [SettingsController::class, 'index'])->name('index');
        
        // Company
        Route::get('/company', [SettingsController::class, 'company'])->name('company');
        Route::post('/company', [SettingsController::class, 'updateCompany'])->name('company.update');
        
        // Profile
        Route::get('/profile', [SettingsController::class, 'profile'])->name('profile');
        Route::post('/profile', [SettingsController::class, 'updateProfile'])->name('profile.update');
        
        // Users
        Route::get('/users', [SettingsController::class, 'users'])->name('users');
        Route::post('/users', [SettingsController::class, 'storeUser'])->name('users.store');
        Route::put('/users/{user}', [SettingsController::class, 'updateUser'])->name('users.update');
        Route::delete('/users/{user}', [SettingsController::class, 'destroyUser'])->name('users.destroy');
        
        // Courts
        Route::get('/courts', [SettingsController::class, 'courts'])->name('courts');
        Route::post('/courts', [SettingsController::class, 'storeCourt'])->name('courts.store');
        Route::put('/courts/{court}', [SettingsController::class, 'updateCourt'])->name('courts.update');
        Route::delete('/courts/{court}', [SettingsController::class, 'destroyCourt'])->name('courts.destroy');
    });
});
