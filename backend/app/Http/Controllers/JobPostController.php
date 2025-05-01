<?php

namespace App\Http\Controllers;

use App\Models\JobPost;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

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
            $jobPosts = JobPost::all();
            return response()->json($jobPosts);
        } catch (\Exception $e) {
            report($e);
            return response()->json(['error' => 'Failed to retrieve job posts.', 'message' => $e->getMessage()], 500);
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
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'company' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            // Add other relevant fields and their validation rules
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => 'Validation failed.', 'messages' => $validator->errors()], 422);
        }

        try {
            // When creating, we can set the initial status to 'pending' or leave it as a default in the database
            $jobPost = JobPost::create(array_merge($request->all(), ['status' => 'pending']));
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
    public function approve(int $id): JsonResponse
    {
        try {
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
    public function markAsSpam(int $id): JsonResponse
    {
        try {
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
}