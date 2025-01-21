import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { CalendarDaysIcon, MapPinIcon, UserGroupIcon } from '@heroicons/react/24/outline';

export default function Registrations({ auth, event }) {
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

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Event Registrations
                    </h2>
                    <Link
                        href={route('event-organizer.dashboard')}
                        className="rounded-md bg-gray-600 px-4 py-2 text-white transition hover:bg-gray-700"
                    >
                        Back to Events
                    </Link>
                </div>
            }
        >
            <Head title={`Registrations - ${event.title}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Event Summary Card */}
                    <div className="mb-6 overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900">{event.title}</h3>
                                    <div className="mt-2 flex space-x-4 text-sm text-gray-500">
                                        <div className="flex items-center">
                                            <CalendarDaysIcon className="mr-1.5 h-5 w-5" />
                                            {formatDate(event.event_date)}
                                        </div>
                                        <div className="flex items-center">
                                            <MapPinIcon className="mr-1.5 h-5 w-5" />
                                            {event.location}
                                        </div>
                                        <div className="flex items-center">
                                            <UserGroupIcon className="mr-1.5 h-5 w-5" />
                                            {event.registrations.length} / {event.capacity} registered
                                        </div>
                                    </div>
                                </div>
                                <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold 
                                    ${event.status === 'active' ? 'bg-green-100 text-green-800' : 
                                    event.status === 'draft' ? 'bg-yellow-100 text-yellow-800' : 
                                    'bg-red-100 text-red-800'}`}>
                                    {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Registrations List */}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="mb-4 text-lg font-medium text-gray-900">Registered Attendees</h3>
                            
                            {event.registrations.length === 0 ? (
                                <div className="rounded-lg bg-gray-50 py-8 text-center">
                                    <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No registrations</h3>
                                    <p className="mt-1 text-sm text-gray-500">No one has registered for this event yet.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                    Name
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                    Email
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                    Registration Date
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white">
                                            {event.registrations.map((registration) => (
                                                <tr key={registration.id}>
                                                    <td className="whitespace-nowrap px-6 py-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {registration.user.name}
                                                        </div>
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4">
                                                        <div className="text-sm text-gray-500">
                                                            {registration.user.email}
                                                        </div>
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4">
                                                        <div className="text-sm text-gray-500">
                                                            {formatDate(registration.created_at)}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 