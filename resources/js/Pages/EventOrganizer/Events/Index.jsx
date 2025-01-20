import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import DangerButton from '@/Components/DangerButton';
import SecondaryButton from '@/Components/SecondaryButton';

export default function Index({ auth, events }) {
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

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        My Events
                    </h2>
                    <Link
                        href={route('event-organizer.events.create')}
                        className="rounded-md bg-green-600 px-4 py-2 text-white transition hover:bg-green-700"
                    >
                        Create New Event
                    </Link>
                </div>
            }
        >
            <Head title="My Events" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {events.length === 0 ? (
                                <div className="py-8 text-center">
                                    <p className="text-lg text-gray-500">You haven't created any events yet.</p>
                                    <Link
                                        href={route('event-organizer.events.create')}
                                        className="mt-4 inline-block rounded-md bg-green-600 px-4 py-2 text-white transition hover:bg-green-700"
                                    >
                                        Create Your First Event
                                    </Link>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                    Event Name
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                    Date
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                    Location
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                    Status
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                    Registered Users
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white">
                                            {events.map((event) => (
                                                <tr key={event.id}>
                                                    <td className="whitespace-nowrap px-6 py-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {event.title}
                                                        </div>
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4">
                                                        <div className="text-sm text-gray-900">
                                                            {new Date(event.event_date).toLocaleString()}
                                                        </div>
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4">
                                                        <div className="text-sm text-gray-900">
                                                            {event.location}
                                                        </div>
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4">
                                                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 
                                                            ${event.status === 'active' ? 'bg-green-100 text-green-800' : 
                                                              event.status === 'draft' ? 'bg-yellow-100 text-yellow-800' : 
                                                              'bg-red-100 text-red-800'}`}>
                                                            {event.status}
                                                        </span>
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4">
                                                        <div className="text-sm text-gray-900">
                                                            {event.registrations.length} / {event.capacity}
                                                            <Link
                                                                href={route('event-organizer.events.registrations', event.id)}
                                                                className="ml-2 text-indigo-600 hover:text-indigo-900"
                                                            >
                                                                View Registrations
                                                            </Link>
                                                        </div>
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium space-x-2">
                                                        <Link
                                                            href={route('event-organizer.events.show', event.id)}
                                                            className="text-indigo-600 hover:text-indigo-900"
                                                        >
                                                            View
                                                        </Link>
                                                        <Link
                                                            href={route('event-organizer.events.edit', event.id)}
                                                            className="text-blue-600 hover:text-blue-900"
                                                        >
                                                            Edit
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(event.id)}
                                                            disabled={processing}
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            Delete
                                                        </button>
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