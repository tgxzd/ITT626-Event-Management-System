import { useState, useEffect, useRef } from 'react';

const GoogleMapPicker = ({ onLocationSelect, initialLocation }) => {
    const mapRef = useRef(null);
    const [map, setMap] = useState(null);
    const [marker, setMarker] = useState(null);
    const [searchBox, setSearchBox] = useState(null);
    const searchInputRef = useRef(null);

    // Default to a central location if none provided
    const defaultLocation = { lat: -6.200000, lng: 106.816666 }; // Jakarta coordinates
    const [selectedLocation, setSelectedLocation] = useState(initialLocation || defaultLocation);

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
            <input
                ref={searchInputRef}
                type="text"
                placeholder="Search for a location"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
            />
            <div
                ref={mapRef}
                className="h-[400px] w-full rounded-lg border border-gray-300 dark:border-gray-700"
            />
        </div>
    );
};

export default GoogleMapPicker; 