import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { CalendarDaysIcon, MapPinIcon, UserIcon, UserGroupIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

export default function Show({ auth, event }) {
    const { post, processing } = useForm();

    const handleRegistration = () => {
        let message = event.is_paid 
            ? `This is a paid event. The registration fee is RM ${parseFloat(event.price).toFixed(2)}. Proceed with registration?`
            : 'Are you sure you want to register for this event?';

        if (confirm(message)) {
            post(route('events.register', event.id));
        }
    };

    const handleCancellation = () => {
        if (confirm('Are you sure you want to cancel your registration?')) {
            post(route('events.cancel', event.id));
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'draft':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'inactive':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-white">
                        Event Details
                    </h2>
                    <Link
                        href={route('dashboard')}
                        className="rounded-md bg-gray-600 px-4 py-2 text-white transition hover:bg-gray-700"
                    >
                        Back to Events
                    </Link>
                </div>
            }
        >
            <Head title={`Event - ${event.title}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg">
                        <div className="p-6">
                            {/* Event Image */}
                            <div className="mb-8 overflow-hidden rounded-lg">
                                {event.image_url ? (
                                    <img
                                        src={event.image_url}
                                        alt={event.title}
                                        className="h-[400px] w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-[400px] w-full items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500">
                                        <CalendarDaysIcon className="h-20 w-20 text-white opacity-75" />
                                    </div>
                                )}
                            </div>

                            {/* Event Status and Registration */}
                            <div className="mb-6 flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${getStatusColor(event.status)}`}>
                                        {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                                    </span>
                                    {event.is_paid && (
                                        <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                            <CurrencyDollarIcon className="mr-1 h-4 w-4" />
                                            RM {parseFloat(event.price).toFixed(2)}
                                        </span>
                                    )}
                                </div>

                                {event.is_registered ? (
                                    <button
                                        onClick={handleCancellation}
                                        disabled={processing}
                                        className="rounded-lg bg-red-600 px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
                                    >
                                        Cancel Registration
                                    </button>
                                ) : event.available_spots > 0 ? (
                                    <button
                                        onClick={handleRegistration}
                                        disabled={processing}
                                        className="rounded-lg bg-purple-600 px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-purple-700 disabled:opacity-50"
                                    >
                                        {event.is_paid ? 'Pay & Register' : 'Register for Event'}
                                    </button>
                                ) : (
                                    <span className="rounded-lg bg-gray-100 px-6 py-2 text-sm font-semibold text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                                        Event Full
                                    </span>
                                )}
                            </div>

                            {/* Event Details */}
                            <div className="space-y-6">
                                <div>
                                    <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">{event.title}</h1>
                                    <p className="text-lg text-gray-600 dark:text-gray-300">{event.description}</p>
                                </div>

                                <div className="grid gap-6 sm:grid-cols-3">
                                    <div className="flex items-center space-x-2">
                                        <CalendarDaysIcon className="h-5 w-5 text-gray-400" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Date & Time</p>
                                            <p className="text-sm text-gray-900 dark:text-gray-300">{formatDate(event.event_date)}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <MapPinIcon className="h-5 w-5 text-gray-400" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Location</p>
                                            <p className="text-sm text-gray-900 dark:text-gray-300">{event.location}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <UserIcon className="h-5 w-5 text-gray-400" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Organizer</p>
                                            <p className="text-sm text-gray-900 dark:text-gray-300">{event.organizer.name}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Additional Event Information */}
                                <div className="mt-8 rounded-lg bg-purple-50 p-6 dark:bg-purple-900/20">
                                    <h3 className="mb-4 text-lg font-semibold text-purple-900 dark:text-purple-100">Event Information</h3>
                                    <div className="grid gap-6 sm:grid-cols-2">
                                        <div>
                                            <p className="text-sm font-medium text-purple-900 dark:text-purple-200">Total Capacity</p>
                                            <p className="text-sm text-purple-800 dark:text-purple-300">{event.capacity} attendees</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-purple-900 dark:text-purple-200">Available Spots</p>
                                            <p className="text-sm text-purple-800 dark:text-purple-300">{event.available_spots} spots remaining</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 