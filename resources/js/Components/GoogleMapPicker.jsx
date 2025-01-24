import { useState, useEffect, useRef } from 'react';
import { MapPinIcon } from '@heroicons/react/24/outline';

const GoogleMapPicker = ({ onLocationSelect, initialLocation }) => {
    const mapRef = useRef(null);
    const [map, setMap] = useState(null);
    const [marker, setMarker] = useState(null);
    const [searchBox, setSearchBox] = useState(null);
    const searchInputRef = useRef(null);
    const [isLocating, setIsLocating] = useState(false);
    const [locationError, setLocationError] = useState(null);

    // Default to a central location if none provided
    const defaultLocation = { lat: -6.200000, lng: 106.816666 }; // Jakarta coordinates
    const [selectedLocation, setSelectedLocation] = useState(initialLocation || defaultLocation);

    const handleLocationError = (error) => {
        console.error('Error getting location:', error);
        setIsLocating(false);
        
        let errorMessage = '';
        switch (error.code) {
            case error.PERMISSION_DENIED:
                errorMessage = 'Location access was denied. Please follow these steps:\n\n' +
                    '1. Click the lock/info icon in your browser\'s address bar\n' +
                    '2. Click on "Site Settings"\n' +
                    '3. Find "Location" and change it to "Allow"\n' +
                    '4. Refresh the page and try again';
                break;
            case error.POSITION_UNAVAILABLE:
                errorMessage = 'Location information is unavailable. Please check your device\'s location settings and try again.';
                break;
            case error.TIMEOUT:
                errorMessage = 'Location request timed out. Please check your internet connection and try again.';
                break;
            default:
                errorMessage = 'An unknown error occurred while trying to get your location. Please try again.';
        }
        
        setLocationError(errorMessage);
        alert(errorMessage);
    };

    const getUserLocation = () => {
        setIsLocating(true);
        setLocationError(null);

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    
                    // Update map and marker
                    if (map && marker) {
                        map.setCenter(userLocation);
                        map.setZoom(17); // Zoom in closer when using user location
                        marker.setPosition(userLocation);
                        setSelectedLocation(userLocation);
                        getAddressFromCoordinates(userLocation);
                    }
                    setIsLocating(false);
                    setLocationError(null);
                },
                handleLocationError,
                {
                    enableHighAccuracy: true,
                    timeout: 10000, // Increased timeout to 10 seconds
                    maximumAge: 0
                }
            );
        } else {
            const errorMessage = 'Geolocation is not supported by your browser. Please try using a modern browser with location services enabled.';
            setLocationError(errorMessage);
            alert(errorMessage);
            setIsLocating(false);
        }
    };

    useEffect(() => {
        // Load Google Maps script
        const loadGoogleMapsScript = () => {
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`;
            script.async = true;
            script.defer = true;
            script.onload = initializeMap;
            document.head.appendChild(script);
        };

        if (!window.google) {
            loadGoogleMapsScript();
        } else {
            initializeMap();
        }
    }, []);

    const initializeMap = () => {
        if (!mapRef.current) return;

        // Create the map
        const newMap = new window.google.maps.Map(mapRef.current, {
            center: selectedLocation,
            zoom: 15,
            styles: [
                {
                    featureType: "poi",
                    elementType: "labels",
                    stylers: [{ visibility: "off" }],
                },
            ],
        });

        // Create the marker
        const newMarker = new window.google.maps.Marker({
            position: selectedLocation,
            map: newMap,
            draggable: true,
        });

        // Create the search box
        const input = searchInputRef.current;
        const newSearchBox = new window.google.maps.places.SearchBox(input);
        newMap.controls[window.google.maps.ControlPosition.TOP_CENTER].push(input);

        // Handle marker drag
        newMarker.addListener('dragend', () => {
            const position = newMarker.getPosition();
            const newLocation = {
                lat: position.lat(),
                lng: position.lng(),
            };
            setSelectedLocation(newLocation);
            getAddressFromCoordinates(newLocation);
        });

        // Handle place selection
        newSearchBox.addListener('places_changed', () => {
            const places = newSearchBox.getPlaces();
            if (places.length === 0) return;

            const place = places[0];
            if (!place.geometry || !place.geometry.location) return;

            // Update map and marker
            newMap.setCenter(place.geometry.location);
            newMarker.setPosition(place.geometry.location);

            const newLocation = {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
            };
            setSelectedLocation(newLocation);
            getAddressFromCoordinates(newLocation);
        });

        // Handle map click
        newMap.addListener('click', (e) => {
            const clickedLocation = {
                lat: e.latLng.lat(),
                lng: e.latLng.lng(),
            };
            newMarker.setPosition(clickedLocation);
            setSelectedLocation(clickedLocation);
            getAddressFromCoordinates(clickedLocation);
        });

        setMap(newMap);
        setMarker(newMarker);
        setSearchBox(newSearchBox);
    };

    const getAddressFromCoordinates = async (location) => {
        try {
            const geocoder = new window.google.maps.Geocoder();
            const response = await new Promise((resolve, reject) => {
                geocoder.geocode({ location }, (results, status) => {
                    if (status === 'OK') {
                        resolve(results);
                    } else {
                        reject(status);
                    }
                });
            });

            if (response[0]) {
                const address = response[0].formatted_address;
                onLocationSelect({
                    address,
                    coordinates: location
                });
            }
        } catch (error) {
            console.error('Error getting address:', error);
        }
    };

    return (
        <div className="w-full space-y-4">
            <div className="flex items-center space-x-2">
                <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search for a location or use the map"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                />
                <button
                    type="button"
                    onClick={getUserLocation}
                    disabled={isLocating}
                    className="inline-flex items-center rounded-md bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 dark:bg-purple-500 dark:hover:bg-purple-400 disabled:opacity-50"
                    title="Click to use your current location"
                >
                    <MapPinIcon className="mr-2 h-5 w-5" />
                    {isLocating ? 'Locating...' : 'Use My Location'}
                </button>
            </div>
            {locationError && (
                <div className="rounded-md bg-yellow-50 p-4 dark:bg-yellow-900">
                    <p className="text-sm text-yellow-700 dark:text-yellow-200">
                        {locationError}
                    </p>
                </div>
            )}
            <div
                ref={mapRef}
                className="h-[400px] w-full rounded-lg border border-gray-300 dark:border-gray-700"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400">
                You can set the location by: searching, clicking on the map, dragging the marker, or using your current location
            </p>
        </div>
    );
};

export default GoogleMapPicker; 