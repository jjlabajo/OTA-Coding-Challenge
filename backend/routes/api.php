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
    Route::get('/moderator/job-posts', [JobPostController::class, 'moderatorJobPosts']);
    Route::get('/moderator/notifications', [JobPostController::class, 'moderatorNotifications']);
    Route::get('/moderator/notification-count', [JobPostController::class, 'moderatorNotificationCount']);
    Route::get('/moderator/notification-stream', [NotificationController::class, 'streamModeratorNotifications']);
    
    Route::post('/job-posts', [JobPostController::class, 'store']);
    Route::delete('/job-posts/{id}', [JobPostController::class, 'destroy']);
    Route::patch('/job-posts/{id}/approve', [JobPostController::class, 'approve']);
    Route::patch('/job-posts/{id}/markAsSpam', [JobPostController::class, 'markAsSpam']);
});