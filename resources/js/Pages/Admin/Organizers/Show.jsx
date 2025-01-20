import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ auth, organizer }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Event Organizer Details
                </h2>
            }
        >
            <Head title="Event Organizer Details" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="mb-6">
                                <Link
                                    href={route('admin.organizers.index')}
                                    className="text-indigo-600 hover:text-indigo-900"
                                >
                                    ← Back to Organizers
                                </Link>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">Organizer Information</h3>
                                    <div className="mt-4 space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Name</label>
                                            <div className="mt-1 text-sm text-gray-900">{organizer.name}</div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Email</label>
                                            <div className="mt-1 text-sm text-gray-900">{organizer.email}</div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">Events</h3>
                                    <div className="mt-4">
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Title
                                                        </th>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Date
                                                        </th>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Location
                                                        </th>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Capacity
                                                        </th>
                                                        <th scope="col" className="relative px-6 py-3">
                                                            <span className="sr-only">Actions</span>
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {organizer.events.map((event) => (
                                                        <tr key={event.id}>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {event.title}
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="text-sm text-gray-900">
                                                                    {event.event_date}
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="text-sm text-gray-900">
                                                                    {event.location}
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="text-sm text-gray-900">
                                                                    {event.capacity}
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                                <Link
                                                                    href={route('admin.events.show', event.id)}
                                                                    className="text-indigo-600 hover:text-indigo-900"
                                                                >
                                                                    View
                                                                </Link>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">Additional Information</h3>
                                    <div className="mt-4 space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Joined Date</label>
                                            <div className="mt-1 text-sm text-gray-900">{organizer.created_at}</div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Last Updated</label>
                                            <div className="mt-1 text-sm text-gray-900">{organizer.updated_at}</div>
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