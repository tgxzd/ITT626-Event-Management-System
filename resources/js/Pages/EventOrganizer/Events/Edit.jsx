import { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { CalendarDaysIcon } from '@heroicons/react/24/outline';

export default function Edit({ auth, event }) {
    const [imagePreview, setImagePreview] = useState(event.image_url);

    const { data, setData, post, processing, errors } = useForm({
        title: event.title,
        description: event.description,
        event_date: event.event_date,
        location: event.location,
        capacity: event.capacity,
        status: event.status || 'draft',
        image: null,
        _method: 'PATCH'
    });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setData('image', file);
        
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        
        post(route('event-organizer.events.update', event.id), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                router.visit(route('event-organizer.events.show', event.id));
            },
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Edit Event
                    </h2>
                    <Link
                        href={route('event-organizer.events.index')}
                        className="rounded-md bg-gray-600 px-4 py-2 text-white transition hover:bg-gray-700"
                    >
                        Back to Events
                    </Link>
                </div>
            }
        >
            <Head title="Edit Event" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <form onSubmit={submit} className="space-y-6" encType="multipart/form-data">
                                {/* Image Preview */}
                                <div>
                                    <InputLabel htmlFor="image" value="Event Image" />
                                    <div className="mt-2">
                                        <div className="mb-4 overflow-hidden rounded-lg">
                                            {imagePreview ? (
                                                <img
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    className="h-[300px] w-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-[300px] w-full items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500">
                                                    <CalendarDaysIcon className="h-16 w-16 text-white opacity-75" />
                                                </div>
                                            )}
                                        </div>
                                        <input
                                            type="file"
                                            id="image"
                                            name="image"
                                            onChange={handleImageChange}
                                            className="mt-1 block w-full rounded-lg border border-gray-300 bg-white p-2 text-sm text-gray-700 file:mr-4 file:rounded-md file:border-0 file:bg-purple-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-purple-700 hover:file:bg-purple-100"
                                            accept="image/*"
                                        />
                                        <p className="mt-1 text-sm text-gray-500">
                                            Upload a new image for your event (PNG, JPG up to 2MB)
                                        </p>
                                    </div>
                                    <InputError message={errors.image} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="title" value="Event Name" />
                                    <TextInput
                                        id="title"
                                        type="text"
                                        name="title"
                                        value={data.title}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('title', e.target.value)}
                                    />
                                    <InputError message={errors.title} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="description" value="Description" />
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={data.description}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        rows="4"
                                        onChange={(e) => setData('description', e.target.value)}
                                    />
                                    <InputError message={errors.description} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="event_date" value="Date" />
                                    <TextInput
                                        id="event_date"
                                        type="datetime-local"
                                        name="event_date"
                                        value={data.event_date}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('event_date', e.target.value)}
                                    />
                                    <InputError message={errors.event_date} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="location" value="Location" />
                                    <TextInput
                                        id="location"
                                        type="text"
                                        name="location"
                                        value={data.location}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('location', e.target.value)}
                                    />
                                    <InputError message={errors.location} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="capacity" value="Capacity" />
                                    <TextInput
                                        id="capacity"
                                        type="number"
                                        name="capacity"
                                        value={data.capacity}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('capacity', e.target.value)}
                                    />
                                    <InputError message={errors.capacity} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="status" value="Status" />
                                    <select
                                        id="status"
                                        name="status"
                                        value={data.status}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        onChange={(e) => setData('status', e.target.value)}
                                    >
                                        <option value="draft">Draft</option>
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                    <InputError message={errors.status} className="mt-2" />
                                </div>

                                <div className="flex items-center gap-4">
                                    <PrimaryButton disabled={processing}>Save Changes</PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 