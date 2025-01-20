import { Link } from '@inertiajs/react';

export default function Pagination({ links }) {
    return (
        <div className="flex flex-wrap justify-center gap-1">
            {links.map((link, key) => {
                return (
                    <Link
                        key={key}
                        href={link.url}
                        className={`px-4 py-2 text-sm border rounded-md ${
                            link.active
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-100'
                        } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                        dangerouslySetInnerHTML={{
                            __html: link.label,
                        }}
                    />
                );
            })}
        </div>
    );
} 