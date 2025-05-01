<?php

namespace App\Http\Controllers;

use App\Models\JobPost;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

use Symfony\Component\HttpFoundation\StreamedResponse; 

class JobPostController extends Controller
{
    /**
     * Display a listing of the job posts.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(): JsonResponse
    {
        try {
            $jobPosts = JobPost::with('user')
                        ->where('status', 'approved')->get();
            return response()->json($jobPosts);
        } catch (\Exception $e) {
            report($e);
            return response()->json(['error' => 'Failed to retrieve job posts.', 'message' => $e->getMessage()], 500);
        }
    }

    public function userJobPosts(Request $request): JsonResponse
    {
        try {
            $user = $request->user(); // Get the authenticated user instance
            $jobPosts = JobPost::where('user_id', $user->id)
                                ->with('user')
                                ->latest() // Optional: Order by latest created
                                ->get();

            return response()->json($jobPosts);
        } catch (\Exception $e) {
            report($e);
            return response()->json(['error' => 'Failed to retrieve user job posts.', 'message' => $e->getMessage()], 500);
        }
    }

    public function moderatorJobPosts(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            if($user->user_type != 'moderator'){
                return response()->json(['error' => 'Failed to retrieve moderator job posts.', 'message' => "Only moderators can retrieve these job posts."], 500);
            }
            $jobPosts = JobPost::where('status', 'pending')
                                ->with('user')
                                ->latest()
                                ->get();

            return response()->json($jobPosts);
        } catch (\Exception $e) {
            report($e);
            return response()->json(['error' => 'Failed to retrieve user job posts.', 'message' => $e->getMessage()], 500);
        }
    }

    public function moderatorNotifications(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            if ($user->user_type != 'moderator') {
                return response()->json(['error' => 'Failed to retrieve moderator job posts.', 'message' => "Only moderators can retrieve these job posts."], 403);
            }

            $firstJobPosts = JobPost::with('user')
                ->orderBy('created_at', 'asc')
                ->get()
                ->groupBy('user_id')
                ->map(function ($posts) {
                    return $posts->first();
                })
                ->sortByDesc('created_at')
                ->values();

            return response()->json($firstJobPosts);

        } catch (\Exception $e) {
            report($e);
            return response()->json(['error' => 'Failed to retrieve user job posts.', 'message' => $e->getMessage()], 500);
        }
    }

    
    private function getNotificationCount(): int
    {
        return JobPost::with('user')
                ->orderBy('created_at', 'asc')
                ->get()
                ->groupBy('user_id')
                ->map(function ($posts) {
                    return $posts->first();
                })
                ->sortByDesc('created_at')
                ->values()
                ->where("status", "pending")
                ->count();
    }

    public function moderatorNotificationCount(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            if ($user->user_type != 'moderator') {
                return response()->json(['error' => 'Failed to retrieve moderator job posts.', 'message' => "Only moderators can retrieve these job posts."], 403);
            }

            $count = $this->getNotificationCount();

            return response()->json([ "count" => $count ]);

        } catch (\Exception $e) {
            report($e);
            return response()->json(['error' => 'Failed to retrieve user job posts.', 'message' => $e->getMessage()], 500);
        }
    }


    public function streamModeratorNotifications(Request $request)
    {
        // Ensure user is authenticated (though middleware should handle this)
        if (!Auth::check()) {
            abort(401);
        }

        $response = new StreamedResponse(function() {
            $lastCount = -1; // Initialize with a value that ensures the first send

            while (true) {
                // 1. Check for client disconnection
                if (connection_aborted()) {
                    break; // Exit the loop if the client has disconnected
                }

                // 2. Get the current notification count
                //    Replace this with your actual logic to count pending jobs or notifications
                $currentCount = JobPost::with('user')
                ->orderBy('created_at', 'asc')
                ->get()
                ->groupBy('user_id')
                ->map(function ($posts) {
                    return $posts->first();
                })
                ->sortByDesc('created_at')
                ->values()
                ->where("status", "pending")
                ->count();

                // 3. Send update only if the count has changed
                if ($currentCount !== $lastCount) {
                    // SSE Format: event: <event_name>\ndata: <json_data>\n\n
                    echo "event: notification_count_update\n";
                    echo "data: " . json_encode(['count' => $currentCount]) . "\n\n";

                    // Update the last count
                    $lastCount = $currentCount;

                    // 4. Flush the output buffer to send data immediately
                    ob_flush();
                    flush();
                } else {
                    // Send a heartbeat comment to keep the connection alive
                    // (optional, but good practice)
                     echo ": ping\n\n";
                     ob_flush();
                     flush();
                }


                // 5. Wait for a short period before checking again
                //    Adjust the sleep duration based on how real-time you need it
                //    and server resource considerations. 5-15 seconds is common.
                sleep(10); // Check every 10 seconds
            }
        });

        // Set headers essential for SSE
        $response->headers->set('Content-Type', 'text/event-stream');
        $response->headers->set('Cache-Control', 'no-cache');
        $response->headers->set('Connection', 'keep-alive');
        // Crucial for Nginx configurations to disable response buffering
        $response->headers->set('X-Accel-Buffering', 'no');

        return $response;
    }

    
    /**
     * Display the specified job post.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(int $id): JsonResponse
    {
        try {
            $jobPost = JobPost::findOrFail($id);
            return response()->json($jobPost);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Job post not found.'], 404);
        } catch (\Exception $e) {
            report($e);
            return response()->json(['error' => 'Failed to retrieve job post.', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Create a new job post.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'position' => 'required|string|max:255',
            'description' => 'required|string',
            'company' => 'required|string|max:255',
            'office' => 'required|string|max:255',
            // Add other relevant fields and their validation rules
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => 'Validation failed.', 'messages' => $validator->errors()], 422);
        }

        try {
            // Associate the job post with the currently authenticated user
            $user = Auth::user();
            if (!$user) {
                 return response()->json(['error' => 'User not authenticated.'], 401);
            }

            $jobPostData = $request->all();
            $jobPostData['user_id'] = $user->id; // Set the user_id
            $jobPostData['status'] = 'pending'; // Set the initial status

            $jobPost = JobPost::create($jobPostData);

            // Load the user relationship if you want to return it in the response
            $jobPost->load('user');

            return response()->json($jobPost, 201); // 201 Created
        } catch (\Exception $e) {
            report($e);
            return response()->json(['error' => 'Failed to create job post.', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Approve a job post.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function approve(Request $request, int $id): JsonResponse
    {
        try {
            $user = $request->user();
            if($user->user_type != 'moderator'){
                return response()->json(['error' => 'Failed to approve job post.', 'message' => "Only moderators can do this."], 500);
            }
            
            $jobPost = JobPost::findOrFail($id);

            if ($jobPost->status === 'approved') {
                return response()->json(['message' => 'Job post is already approved.'], 200);
            }

            $jobPost->update(['status' => 'approved']);
            return response()->json(['message' => 'Job post approved successfully.', 'job_post' => $jobPost], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Job post not found.'], 404);
        } catch (\Exception $e) {
            report($e);
            return response()->json(['error' => 'Failed to approve job post.', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Mark a job post as spam.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function markAsSpam(Request $request, int $id): JsonResponse
    {
        try {
            $user = $request->user();
            if($user->user_type != 'moderator'){
                return response()->json(['error' => 'Failed to mark job post as spam.', 'message' => "Only moderators can do this."], 500);
            }

            $jobPost = JobPost::findOrFail($id);

            if ($jobPost->status === 'spam') {
                return response()->json(['message' => 'Job post is already marked as spam.'], 200);
            }

            $jobPost->update(['status' => 'spam']);
            return response()->json(['message' => 'Job post marked as spam successfully.', 'job_post' => $jobPost], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Job post not found.'], 404);
        } catch (\Exception $e) {
            report($e);
            return response()->json(['error' => 'Failed to mark job post as spam.', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Remove the specified job post from storage.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(int $id): JsonResponse
    {
        try {
            $jobPost = JobPost::findOrFail($id);

            if (Auth::id() !== $jobPost->user_id) {
                return response()->json(['error' => 'Unauthorized.'], 403);
            }

            $jobPost->delete();
            return response()->json(['message' => 'Job post deleted successfully.'], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Job post not found.'], 404);
        } catch (\Exception $e) {
            report($e);
            return response()->json(['error' => 'Failed to delete job post.', 'message' => $e->getMessage()], 500);
        }
    }
}