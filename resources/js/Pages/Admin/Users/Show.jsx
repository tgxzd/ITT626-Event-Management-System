import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ auth, user }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    User Details
                </h2>
            }
        >
            <Head title="User Details" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="mb-6">
                                <Link
                                    href={route('admin.users.index')}
                                    className="text-indigo-600 hover:text-indigo-900"
                                >
                                    ← Back to Users
                                </Link>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">User Information</h3>
                                    <div className="mt-4 space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Name</label>
                                            <div className="mt-1 text-sm text-gray-900">{user.name}</div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Email</label>
                                            <div className="mt-1 text-sm text-gray-900">{user.email}</div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">Additional Information</h3>
                                    <div className="mt-4 space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Joined Date</label>
                                            <div className="mt-1 text-sm text-gray-900">{user.created_at}</div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Last Updated</label>
                                            <div className="mt-1 text-sm text-gray-900">{user.updated_at}</div>
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