import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ auth, stats }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Admin Dashboard
                </h2>
            }
        >
            <Head title="Admin Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {/* Events Management Card */}
                                <div className="overflow-hidden rounded-lg bg-white shadow">
                                    <div className="p-5">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0">
                                                <svg className="h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <div className="ml-5 w-0 flex-1">
                                                <dl>
                                                    <dt className="truncate text-sm font-medium text-gray-500">Events</dt>
                                                    <dd>
                                                        <div className="text-lg font-medium text-gray-900">
                                                            {stats.totalEvents} Events
                                                        </div>
                                                    </dd>
                                                </dl>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 px-5 py-3">
                                        <div className="text-sm">
                                            <Link href={route('admin.events.index')} className="font-medium text-indigo-700 hover:text-indigo-900">
                                                View all events →
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                                {/* Event Organizers Management Card */}
                                <div className="overflow-hidden rounded-lg bg-white shadow">
                                    <div className="p-5">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0">
                                                <svg className="h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                </svg>
                                            </div>
                                            <div className="ml-5 w-0 flex-1">
                                                <dl>
                                                    <dt className="truncate text-sm font-medium text-gray-500">Event Organizers</dt>
                                                    <dd>
                                                        <div className="text-lg font-medium text-gray-900">
                                                            {stats.totalOrganizers} Organizers
                                                        </div>
                                                    </dd>
                                                </dl>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 px-5 py-3">
                                        <div className="text-sm">
                                            <Link href={route('admin.organizers.index')} className="font-medium text-indigo-700 hover:text-indigo-900">
                                                View all organizers →
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                                {/* Users Management Card */}
                                <div className="overflow-hidden rounded-lg bg-white shadow">
                                    <div className="p-5">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0">
                                                <svg className="h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                                </svg>
                                            </div>
                                            <div className="ml-5 w-0 flex-1">
                                                <dl>
                                                    <dt className="truncate text-sm font-medium text-gray-500">Users</dt>
                                                    <dd>
                                                        <div className="text-lg font-medium text-gray-900">
                                                            {stats.totalUsers} Users
                                                        </div>
                                                    </dd>
                                                </dl>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 px-5 py-3">
                                        <div className="text-sm">
                                            <Link href={route('admin.users.index')} className="font-medium text-indigo-700 hover:text-indigo-900">
                                                View all users →
                                            </Link>
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