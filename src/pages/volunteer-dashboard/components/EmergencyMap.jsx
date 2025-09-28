import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const EmergencyMap = ({ 
  volunteerLocation = { lat: 40.7128, lng: -74.0060 },
  activeAlerts = [],
  onAlertClick = () => {},
  className = ""
}) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);

  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => setMapLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleAlertMarkerClick = (alert) => {
    setSelectedAlert(alert);
    onAlertClick(alert);
  };

  const getEmergencyIcon = (type) => {
    switch (type) {
      case 'health':
        return 'Heart';
      case 'fire':
        return 'Flame';
      case 'accident':
        return 'Car';
      case 'security':
        return 'Shield';
      default:
        return 'AlertTriangle';
    }
  };

  const getDistanceText = (distance) => {
    if (distance < 1000) {
      return `${Math.round(distance)}m away`;
    }
    return `${(distance / 1000)?.toFixed(1)}km away`;
  };

  return (
    <div className={`bg-card rounded-lg border border-border overflow-hidden ${className}`}>
      {/* Map Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Icon name="Map" size={20} className="text-primary mr-2" />
            <h3 className="font-semibold text-foreground">Emergency Map</h3>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <div className="w-2 h-2 bg-success rounded-full mr-2" />
            <span>Your location</span>
          </div>
        </div>
      </div>
      {/* Map Container */}
      <div className="relative h-80 lg:h-96">
        {!mapLoaded ? (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/20">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Loading map...</p>
            </div>
          </div>
        ) : (
          <iframe
            width="100%"
            height="100%"
            loading="lazy"
            title="Emergency Response Map"
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.google.com/maps?q=${volunteerLocation?.lat},${volunteerLocation?.lng}&z=14&output=embed`}
            className="w-full h-full"
          />
        )}

        {/* Map Overlay Controls */}
        <div className="absolute top-4 right-4 flex flex-col space-y-2">
          <button className="w-10 h-10 bg-card border border-border rounded-md shadow-sm flex items-center justify-center hover:bg-muted transition-colors duration-150">
            <Icon name="Plus" size={16} className="text-foreground" />
          </button>
          <button className="w-10 h-10 bg-card border border-border rounded-md shadow-sm flex items-center justify-center hover:bg-muted transition-colors duration-150">
            <Icon name="Minus" size={16} className="text-foreground" />
          </button>
          <button className="w-10 h-10 bg-card border border-border rounded-md shadow-sm flex items-center justify-center hover:bg-muted transition-colors duration-150">
            <Icon name="Navigation" size={16} className="text-foreground" />
          </button>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-card/95 backdrop-blur-sm border border-border rounded-md p-3 shadow-sm">
          <h4 className="text-xs font-semibold text-foreground mb-2">Legend</h4>
          <div className="space-y-1">
            <div className="flex items-center text-xs">
              <div className="w-3 h-3 bg-success rounded-full mr-2" />
              <span className="text-muted-foreground">Your location</span>
            </div>
            <div className="flex items-center text-xs">
              <div className="w-3 h-3 bg-primary rounded-full mr-2 animate-pulse" />
              <span className="text-muted-foreground">Active emergency</span>
            </div>
            <div className="flex items-center text-xs">
              <div className="w-3 h-3 bg-warning rounded-full mr-2" />
              <span className="text-muted-foreground">Other volunteers</span>
            </div>
          </div>
        </div>
      </div>
      {/* Active Alerts Summary */}
      {activeAlerts?.length > 0 && (
        <div className="p-4 border-t border-border">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-foreground">
              Active Alerts ({activeAlerts?.length})
            </h4>
            <button className="text-sm text-primary hover:text-primary/80 transition-colors duration-150">
              View all
            </button>
          </div>
          
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {activeAlerts?.slice(0, 3)?.map((alert) => (
              <div
                key={alert?.id}
                onClick={() => handleAlertMarkerClick(alert)}
                className="flex items-center justify-between p-2 bg-muted/30 rounded-md cursor-pointer hover:bg-muted/50 transition-colors duration-150"
              >
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mr-2">
                    <Icon 
                      name={getEmergencyIcon(alert?.type)} 
                      size={12} 
                      className="text-primary" 
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground capitalize">
                      {alert?.type} Alert
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {alert?.location}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-medium text-primary">
                  {getDistanceText(alert?.distance)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* No Alerts State */}
      {activeAlerts?.length === 0 && (
        <div className="p-6 text-center border-t border-border">
          <Icon name="MapPin" size={32} className="text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            No active emergencies in your area
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            You'll be notified when help is needed nearby
          </p>
        </div>
      )}
    </div>
  );
};

export default EmergencyMap;