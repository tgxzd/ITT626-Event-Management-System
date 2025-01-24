import { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { CalendarDaysIcon } from '@heroicons/react/24/outline';
import GoogleMapPicker from '@/Components/GoogleMapPicker';

export default function Edit({ auth, event }) {
    const [imagePreview, setImagePreview] = useState(event.image_url);

    const { data, setData, post, processing, errors } = useForm({
        title: event.title,
        description: event.description,
        event_date: event.event_date,
        location: event.location,
        latitude: event.latitude || '',
        longitude: event.longitude || '',
        capacity: event.capacity,
        status: event.status || 'draft',
        is_paid: event.is_paid || false,
        price: event.price || '',
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

    const handleLocationSelect = (locationData) => {
        setData(data => ({
            ...data,
            location: locationData.address,
            latitude: locationData.coordinates.lat,
            longitude: locationData.coordinates.lng
        }));
    };

    const openInGoogleMaps = () => {
        if (data.latitude && data.longitude) {
            const url = `https://www.google.com/maps/search/?api=1&query=${data.latitude},${data.longitude}`;
            window.open(url, '_blank');
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
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-white">
                        Edit Event
                    </h2>
                    <Link
                        href={route('event-organizer.dashboard')}
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
                    <div className="overflow-hidden bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg">
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
                                            className="mt-1 block w-full rounded-lg border border-gray-300 bg-white p-2 text-sm text-gray-700 file:mr-4 file:rounded-md file:border-0 file:bg-purple-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-purple-700 hover:file:bg-purple-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:file:bg-gray-600 dark:file:text-gray-100"
                                            accept="image/*"
                                        />
                                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
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
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
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
                                    <div className="mt-1">
                                        <GoogleMapPicker 
                                            onLocationSelect={handleLocationSelect}
                                            initialLocation={
                                                event.latitude && event.longitude
                                                    ? { lat: parseFloat(event.latitude), lng: parseFloat(event.longitude) }
                                                    : null
                                            }
                                        />
                                    </div>
                                    <div className="mt-4 flex items-center space-x-2">
                                        <TextInput
                                            id="location"
                                            type="text"
                                            name="location"
                                            value={data.location}
                                            className="block w-full"
                                            onChange={(e) => setData('location', e.target.value)}
                                            readOnly
                                        />
                                        {data.latitude && data.longitude && (
                                            <button
                                                type="button"
                                                onClick={openInGoogleMaps}
                                                className="inline-flex items-center rounded-md bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 dark:bg-purple-500 dark:hover:bg-purple-400"
                                            >
                                                Open in Maps
                                            </button>
                                        )}
                                    </div>
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
                                    <InputLabel value="Event Type" />
                                    <div className="mt-2 space-y-2">
                                        <label className="inline-flex items-center">
                                            <input
                                                type="radio"
                                                name="is_paid"
                                                checked={!data.is_paid}
                                                onChange={() => setData('is_paid', false)}
                                                className="rounded border-gray-300 text-purple-600 shadow-sm focus:ring-purple-500 dark:border-gray-700 dark:bg-gray-900 dark:focus:ring-purple-600"
                                            />
                                            <span className="ml-2 text-gray-700 dark:text-gray-300">Free Event</span>
                                        </label>
                                        <br />
                                        <label className="inline-flex items-center">
                                            <input
                                                type="radio"
                                                name="is_paid"
                                                checked={data.is_paid}
                                                onChange={() => setData('is_paid', true)}
                                                className="rounded border-gray-300 text-purple-600 shadow-sm focus:ring-purple-500 dark:border-gray-700 dark:bg-gray-900 dark:focus:ring-purple-600"
                                            />
                                            <span className="ml-2 text-gray-700 dark:text-gray-300">Paid Event</span>
                                        </label>
                                    </div>
                                    <InputError message={errors.is_paid} className="mt-2" />
                                </div>

                                {data.is_paid && (
                                    <div>
                                        <InputLabel htmlFor="price" value="Ticket Price (RM)" />
                                        <TextInput
                                            id="price"
                                            type="number"
                                            step="0.01"
                                            name="price"
                                            value={data.price}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData('price', e.target.value)}
                                            placeholder="0.00"
                                        />
                                        <InputError message={errors.price} className="mt-2" />
                                    </div>
                                )}

                                <div>
                                    <InputLabel htmlFor="status" value="Status" />
                                    <select
                                        id="status"
                                        name="status"
                                        value={data.status}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
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