import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import EmergencyActionButton from '../../components/ui/EmergencyActionButton';
import EmergencyMapView from './components/EmergencyMapView';
import EmergencyTypeSelector from './components/EmergencyTypeSelector';
import AlertStatusPanel from './components/AlertStatusPanel';
import EmergencyContactsPanel from './components/EmergencyContactsPanel';
import RecentAlertsHistory from './components/RecentAlertsHistory';


const VictimDashboard = () => {
  const navigate = useNavigate();
  const [userLocation, setUserLocation] = useState({ lat: 40.7128, lng: -74.0060 });
  const [selectedEmergencyType, setSelectedEmergencyType] = useState(null);
  const [activeAlert, setActiveAlert] = useState(null);
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);
  const [volunteerResponses, setVolunteerResponses] = useState([]);
  const [nearbyVolunteers, setNearbyVolunteers] = useState([]);

  // Mock data for nearby volunteers
  const mockNearbyVolunteers = [
    { id: 1, name: "Sarah Johnson", distance: 450, lat: 40.7138, lng: -74.0050 },
    { id: 2, name: "Mike Chen", distance: 680, lat: 40.7118, lng: -74.0070 },
    { id: 3, name: "Emma Davis", distance: 920, lat: 40.7148, lng: -74.0040 },
    { id: 4, name: "Alex Rodriguez", distance: 1200, lat: 40.7108, lng: -74.0080 },
    { id: 5, name: "Lisa Thompson", distance: 1450, lat: 40.7158, lng: -74.0030 }
  ];

  // Mock emergency contacts
  const mockEmergencyContacts = [
    {
      id: "contact_1",
      name: "Mom - Jane Doe",
      phone: "+1-555-0123",
      type: "family",
      description: "Primary emergency contact"
    },
    {
      id: "contact_2",
      name: "Dr. Smith",
      phone: "+1-555-0456",
      type: "medical",
      description: "Family physician"
    },
    {
      id: "contact_3",
      name: "Best Friend - Alex",
      phone: "+1-555-0789",
      type: "friend",
      description: "Close friend nearby"
    }
  ];

  useEffect(() => {
    // Get user location on component mount
    if (navigator.geolocation) {
      navigator.geolocation?.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position?.coords?.latitude,
            lng: position?.coords?.longitude
          });
        },
        (error) => {
          console.warn("Location access denied, using default location");
        }
      );
    }

    // Set nearby volunteers
    setNearbyVolunteers(mockNearbyVolunteers);
  }, []);

  const handleEmergencyAction = () => {
    if (!selectedEmergencyType) {
      alert("Please select an emergency type first");
      return;
    }

    const newAlert = {
      id: `alert_${Date.now()}`,
      type: selectedEmergencyType,
      timestamp: new Date(),
      status: 'pending',
      location: "Current location",
      volunteersNotified: nearbyVolunteers?.length
    };

    setActiveAlert(newAlert);
    setIsEmergencyActive(true);

    // Simulate volunteer responses after a delay
    setTimeout(() => {
      const mockResponses = [
        {
          id: "response_1",
          volunteerName: "Sarah Johnson",
          distance: 450,
          eta: 3,
          phone: "+1-555-1001"
        },
        {
          id: "response_2",
          volunteerName: "Mike Chen",
          distance: 680,
          eta: 5,
          phone: "+1-555-1002"
        }
      ];
      setVolunteerResponses(mockResponses);
      
      // Update alert status
      setActiveAlert(prev => ({ ...prev, status: 'accepted' }));
    }, 3000);
  };

  const handleCancelAlert = (alertId) => {
    if (window.confirm("Are you sure you want to cancel this emergency alert?")) {
      setActiveAlert(null);
      setIsEmergencyActive(false);
      setVolunteerResponses([]);
      setSelectedEmergencyType(null);
    }
  };

  const handleContactVolunteer = (volunteer) => {
    if (window.confirm(`Call ${volunteer?.volunteerName} at ${volunteer?.phone}?`)) {
      window.open(`tel:${volunteer?.phone}`, '_self');
    }
  };

  const handleCallEmergencyContact = (contact) => {
    if (window.confirm(`Call ${contact?.name} at ${contact?.phone}?`)) {
      window.open(`tel:${contact?.phone}`, '_self');
    }
  };

  const handleLocationUpdate = (newLocation) => {
    setUserLocation(newLocation);
  };

  const handleViewAlertDetails = (alert) => {
    navigate('/alert-history', { state: { selectedAlert: alert } });
  };

  const handleViewAllHistory = () => {
    navigate('/alert-history');
  };

  const handleEditContacts = () => {
    navigate('/user-profile', { state: { tab: 'emergency-contacts' } });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        userRole="victim" 
        emergencyStatus={isEmergencyActive}
        onEmergencyAction={handleEmergencyAction}
      />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Page Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Emergency Dashboard</h1>
                <p className="text-muted-foreground mt-1">
                  Your safety network is ready. {nearbyVolunteers?.length} volunteers nearby.
                </p>
              </div>
              
              {/* Emergency Status Indicator */}
              <div className={`
                flex items-center px-4 py-2 rounded-full
                ${isEmergencyActive 
                  ? 'bg-primary/10 text-primary' :'bg-success/10 text-success'
                }
              `}>
                <div className={`
                  w-2 h-2 rounded-full mr-2
                  ${isEmergencyActive 
                    ? 'bg-primary animate-pulse-emergency' :'bg-success'
                  }
                `} />
                <span className="text-sm font-medium">
                  {isEmergencyActive ? 'Emergency Active' : 'Safe'}
                </span>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Map and Emergency Controls */}
            <div className="lg:col-span-2 space-y-6">
              {/* Emergency Type Selection */}
              <div className="bg-card border border-border rounded-lg p-6">
                <EmergencyTypeSelector
                  selectedType={selectedEmergencyType}
                  onTypeSelect={setSelectedEmergencyType}
                  disabled={isEmergencyActive}
                />
              </div>

              {/* Emergency Map */}
              <EmergencyMapView
                userLocation={userLocation}
                nearbyVolunteers={nearbyVolunteers}
                onLocationUpdate={handleLocationUpdate}
                isEmergencyActive={isEmergencyActive}
              />

              {/* SOS Button - Desktop */}
              <div className="hidden lg:block">
                <div className="bg-card border border-border rounded-lg p-6 text-center">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Emergency Alert
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedEmergencyType 
                        ? `Ready to send ${selectedEmergencyType} emergency alert`
                        : 'Select emergency type above, then press SOS'
                      }
                    </p>
                  </div>
                  
                  <EmergencyActionButton
                    onEmergencyAction={handleEmergencyAction}
                    isActive={isEmergencyActive}
                    position="inline"
                    size="lg"
                  />
                </div>
              </div>
            </div>

            {/* Right Column - Status and History */}
            <div className="space-y-6">
              {/* Alert Status Panel */}
              <AlertStatusPanel
                activeAlert={activeAlert}
                volunteerResponses={volunteerResponses}
                onCancelAlert={handleCancelAlert}
                onContactVolunteer={handleContactVolunteer}
              />

              {/* Emergency Contacts */}
              <EmergencyContactsPanel
                emergencyContacts={mockEmergencyContacts}
                onCallContact={handleCallEmergencyContact}
                onEditContacts={handleEditContacts}
              />

              {/* Recent Alerts History */}
              <RecentAlertsHistory
                onViewDetails={handleViewAlertDetails}
                onViewAllHistory={handleViewAllHistory}
              />
            </div>
          </div>

          {/* Mobile Emergency FAB */}
          <div className="lg:hidden">
            <EmergencyActionButton
              onEmergencyAction={handleEmergencyAction}
              isActive={isEmergencyActive}
              position="floating"
              size="default"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default VictimDashboard;