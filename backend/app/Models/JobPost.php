<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JobPost extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'external_id',
        'subcompany',
        'office',
        'department',
        'recruiting_category',
        'name',
        'description',
        'employment_type',
        'seniority',
        'schedule',
        'years_of_experience',
        'keywords',
        'occupation',
        'occupation_category',
        'status',
        'posted_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'posted_at' => 'datetime',
        // No need to cast other string types
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        // Laravel's default timestamps are often hidden
        'created_at',
        'updated_at',
    ];

    /**
     * Define any relationships with other models here if needed.
     * For example:
     *
     * public function applications()
     * {
     * return $this->hasMany(Application::class);
     * }
     */
}