<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'organizer_id',
        'title',
        'description',
        'event_date',
        'location',
        'latitude',
        'longitude',
        'capacity',
        'status',
        'image',
        'is_paid',
        'price',
    ];

    protected $casts = [
        'event_date' => 'datetime',
        'is_paid' => 'boolean',
        'price' => 'decimal:2',
    ];

    protected $appends = ['image_url'];

    /**
     * Get the organizer that owns the event.
     */
    public function organizer(): BelongsTo
    {
        return $this->belongsTo(EventOrganizer::class, 'organizer_id');
    }

    /**
     * Get the URL for the event image.
     */
    public function getImageUrlAttribute()
    {
        if (!$this->image) {
            return null;
        }
        return Storage::url($this->image);
    }

    /**
     * Get the registrations for the event.
     */
    public function registrations(): HasMany
    {
        return $this->hasMany(EventRegistration::class);
    }

    /**
     * Check if a user is registered for this event.
     */
    public function isUserRegistered($userId): bool
    {
        return $this->registrations()
            ->where('user_id', $userId)
            ->where('status', 'registered')
            ->exists();
    }

    /**
     * Get the number of available spots.
     */
    public function getAvailableSpotsAttribute(): int
    {
        $registeredCount = $this->registrations()
            ->where('status', 'registered')
            ->count();
        
        return max(0, $this->capacity - $registeredCount);
    }
} 