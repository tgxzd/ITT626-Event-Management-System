import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    return (
        <>
            <Head title="Welcome" />
            <div className="min-h-screen" style={{ backgroundColor: '#0A1017' }}>
                <div className="relative">
                    {/* Navigation */}
                  

                    {/* Main Content */}
                    <main className="flex flex-col items-center justify-center min-h-[80vh]">
                        <h1 
                            className="text-6xl font-bold mb-8" 
                            style={{ color: '#27A13C' }}
                        >
                            Welcome to Event Management System
                        </h1>
                        
                        <div className="max-w-3xl text-center">
                            <p className="text-gray-400 text-xl mb-8">
                                Plan, organize, and manage your events with ease
                            </p>
                            
                            <div className="flex gap-4 justify-center">
                                <Link
                                    href={route('login')}
                                    className="px-8 py-3 rounded-lg text-white text-lg transition"
                                    style={{ 
                                        backgroundColor: '#27A13C',
                                        hover: {
                                            backgroundColor: '#218A32'
                                        }
                                    }}
                                >
                                    Login
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="px-8 py-3 rounded-lg text-white text-lg border-2 transition hover:bg-white/10"
                                    style={{ borderColor: '#27A13C' }}
                                >
                                    Register
                                </Link>
                            </div>
                            
                            <div className="mt-8 flex gap-4 justify-center">
                                <Link
                                    href={route('event-organizer')}
                                    className="px-8 py-3 rounded-lg text-white text-lg border-2 transition hover:bg-white/10"
                                    style={{ borderColor: '#27A13C' }}
                                >
                                    Event Organizer
                                </Link>
                                <Link
                                    href={route('admin')}
                                    className="px-8 py-3 rounded-lg text-white text-lg border-2 transition hover:bg-white/10"
                                    style={{ borderColor: '#27A13C' }}
                                >
                                    Admin
                                </Link>
                            </div>
                        </div>
                    </main>

                    {/* Footer */}
                    <footer className="absolute bottom-0 w-full py-6 text-center text-gray-400">
                        <p>Event Management System v{laravelVersion} (PHP v{phpVersion})</p>
                    </footer>
                </div>
            </div>
        </>
    );
}
