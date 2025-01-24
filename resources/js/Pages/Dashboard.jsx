import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { CalendarDaysIcon, MapPinIcon, UserGroupIcon, MagnifyingGlassIcon, XMarkIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { useState, useCallback } from 'react';
import debounce from 'lodash/debounce';

export default function Dashboard({ auth, events, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [isFocused, setIsFocused] = useState(false);

    const debouncedSearch = useCallback(
        debounce((query) => {
            router.get(route('dashboard'), { search: query }, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            });
        }, 300),
        []
    );

    const handleSearch = (e) => {
        const query = e.target.value;
        setSearch(query);
        debouncedSearch(query);
    };

    const clearSearch = () => {
        setSearch('');
        debouncedSearch('');
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
                <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-white">
                        Events
                    </h2>
                    <div className="w-full max-w-md">
                        <div className={`relative rounded-xl bg-white shadow-sm transition-all duration-200 dark:bg-gray-800 ${
                            isFocused ? 'ring-2 ring-purple-500 ring-offset-2 dark:ring-offset-gray-900' : 'hover:ring-1 hover:ring-gray-300 dark:hover:ring-gray-600'
                        }`}>
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                <MagnifyingGlassIcon 
                                    className={`h-5 w-5 transition-colors duration-200 ${
                                        isFocused ? 'text-purple-500' : 'text-gray-400 dark:text-gray-500'
                                    }`} 
                                    aria-hidden="true" 
                                />
                            </div>
                            <input
                                type="text"
                                name="search"
                                value={search}
                                onChange={handleSearch}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                placeholder="Search events by name..."
                                className="block w-full rounded-xl border-0 bg-transparent py-3 pl-11 pr-10 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-0 dark:text-white dark:placeholder:text-gray-500 sm:text-sm sm:leading-6"
                            />
                            {search && (
                                <button
                                    onClick={clearSearch}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400"
                                >
                                    <span className="rounded-full bg-gray-100 p-1 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    </span>
                                </button>
                            )}
                        </div>
                        {search && (
                            <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                {events.length === 0 ? (
                                    <span>No results for "{search}"</span>
                                ) : (
                                    <span>Showing {events.length} result{events.length !== 1 ? 's' : ''} for "{search}"</span>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {events.length === 0 ? (
                        <div className="rounded-lg bg-white p-8 text-center shadow dark:bg-gray-800">
                            <CalendarDaysIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                            {search ? (
                                <>
                                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No events found</h3>
                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                        Try adjusting your search terms or browse all events.
                                    </p>
                                </>
                            ) : (
                                <>
                                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No events available</h3>
                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                        Check back later for upcoming events.
                                    </p>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {events.map((event) => (
                                <div key={event.id} className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
                                    <div className="h-48 overflow-hidden">
                                        {event.image_url ? (
                                            <img
                                                src={event.image_url}
                                                alt={event.title}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500">
                                                <CalendarDaysIcon className="h-12 w-12 text-white opacity-75" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-6">
                                        <div className="flex items-baseline justify-between">
                                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{event.title}</h3>
                                            <div className="flex items-center space-x-2">
                                                {event.is_paid ? (
                                                    <span className="inline-flex rounded-full bg-blue-100 px-2 text-xs font-semibold leading-5 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                                        <CurrencyDollarIcon className="mr-1 h-3 w-3" />
                                                        RM {parseFloat(event.price).toFixed(2)}
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800 dark:bg-green-900 dark:text-green-200">
                                                        Free
                                                    </span>
                                                )}
                                                {event.is_registered ? (
                                                    <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800 dark:bg-green-900 dark:text-green-200">
                                                        Registered
                                                    </span>
                                                ) : event.available_spots > 0 ? (
                                                    <span className="inline-flex rounded-full bg-blue-100 px-2 text-xs font-semibold leading-5 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                                        {event.available_spots} spots left
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex rounded-full bg-red-100 px-2 text-xs font-semibold leading-5 text-red-800 dark:bg-red-900 dark:text-red-200">
                                                        Full
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="mt-4 space-y-3">
                                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                                <CalendarDaysIcon className="mr-1.5 h-5 w-5 flex-shrink-0" />
                                                {formatDate(event.event_date)}
                                            </div>
                                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                                <MapPinIcon className="mr-1.5 h-5 w-5 flex-shrink-0" />
                                                {event.location}
                                            </div>
                                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                                <UserGroupIcon className="mr-1.5 h-5 w-5 flex-shrink-0" />
                                                By {event.organizer.name}
                                            </div>
                                        </div>
                                        <div className="mt-6">
                                            <Link
                                                href={route('events.show', event.id)}
                                                className="block w-full rounded-md bg-purple-600 px-4 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 dark:bg-purple-500 dark:hover:bg-purple-400"
                                            >
                                                View Details
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
