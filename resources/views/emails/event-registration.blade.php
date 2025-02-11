<!DOCTYPE html>
<html>
<head>
    <title>Event Registration Confirmation</title>
</head>
<body>
    <h1>Thank you for registering, {{ $userName }}!</h1>
    
    <p>Your registration for the following event has been confirmed:</p>
    
    <div style="margin: 20px 0; padding: 20px; background-color: #f8f9fa; border-radius: 5px;">
        <h2>{{ $eventName }}</h2>
        <p><strong>Date:</strong> {{ $eventDate }}</p>
        <p><strong>Location:</strong> {{ $eventLocation }}</p>
    </div>

    <p>Please keep this email for your reference.</p>

    <p>If you need to cancel your registration or have any questions, please log in to your account.</p>

    <p>Best regards,<br>
    Event Management Team</p>
</body>
</html> 