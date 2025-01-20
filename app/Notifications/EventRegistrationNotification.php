<?php

namespace App\Notifications;

use App\Models\Event;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class EventRegistrationNotification extends Notification
{
    use Queueable;

    public function __construct(private Event $event)
    {
    }

    public function via($notifiable): array
    {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Event Registration Confirmation')
            ->line('Thank you for registering for ' . $this->event->title)
            ->line('Event Details:')
            ->line('Date: ' . $this->event->event_date->format('F j, Y g:i A'))
            ->line('Venue: ' . $this->event->venue)
            ->action('View Event Details', url('/events/' . $this->event->id))
            ->line('We look forward to seeing you at the event!');
    }
} 