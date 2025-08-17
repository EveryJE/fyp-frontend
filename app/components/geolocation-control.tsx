import { useEffect, useState } from 'react';
import maplibregl, { Map, Marker } from 'maplibre-gl';
import { Crosshair } from 'lucide-react';
import { useLocationStore } from '~/hooks/use-location-store';
import useMapStore from '~/stores/use-map-store';
import { Button } from '~/components/ui/button';

// CSS for the control and pulsating marker
const geolocationStyles = `
  .geolocation-control {
    position: absolute;
    top: 8rem; /* Adjusted to position below NavigationView inputs */
    right: 20px;
    z-index: 1000; /* Higher z-index to avoid overlap */
    background: #ffffff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    padding: 8px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  .geolocation-control:hover {
    background: #f0f0f0;
  }
  .dark .geolocation-control {
    background: #1f2937; /* Tailwind gray-800 */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
  }
  .dark .geolocation-control:hover {
    background: #374151; /* Tailwind gray-700 */
  }
  .geolocation-control svg {
    color: #1d9bf0; /* Tailwind blue-500 */
    width: 20px;
    height: 20px;
  }
  .dark .geolocation-control svg {
    color: #60a5fa; /* Tailwind blue-400 */
  }
  .geolocation-marker {
    background-color: #1d9bf0;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 2px solid #ffffff;
    box-shadow: 0 0 8px 4px rgba(29, 155, 240, 0.5);
    animation: pulse 2s infinite;
  }
  .dark .geolocation-marker {
    background-color: #60a5fa;
    box-shadow: 0 0 8px 4px rgba(96, 165, 250, 0.5);
  }
  @keyframes pulse {
    0% { box-shadow: 0 0 8px 4px rgba(29, 155, 240, 0.5); }
    50% { box-shadow: 0 0 12px 6px rgba(29, 155, 240, 0.7); }
    100% { box-shadow: 0 0 8px 4px rgba(29, 155, 240, 0.5); }
  }
  .dark @keyframes pulse {
    0% { box-shadow: 0 0 8px 4px rgba(96, 165, 250, 0.5); }
    50% { box-shadow: 0 0 12px 6px rgba(96, 165, 250, 0.7); }
    100% { box-shadow: 0 0 8px 4px rgba(96, 165, 250, 0.5); }
  }
`;

interface GeolocationControlProps {
  map: Map | null;
}

const GeolocationControl: React.FC<GeolocationControlProps> = ({ map }) => {
  const [marker, setMarker] = useState<Marker | null>(null);
  const [watchId, setWatchId] = useState<number | null>(null);
  const setLocation = useLocationStore((state) => state.setLocation);

  useEffect(() => {
    // Inject styles
    const styleSheet = document.createElement('style');
    styleSheet.innerText = geolocationStyles;
    document.head.appendChild(styleSheet);

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  const startGeolocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    if (!map) {
      alert('Map is not initialized.');
      return;
    }

    const id = navigator.geolocation.watchPosition(
      (position) => {
        const { longitude, latitude } = position.coords;
        setLocation({ lng: longitude, lat: latitude });

        if (!marker) {
          const el = document.createElement('div');
          el.className = 'geolocation-marker';
          const newMarker = new maplibregl.Marker({ element: el })
            .setLngLat([longitude, latitude])
            .addTo(map);
          setMarker(newMarker);
        } else {
          marker.setLngLat([longitude, latitude]);
        }

        // Center the map on the user's location
        map.setCenter([longitude, latitude]);
      },
      (error) => {
        let message = 'Unable to retrieve location.';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = 'Location permission denied. Please enable location services.';
            break;
          case error.POSITION_UNAVAILABLE:
            message = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            message = 'Location request timed out.';
            break;
        }
        alert(message);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );

    setWatchId(id);
  };

  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
      if (marker) {
        marker.remove();
      }
    };
  }, [watchId, marker]);

  return (
    <Button
      variant="outline"
      size="icon"
      className="geolocation-control"
      onClick={startGeolocation}
      title="Locate Me"
      aria-label="Enable geolocation tracking"
    >
      <Crosshair className="lucide lucide-crosshair" />
    </Button>
  );
};

export default GeolocationControl;