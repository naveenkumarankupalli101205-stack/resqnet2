import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const LocationPermissionPrompt = ({ isVisible, onPermissionGranted, onPermissionDenied, onClose }) => {
  const [permissionStatus, setPermissionStatus] = useState('prompt'); // 'prompt', 'granted', 'denied', 'checking'
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (isVisible) {
      checkCurrentPermission();
    }
  }, [isVisible]);

  const checkCurrentPermission = async () => {
    if (!navigator.geolocation) {
      setPermissionStatus('denied');
      return;
    }

    try {
      const permission = await navigator.permissions?.query({ name: 'geolocation' });
      setPermissionStatus(permission?.state);
      
      if (permission?.state === 'granted') {
        onPermissionGranted();
      }
    } catch (error) {
      console.log('Permission check failed:', error);
      setPermissionStatus('prompt');
    }
  };

  const requestLocationPermission = async () => {
    setIsProcessing(true);
    setPermissionStatus('checking');

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000 // 5 minutes
          }
        );
      });

      setPermissionStatus('granted');
      onPermissionGranted({
        latitude: position?.coords?.latitude,
        longitude: position?.coords?.longitude,
        accuracy: position?.coords?.accuracy
      });
    } catch (error) {
      console.error('Location permission denied:', error);
      setPermissionStatus('denied');
      onPermissionDenied(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleManualLocation = () => {
    // For demo purposes, we'll use a mock location
    const mockLocation = {
      latitude: 37.7749,
      longitude: -122.4194,
      accuracy: 100,
      isManual: true
    };
    
    onPermissionGranted(mockLocation);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-alert bg-black/60 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-card rounded-xl max-w-md w-full shadow-emergency-lg animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center mr-3">
              <Icon name="MapPin" size={20} className="text-accent" />
            </div>
            <h3 className="font-semibold text-foreground">Location Access</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded-md transition-colors duration-150"
            disabled={isProcessing}
          >
            <Icon name="X" size={18} className="text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {permissionStatus === 'checking' ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Loader2" size={24} className="text-accent animate-spin" />
              </div>
              <h4 className="font-medium text-foreground mb-2">
                Checking Location Access
              </h4>
              <p className="text-sm text-muted-foreground">
                Please allow location access when prompted by your browser
              </p>
            </div>
          ) : permissionStatus === 'denied' ? (
            <div className="text-center">
              <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="AlertTriangle" size={24} className="text-warning" />
              </div>
              <h4 className="font-medium text-foreground mb-2">
                Location Access Blocked
              </h4>
              <p className="text-sm text-muted-foreground mb-6">
                Location access is required for emergency services to find you quickly. 
                You can enable it in your browser settings or enter your location manually.
              </p>
              
              <div className="space-y-3">
                <Button
                  variant="outline"
                  size="default"
                  onClick={handleManualLocation}
                  iconName="MapPin"
                  iconPosition="left"
                  iconSize={16}
                  fullWidth
                >
                  Enter Location Manually
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={requestLocationPermission}
                  loading={isProcessing}
                  fullWidth
                >
                  Try Again
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="MapPin" size={32} className="text-primary" />
              </div>
              <h4 className="text-lg font-semibold text-foreground mb-3">
                Enable Location Services
              </h4>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                ResQNet needs your location to connect you with nearby volunteers and 
                emergency responders. Your location is only shared during active emergencies.
              </p>

              {/* Benefits */}
              <div className="space-y-3 mb-6 text-left">
                <div className="flex items-center">
                  <Icon name="Zap" size={16} className="text-success mr-3" />
                  <span className="text-sm text-foreground">Faster emergency response times</span>
                </div>
                <div className="flex items-center">
                  <Icon name="Users" size={16} className="text-success mr-3" />
                  <span className="text-sm text-foreground">Connect with nearby volunteers</span>
                </div>
                <div className="flex items-center">
                  <Icon name="Shield" size={16} className="text-success mr-3" />
                  <span className="text-sm text-foreground">Secure and private location sharing</span>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  variant="default"
                  size="default"
                  onClick={requestLocationPermission}
                  loading={isProcessing}
                  iconName="MapPin"
                  iconPosition="left"
                  iconSize={16}
                  fullWidth
                >
                  Allow Location Access
                </Button>
                <Button
                  variant="outline"
                  size="default"
                  onClick={handleManualLocation}
                  iconName="Edit"
                  iconPosition="left"
                  iconSize={16}
                  fullWidth
                >
                  Enter Manually
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <div className="flex items-center justify-center text-xs text-muted-foreground">
            <Icon name="Lock" size={12} className="mr-1" />
            <span>Your location data is encrypted and secure</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationPermissionPrompt;