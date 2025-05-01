<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB; // <-- Import DB facade
use Carbon\Carbon;             // <-- Import Carbon for timestamps

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('job_posts', function (Blueprint $table) {
            $table->id(); // Standard auto-incrementing primary key
            $table->string('position');
            $table->string('employment_type')->nullable(); // <employmentType>
            $table->string('office')->nullable(); // <office>
            $table->longText('description')->nullable(); // To store combined <jobDescription> HTML values
            $table->enum('status', ['pending', 'approved', 'spam'])->default('pending'); // Added status column with default
            $table->unsignedBigInteger('user_id')->nullable(); // Assuming you want to add this if it doesn't exist
            $table->string('company')->nullable(); // Added company column
            $table->timestamps(); // Laravel's standard created_at and updated_at

            // Foreign key relationship (if you have a users table)
            // $table->foreign('user_id')->references('id')->on('users')->onDelete('SET NULL');
        });

        // --- Add Dummy Data ---
        // Note: Using Seeders is generally preferred for data population.
        $now = Carbon::now(); // Get the current timestamp

        DB::table('job_posts')->insert([
            [
                'position' => 'Senior Backend Engineer (PHP/Laravel)',
                'employment_type' => 'Full-time',
                'office' => 'Main Office',
                'description' => '<h1>About the Role</h1><p>We are seeking an experienced Backend Engineer...</p><ul><li>Develop APIs</li><li>Maintain Databases</li></ul>',
                'status' => 'approved', // Example status
                'created_at' => $now,
                'updated_at' => $now,
                'user_id' => 1, // Example user ID
                'company' => 'Tech Innovations Inc.',
            ],
            [
                'position' => 'Digital Marketing Specialist',
                'employment_type' => 'Full-time',
                'office' => 'Downtown Branch',
                'description' => '<h2>Join Our Team!</h2><p>Looking for a creative Digital Marketing Specialist to manage campaigns...</p>',
                'status' => 'pending', // Example status
                'created_at' => $now,
                'updated_at' => $now,
                'user_id' => 1, // Example user ID
                'company' => 'Global Marketing Solutions',
            ],
            [
                'position' => 'UX/UI Designer',
                'employment_type' => 'Contract',
                'office' => 'Remote',
                'description' => '<h3>Job Overview</h3><p>Design intuitive and engaging user interfaces for web and mobile applications.</p><p>Requires portfolio submission.</p>',
                'status' => 'spam', // Example status
                'created_at' => $now,
                'updated_at' => $now,
                'user_id' => 1, // Example user ID
                'company' => 'Creative Software Ltd.',
            ],
            [
                'position' => 'HR Assistant',
                'employment_type' => 'Part-time',
                'office' => 'Main Office',
                'description' => '<p>Assist the HR department with daily administrative tasks.</p>',
                'status' => 'pending', // Example status
                'created_at' => $now,
                'updated_at' => $now,
                'user_id' => 1, // Example user ID
                'company' => 'United Enterprises',
            ],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('job_posts');
    }
};