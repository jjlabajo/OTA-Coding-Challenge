<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Laravel\Sanctum\PersonalAccessToken;
use Illuminate\Support\Facades\DB;

class AuthController extends Controller
{
    /**
     * Register a new user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(Request $request)
    {
        // Validate the request data
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|unique:users',
            'password' => 'required|string|min:8|confirmed', // 'confirmed' checks for password_confirmation field
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422); // 422 Unprocessable Entity
        }

        // Create the new user
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'user_type' => 'recruiter'
        ]);

        // Generate a Sanctum token for the new user
        $token = $user->createToken('auth_token')->plainTextToken;

        // Return the user data and the token
        return response()->json([
            'user' => $user,
            'token' => $token,
            'message' => 'Successfully registered',
        ], 201); // 201 Created
    }

    /**
     * Log in and return a token.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    {
        // Validate the request data
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Attempt to log the user in
        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json(['message' => 'Invalid login credentials'], 401); // 401 Unauthorized
        }

        // Get the user from the database
        $user = User::where('email', $request->email)->first();

        //Check if a token exists and delete it.
        $existingToken = PersonalAccessToken::where('tokenable_id', $user->id)->first();
        if ($existingToken) {
            $existingToken->delete();
        }
        // Generate a new Sanctum token
        $token = $user->createToken('auth_token')->plainTextToken;

        // Return the user data and the token
        return response()->json([
            'user' => $user,
            'token' => $token,
            'message' => 'Successfully logged in',
        ], 200);
    }

    /**
     * Log the user out (invalidate the token).
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout(Request $request)
    {
        // Revoke the user's current token.
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Successfully logged out'], 200);
    }

    /**
     * Get the user's profile.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function profile(Request $request)
    {
        // Return the authenticated user's data.  Sanctum's `auth:sanctum` middleware ensures that `$request->user()` is available.
        return response()->json(['user' => $request->user()], 200);
    }

    /**
     * Update the user's profile.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request)
    {
        // Validate the request data.  We'll allow updating name and password.
        $validator = Validator::make($request->all(), [
            'name' => 'string|max:255',
            'password' => 'string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = $request->user(); // Get the authenticated user.

        // Update the user's name if provided.
        if ($request->filled('name')) {
            $user->name = $request->name;
        }

        // Update the user's password if provided.
        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }

        $user->save(); // Save the changes to the database.

        return response()->json(['user' => $user, 'message' => 'Profile updated successfully'], 200);
    }
}