<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB; // <-- Import the DB facade
// OR if you have the JobPost model and prefer Eloquent:
// use App\Models\JobPost;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Your existing routes might be here...
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


// --- Add this route using a closure ---
Route::get('/testing/job-posts', function () {

    // Option 1: Using the DB Facade (Simple, doesn't require a Model)
    try {
        $jobPosts = DB::table('job_posts')->get(); // Fetches all rows and columns
        return response()->json($jobPosts); // Return as JSON
    } catch (\Exception $e) {
        // Basic error handling
        report($e); // Log the error
        return response()->json(['error' => 'Failed to retrieve job posts.', 'message' => $e->getMessage()], 500);
    }


    /*
    // Option 2: Using the Eloquent Model (if App\Models\JobPost exists)
    // Make sure to import it at the top: use App\Models\JobPost;
    try {
        $jobPosts = \App\Models\JobPost::all(); // Fetches all rows via Eloquent
        return response()->json($jobPosts); // Return as JSON
    } catch (\Exception $e) {
        report($e);
        return response()->json(['error' => 'Failed to retrieve job posts.'], 500);
    }
    */

});