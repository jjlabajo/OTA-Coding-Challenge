<?php

use App\Http\Controllers\JobPostController;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// --- Route using a dedicated Controller ---
Route::get('/job-posts', [JobPostController::class, 'index']);
Route::get('/job-posts/{id}', [JobPostController::class, 'show']);

// Route to register a new user
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::get('/profile', [AuthController::class, 'profile'])->middleware('auth:sanctum');


Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user/job-posts', [JobPostController::class, 'userJobPosts']);
    Route::post('/job-posts', [JobPostController::class, 'store']);
    Route::delete('/job-posts/{id}', [JobPostController::class, 'destroy']);
});