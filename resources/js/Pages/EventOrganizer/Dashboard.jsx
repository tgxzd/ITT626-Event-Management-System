import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { UserGroupIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

export default function Dashboard({ auth, eventStats }) {
    const [processing, setProcessing] = useState(false);

    const handleDelete = (eventId) => {
        if (confirm('Are you sure you want to delete this event?')) {
            setProcessing(true);
            router.delete(route('event-organizer.events.destroy', eventId), {
                onSuccess: () => {
                    router.reload();
                },
            });
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

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-white">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Welcome Section */}
                    <div className="mb-6 overflow-hidden rounded-lg bg-white shadow-sm dark:bg-gray-800">
                        <div className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                Welcome back, {auth.user.name}!
                            </h3>
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                Manage your events from your dashboard.
                            </p>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="mb-6 overflow-hidden rounded-lg bg-white shadow-sm dark:bg-gray-800">
                        <div className="p-6">
                            <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Quick Actions</h3>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <Link
                                    href={route('event-organizer.events.create')}
                                    className="inline-flex items-center justify-center rounded-md bg-purple-600 px-4 py-2 text-white transition hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-400"
                                >
                                    Create New Event
                                </Link>
                                <Link
                                    href={route('event-organizer.profile.edit')}
                                    className="inline-flex items-center justify-center rounded-md bg-gray-600 px-4 py-2 text-white transition hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600"
                                >
                                    Edit Profile
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Events List */}
                    <div className="overflow-hidden rounded-lg bg-white shadow-sm dark:bg-gray-800">
                        <div className="p-6">
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Recent Events</h3>
                                <Link
                                    href={route('event-organizer.events.index')}
                                    className="text-sm text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
                                >
                                    View All Events →
                                </Link>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-900">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                                Event Name
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                                Date
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                                Registrations
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                                        {eventStats?.recentEvents?.map((event) => (
                                            <tr key={event.id}>
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {event.title}
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <div className="text-sm text-gray-900 dark:text-gray-300">
                                                        {formatDate(event.event_date)}
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 
                                                        ${event.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                                                        event.status === 'draft' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : 
                                                        'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                                                        {event.status}
                                                    </span>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <div className="text-sm text-gray-900 dark:text-gray-300">
                                                        {event.registrations?.length || 0} / {event.capacity}
                                                        <Link
                                                            href={route('event-organizer.events.registrations', event.id)}
                                                            className="ml-2 text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
                                                        >
                                                            View List
                                                        </Link>
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                                                    <div className="flex space-x-3">
                                                        <Link
                                                            href={route('event-organizer.events.show', event.id)}
                                                            className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
                                                        >
                                                            View
                                                        </Link>
                                                        <Link
                                                            href={route('event-organizer.events.edit', event.id)}
                                                            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                                        >
                                                            Edit
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(event.id)}
                                                            disabled={processing}
                                                            className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 