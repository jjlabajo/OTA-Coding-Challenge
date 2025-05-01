<?php

use App\Http\Controllers\JobPostController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request): mixed {
    return $request->user();
});

// --- Route using a dedicated Controller ---
Route::get('/job-posts', [JobPostController::class, 'index']);

Route::get('/job-posts/{id}', [JobPostController::class, 'show']);