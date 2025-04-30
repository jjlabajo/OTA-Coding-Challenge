<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB; // <-- Import DB facade
use Carbon\Carbon;                 // <-- Import Carbon for timestamps

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('job_posts', function (Blueprint $table) {
            $table->id(); // Standard auto-incrementing primary key
            $table->string('external_id')->nullable()->index(); // The <id> from the XML, indexed for lookups
            $table->string('subcompany')->nullable(); // <subcompany>
            $table->string('office')->nullable(); // <office>
            $table->string('department')->nullable(); // <department>
            $table->string('recruiting_category')->nullable(); // <recruitingCategory>
            $table->string('name'); // <name> (Job Title - assuming this is required)
            $table->longText('description')->nullable(); // To store combined <jobDescription> HTML values
            $table->string('employment_type')->nullable(); // <employmentType>
            $table->string('seniority')->nullable(); // <seniority>
            $table->string('schedule')->nullable(); // <schedule>
            $table->string('years_of_experience')->nullable(); // <yearsOfExperience> (string to handle ranges like '2-5')
            $table->text('keywords')->nullable(); // <keywords> (using text for potentially long comma-separated lists)
            $table->string('occupation')->nullable(); // <occupation>
            $table->string('occupation_category')->nullable(); // <occupationCategory>
            $table->timestamp('posted_at')->nullable(); // <createdAt> from the XML
            $table->timestamps(); // Laravel's standard created_at and updated_at
        });

        // --- Add Dummy Data ---
        // Note: Using Seeders is generally preferred for data population.
        $now = Carbon::now(); // Get the current timestamp

        DB::table('job_posts')->insert([
            [
                'external_id' => 'XYZ1001',
                'subcompany' => 'Tech Division',
                'office' => 'Main Office',
                'department' => 'Engineering',
                'recruiting_category' => 'Software Development',
                'name' => 'Senior Backend Engineer (PHP/Laravel)',
                'description' => '<h1>About the Role</h1><p>We are seeking an experienced Backend Engineer...</p><ul><li>Develop APIs</li><li>Maintain Databases</li></ul>',
                'employment_type' => 'Full-time',
                'seniority' => 'Senior',
                'schedule' => 'Regular',
                'years_of_experience' => '5+',
                'keywords' => 'PHP, Laravel, MySQL, API, Backend, Engineer',
                'occupation' => 'Software Developer',
                'occupation_category' => 'Information Technology',
                'posted_at' => $now->subDays(5), // Posted 5 days ago
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'external_id' => 'MKT2023',
                'subcompany' => 'Marketing Solutions',
                'office' => 'Downtown Branch',
                'department' => 'Marketing',
                'recruiting_category' => 'Digital Marketing',
                'name' => 'Digital Marketing Specialist',
                'description' => '<h2>Join Our Team!</h2><p>Looking for a creative Digital Marketing Specialist to manage campaigns...</p>',
                'employment_type' => 'Full-time',
                'seniority' => 'Mid-Senior level',
                'schedule' => 'Regular',
                'years_of_experience' => '3-5',
                'keywords' => 'SEO, SEM, PPC, Social Media, Content Marketing, Google Analytics',
                'occupation' => 'Marketing Specialist',
                'occupation_category' => 'Marketing & Advertising',
                'posted_at' => $now->subDays(2), // Posted 2 days ago
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'external_id' => 'DES500',
                'subcompany' => 'Creative Labs',
                'office' => 'Remote',
                'department' => 'Design',
                'recruiting_category' => 'User Experience',
                'name' => 'UX/UI Designer',
                'description' => '<h3>Job Overview</h3><p>Design intuitive and engaging user interfaces for web and mobile applications.</p><p>Requires portfolio submission.</p>',
                'employment_type' => 'Contract',
                'seniority' => 'Associate',
                'schedule' => 'Flexible',
                'years_of_experience' => '2+',
                'keywords' => 'UX, UI, Figma, Sketch, Prototyping, User Research, Web Design, Mobile Design',
                'occupation' => 'Designer',
                'occupation_category' => 'Design',
                'posted_at' => $now->subDay(), // Posted yesterday
                'created_at' => $now,
                'updated_at' => $now,
            ],
             [
                'external_id' => null, // Example with no external ID
                'subcompany' => 'General Administration',
                'office' => 'Main Office',
                'department' => 'Human Resources',
                'recruiting_category' => 'Administration',
                'name' => 'HR Assistant',
                'description' => '<p>Assist the HR department with daily administrative tasks.</p>',
                'employment_type' => 'Part-time',
                'seniority' => 'Entry level',
                'schedule' => 'Part-time (20 hours/week)',
                'years_of_experience' => '0-1',
                'keywords' => 'HR, Human Resources, Admin, Assistant, Records',
                'occupation' => 'Administrative Assistant',
                'occupation_category' => 'Administration & Office Support',
                'posted_at' => $now, // Posted today
                'created_at' => $now,
                'updated_at' => $now,
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