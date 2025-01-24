import { useState, useEffect } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link } from '@inertiajs/react';
import NavLink from '@/Components/NavLink';
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import WalletConnect from '@/Components/WalletConnect';

export default function Authenticated({ user, header, children }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        // Check local storage or system preference on mount
        const darkModePreference = localStorage.getItem('darkMode') === 'true' || 
            (!('darkMode' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
        setIsDarkMode(darkModePreference);
        if (darkModePreference) {
            document.documentElement.classList.add('dark');
        }
    }, []);

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
        if (!isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('darkMode', 'true');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('darkMode', 'false');
        }
    };

    // Helper function to determine the profile route based on the current path
    const getProfileRoute = () => {
        if (window.location.pathname.startsWith('/admin')) {
            return 'admin.profile.edit';
        } else if (window.location.pathname.startsWith('/event-organizer')) {
            return 'event-organizer.profile.edit';
        }
        return 'user.profile.edit';
    };

    // Helper function to determine the logout route based on the current path
    const getLogoutRoute = () => {
        if (window.location.pathname.startsWith('/admin')) {
            return 'admin.logout';
        } else if (window.location.pathname.startsWith('/event-organizer')) {
            return 'event-organizer.logout';
        }
        return 'logout';
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <nav className="border-b border-gray-100 bg-white dark:border-gray-700 dark:bg-gray-800">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href="/">
                                    <h1 className="bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-400 bg-clip-text text-2xl font-extrabold tracking-tight text-transparent transition-all duration-300 hover:scale-105 hover:from-purple-500 hover:via-pink-400 hover:to-indigo-500">
                                        Event Management
                                    </h1>
                                </Link>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            {/* Only show wallet connect for regular users */}
                            {!window.location.pathname.startsWith('/event-organizer') && 
                             !window.location.pathname.startsWith('/admin') && (
                                <WalletConnect />
                            )}

                            {/* Dark Mode Toggle */}
                            <button
                                onClick={toggleDarkMode}
                                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
                            >
                                {isDarkMode ? (
                                    <SunIcon className="h-5 w-5" />
                                ) : (
                                    <MoonIcon className="h-5 w-5" />
                                )}
                            </button>

                            <div className="relative ml-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none dark:bg-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
                                            >
                                                {user?.name || user?.username}

                                                <svg
                                                    className="ml-2 -mr-0.5 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link href={route(getProfileRoute())}>
                                            Profile
                                        </Dropdown.Link>
                                        <Dropdown.Link href={route(getLogoutRoute())} method="post" as="button">
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white shadow dark:bg-gray-800">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main className="dark:bg-gray-900">{children}</main>
        </div>
    );
}
