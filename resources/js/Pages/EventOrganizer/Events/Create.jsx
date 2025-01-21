import { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import TextArea from '@/Components/TextArea';
import GoogleMapPicker from '@/Components/GoogleMapPicker';

export default function Create({ auth }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        description: '',
        event_date: '',
        location: '',
        latitude: '',
        longitude: '',
        capacity: '',
        image: null,
        is_paid: false,
        price: '',
    });

    const openInGoogleMaps = () => {
        if (data.latitude && data.longitude) {
            const url = `https://www.google.com/maps/search/?api=1&query=${data.latitude},${data.longitude}`;
            window.open(url, '_blank');
        }
    };

    const submit = (e) => {
        e.preventDefault();
        
        post(route('event-organizer.events.store'), {
            forceFormData: true,
            onSuccess: () => {
                reset();
                router.visit(route('event-organizer.events.index'));
            },
            preserveScroll: true,
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setData('image', file);
    };

    const handleLocationSelect = (locationData) => {
        setData(data => ({
            ...data,
            location: locationData.address,
            latitude: locationData.coordinates.lat,
            longitude: locationData.coordinates.lng
        }));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-white">Create Event</h2>}
        >
            <Head title="Create Event" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg">
                        <div className="p-6">
                            <form onSubmit={submit} className="space-y-6" encType="multipart/form-data">
                                <div>
                                    <InputLabel htmlFor="title" value="Event Title" />
                                    <TextInput
                                        id="title"
                                        type="text"
                                        name="title"
                                        value={data.title}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('title', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.title} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="description" value="Description" />
                                    <TextArea
                                        id="description"
                                        name="description"
                                        value={data.description}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('description', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.description} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="event_date" value="Event Date" />
                                    <TextInput
                                        id="event_date"
                                        type="datetime-local"
                                        name="event_date"
                                        value={data.event_date}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('event_date', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.event_date} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="location" value="Location" />
                                    <div className="mt-1">
                                        <GoogleMapPicker onLocationSelect={handleLocationSelect} />
                                    </div>
                                    <div className="mt-4 flex items-center space-x-2">
                                        <TextInput
                                            id="location"
                                            type="text"
                                            name="location"
                                            value={data.location}
                                            className="block w-full"
                                            onChange={(e) => setData('location', e.target.value)}
                                            required
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
                                        required
                                        min="1"
                                    />
                                    <InputError message={errors.capacity} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="is_paid" value="Event Type" />
                                    <div className="mt-2">
                                        <div className="flex items-center space-x-4">
                                            <label className="inline-flex items-center">
                                                <input
                                                    type="radio"
                                                    name="is_paid"
                                                    checked={!data.is_paid}
                                                    onChange={() => setData('is_paid', false)}
                                                    className="text-purple-600 focus:ring-purple-500 dark:bg-gray-900"
                                                />
                                                <span className="ml-2 text-gray-700 dark:text-gray-300">Free Event</span>
                                            </label>
                                            <label className="inline-flex items-center">
                                                <input
                                                    type="radio"
                                                    name="is_paid"
                                                    checked={data.is_paid}
                                                    onChange={() => setData('is_paid', true)}
                                                    className="text-purple-600 focus:ring-purple-500 dark:bg-gray-900"
                                                />
                                                <span className="ml-2 text-gray-700 dark:text-gray-300">Paid Event</span>
                                            </label>
                                        </div>
                                    </div>
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
                                            required={data.is_paid}
                                            min="0"
                                            placeholder="0.00"
                                        />
                                        <InputError message={errors.price} className="mt-2" />
                                    </div>
                                )}

                                <div>
                                    <InputLabel htmlFor="image" value="Event Image" />
                                    <input
                                        id="image"
                                        type="file"
                                        name="image"
                                        onChange={handleImageChange}
                                        className="mt-1 block w-full rounded-lg border border-gray-300 bg-white p-2 text-sm text-gray-700 file:mr-4 file:rounded-md file:border-0 file:bg-purple-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-purple-700 hover:file:bg-purple-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:file:bg-gray-600 dark:file:text-gray-100"
                                        accept="image/*"
                                    />
                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                        Upload an image for your event (PNG, JPG up to 2MB)
                                    </p>
                                    <InputError message={errors.image} className="mt-2" />
                                </div>

                                <div className="flex items-center justify-end">
                                    <PrimaryButton disabled={processing}>
                                        Create Event
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 