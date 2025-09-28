import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const EmergencyMapView = ({ 
  userLocation = { lat: 40.7128, lng: -74.0060 },
  nearbyVolunteers = [],
  onLocationUpdate = () => {},
  isEmergencyActive = false
}) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [locationError, setLocationError] = useState(null);

  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => setMapLoaded(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleLocationRefresh = () => {
    if (navigator.geolocation) {
      navigator.geolocation?.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position?.coords?.latitude,
            lng: position?.coords?.longitude
          };
          onLocationUpdate(newLocation);
          setLocationError(null);
        },
        (error) => {
          setLocationError("Unable to get current location");
        }
      );
    } else {
      setLocationError("Geolocation not supported");
    }
  };

  return (
    <div className="relative w-full h-96 lg:h-[500px] bg-muted rounded-lg overflow-hidden">
      {/* Map Container */}
      <div className="absolute inset-0">
        {mapLoaded ? (
          <iframe
            width="100%"
            height="100%"
            loading="lazy"
            title="Emergency Location Map"
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.google.com/maps?q=${userLocation?.lat},${userLocation?.lng}&z=15&output=embed`}
            className="border-0"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-muted">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Loading emergency map...</p>
            </div>
          </div>
        )}
      </div>
      {/* Map Overlays */}
      {mapLoaded && (
        <>
          {/* Location Controls */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <button
              onClick={handleLocationRefresh}
              className="w-10 h-10 bg-card border border-border rounded-lg shadow-emergency-sm flex items-center justify-center hover:bg-muted transition-colors duration-150"
              title="Refresh location"
            >
              <Icon name="RotateCcw" size={18} className="text-foreground" />
            </button>
            
            <div className="w-10 h-10 bg-card border border-border rounded-lg shadow-emergency-sm flex items-center justify-center">
              <Icon name="MapPin" size={18} className="text-primary" />
            </div>
          </div>

          {/* Volunteer Count Indicator */}
          <div className="absolute top-4 left-4 bg-card border border-border rounded-lg px-3 py-2 shadow-emergency-sm">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-success rounded-full mr-2" />
              <span className="text-sm font-medium text-foreground">
                {nearbyVolunteers?.length} volunteers nearby
              </span>
            </div>
          </div>

          {/* Emergency Status Overlay */}
          {isEmergencyActive && (
            <div className="absolute bottom-4 left-4 right-4 bg-primary/90 text-primary-foreground rounded-lg p-3 shadow-emergency-md">
              <div className="flex items-center">
                <Icon name="AlertTriangle" size={20} className="mr-2 animate-pulse" />
                <div className="flex-1">
                  <p className="font-semibold text-sm">Emergency Alert Active</p>
                  <p className="text-xs opacity-90">Broadcasting to nearby volunteers...</p>
                </div>
                <div className="w-3 h-3 bg-primary-foreground rounded-full animate-pulse-emergency" />
              </div>
            </div>
          )}

          {/* Location Error */}
          {locationError && (
            <div className="absolute bottom-4 left-4 right-4 bg-destructive/90 text-destructive-foreground rounded-lg p-3 shadow-emergency-md">
              <div className="flex items-center">
                <Icon name="AlertCircle" size={18} className="mr-2" />
                <p className="text-sm">{locationError}</p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default EmergencyMapView;