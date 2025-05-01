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

            return response()->json(["count" => $count]);

        } catch (\Exception $e) {
            report($e);
            return response()->json(['error' => 'Failed to retrieve user job posts.', 'message' => $e->getMessage()], 500);
        }
    }

    public function streamModeratorNotifications(Request $request)
    {
        try {
            $user = $request->user();

            if (!$user || $user->user_type != 'moderator') {
                return response()->json([
                    'error' => 'Unauthorized.',
                    'message' => "Only moderators can access this information."
                ], 403);
            }
            $callback = function () {
                $count = $this->getNotificationCount();
                $data = ["count" => $count];
                echo json_encode($data);
            };

            $headers = [
                'Content-Type' => 'application/json',
                'Cache-Control' => 'no-cache',
                'X-Accel-Buffering' => 'no',
                'Access-Control-Allow-Origin' => '*',
                'Access-Control-Allow-Credentials' => 'true',
                'Access-Control-Max-Age' => '86400',
                'Access-Control-Allow-Methods' => 'GET, POST, PUT, PATCH, DELETE, OPTIONS'
            ];

            return new StreamedResponse($callback, 200, $headers);

        } catch (Exception $e) {
            report($e);
            return response()->json([
                'error' => 'Failed to retrieve notification count.',
                'message' => $e->getMessage()
            ], 500);
        }
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