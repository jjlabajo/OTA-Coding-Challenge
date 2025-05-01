<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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
        'company',
        'office',
        'position',
        'description',
        'employment_type',
        'status',
        'user_id'
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

    /**
     * Get the user that created the job post.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}