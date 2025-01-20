import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ auth, event }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Event Details
                </h2>
            }
        >
            <Head title="Event Details" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="mb-6">
                                <Link
                                    href={route('admin.events.index')}
                                    className="text-indigo-600 hover:text-indigo-900"
                                >
                                    ← Back to Events
                                </Link>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">Event Information</h3>
                                    <div className="mt-4 space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Title</label>
                                            <div className="mt-1 text-sm text-gray-900">{event.title}</div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Description</label>
                                            <div className="mt-1 text-sm text-gray-900">{event.description}</div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Event Date</label>
                                            <div className="mt-1 text-sm text-gray-900">{event.event_date}</div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Location</label>
                                            <div className="mt-1 text-sm text-gray-900">{event.location}</div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Capacity</label>
                                            <div className="mt-1 text-sm text-gray-900">{event.capacity}</div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Status</label>
                                            <div className="mt-1">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                    ${event.status === 'active' ? 'bg-green-100 text-green-800' : 
                                                      event.status === 'draft' ? 'bg-yellow-100 text-yellow-800' : 
                                                      'bg-red-100 text-red-800'}`}>
                                                    {event.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">Organizer Information</h3>
                                    <div className="mt-4 space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Name</label>
                                            <div className="mt-1 text-sm text-gray-900">{event.organizer.name}</div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Email</label>
                                            <div className="mt-1 text-sm text-gray-900">{event.organizer.email}</div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">Additional Information</h3>
                                    <div className="mt-4 space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Created At</label>
                                            <div className="mt-1 text-sm text-gray-900">{event.created_at}</div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Last Updated</label>
                                            <div className="mt-1 text-sm text-gray-900">{event.updated_at}</div>
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