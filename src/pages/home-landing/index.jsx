import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import HeroSection from './components/HeroSection';
import EmergencyTypeSelector from './components/EmergencyTypeSelector';
import CommunityStats from './components/CommunityStats';
import LocationPermissionPrompt from './components/LocationPermissionPrompt';
import EmergencySOSModal from './components/EmergencySOSModal';
import Icon from '../../components/AppIcon';


const HomeLanding = () => {
  const navigate = useNavigate();
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);
  const [showSOSModal, setShowSOSModal] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedEmergencyType, setSelectedEmergencyType] = useState('');
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const savedRole = localStorage.getItem('userRole');
    if (savedRole) {
      setUserRole(savedRole);
    }

    // Check location permission status
    checkLocationPermission();
  }, []);

  const checkLocationPermission = async () => {
    if (!navigator.geolocation) return;

    try {
      const permission = await navigator.permissions?.query({ name: 'geolocation' });
      if (permission?.state === 'granted') {
        getCurrentLocation();
      }
    } catch (error) {
      console.log('Permission check failed:', error);
    }
  };

  const getCurrentLocation = () => {
    navigator.geolocation?.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position?.coords?.latitude,
          longitude: position?.coords?.longitude,
          accuracy: position?.coords?.accuracy,
          address: "Current Location"
        });
      },
      (error) => {
        console.error('Location error:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  };

  const handleSOSClick = () => {
    if (!userLocation) {
      setShowLocationPrompt(true);
    } else {
      setShowSOSModal(true);
    }
  };

  const handleRoleSelect = (role) => {
    switch (role) {
      case 'victim':
        if (!userLocation) {
          setShowLocationPrompt(true);
        } else {
          navigate('/victim-dashboard');
        }
        break;
      case 'volunteer':
        if (!userLocation) {
          setShowLocationPrompt(true);
        } else {
          navigate('/volunteer-dashboard');
        }
        break;
      case 'login': navigate('/login-register');
        break;
      case 'register': navigate('/login-register');
        break;
      default:
        break;
    }
  };

  const handleLocationPermissionGranted = (location) => {
    setUserLocation(location);
    setShowLocationPrompt(false);
    
    // If SOS was clicked, show the modal
    if (showSOSModal) {
      // Modal will show automatically since userLocation is now set
    }
  };

  const handleLocationPermissionDenied = (error) => {
    console.error('Location permission denied:', error);
    setShowLocationPrompt(false);
    
    // Show alternative options or continue without location
    alert('Location access is recommended for emergency services. You can still use the app with limited functionality.');
  };

  const handleSendAlert = (alertData) => {
    console.log('Emergency alert sent:', alertData);
    
    // Store alert in localStorage for demo
    const existingAlerts = JSON.parse(localStorage.getItem('emergencyAlerts') || '[]');
    existingAlerts?.push(alertData);
    localStorage.setItem('emergencyAlerts', JSON.stringify(existingAlerts));
    
    // Show success message
    alert('Emergency alert sent successfully! Nearby volunteers have been notified.');
    
    // Navigate to victim dashboard if user is not logged in
    if (!userRole) {
      localStorage.setItem('userRole', 'victim');
      setUserRole('victim');
      navigate('/victim-dashboard');
    }
  };

  const handleEmergencyAction = () => {
    handleSOSClick();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        userRole={userRole}
        emergencyStatus={false}
        onEmergencyAction={handleEmergencyAction}
      />
      <main className="pt-16">
        {/* Hero Section */}
        <HeroSection 
          onSOSClick={handleSOSClick}
          onRoleSelect={handleRoleSelect}
        />

        {/* Community Statistics */}
        <CommunityStats />

        {/* Emergency Type Selector - Hidden by default, shown when needed */}
        {selectedEmergencyType && (
          <div className="bg-background py-8 px-4">
            <div className="max-w-2xl mx-auto">
              <EmergencyTypeSelector
                onTypeSelect={setSelectedEmergencyType}
                selectedType={selectedEmergencyType}
              />
            </div>
          </div>
        )}
      </main>
      {/* Location Permission Prompt */}
      <LocationPermissionPrompt
        isVisible={showLocationPrompt}
        onPermissionGranted={handleLocationPermissionGranted}
        onPermissionDenied={handleLocationPermissionDenied}
        onClose={() => setShowLocationPrompt(false)}
      />
      {/* Emergency SOS Modal */}
      <EmergencySOSModal
        isVisible={showSOSModal}
        onClose={() => setShowSOSModal(false)}
        onSendAlert={handleSendAlert}
        userLocation={userLocation}
      />
      {/* Footer */}
      <footer className="bg-card border-t border-border py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mr-3">
                  <Icon name="Shield" size={20} color="white" strokeWidth={2.5} />
                </div>
                <span className="text-xl font-bold text-foreground">ResQNet</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4 max-w-md">
                Community-driven emergency response network connecting those who need help with nearby volunteers.
              </p>
              <div className="flex items-center text-xs text-muted-foreground">
                <Icon name="Shield" size={14} className="mr-1" />
                <span>Secure • Reliable • Community-Driven</span>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-3">Quick Links</h4>
              <div className="space-y-2">
                <button 
                  onClick={() => navigate('/login-register')}
                  className="block text-sm text-muted-foreground hover:text-foreground transition-colors duration-150"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => navigate('/user-profile')}
                  className="block text-sm text-muted-foreground hover:text-foreground transition-colors duration-150"
                >
                  Profile
                </button>
                <button 
                  onClick={() => navigate('/alert-history')}
                  className="block text-sm text-muted-foreground hover:text-foreground transition-colors duration-150"
                >
                  Alert History
                </button>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-3">Emergency</h4>
              <div className="space-y-2">
                <button 
                  onClick={handleSOSClick}
                  className="block text-sm text-primary hover:text-primary/80 transition-colors duration-150 font-medium"
                >
                  Send SOS Alert
                </button>
                <button 
                  onClick={() => handleRoleSelect('volunteer')}
                  className="block text-sm text-muted-foreground hover:text-foreground transition-colors duration-150"
                >
                  Become Volunteer
                </button>
                <span className="block text-sm text-muted-foreground">
                  24/7 Support
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-xs text-muted-foreground">
              © {new Date()?.getFullYear()} ResQNet. All rights reserved.
            </p>
            <div className="flex items-center mt-4 md:mt-0 space-x-4">
              <span className="text-xs text-muted-foreground">Emergency Certified</span>
              <span className="text-xs text-muted-foreground">SSL Secured</span>
              <span className="text-xs text-muted-foreground">Community Verified</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomeLanding;