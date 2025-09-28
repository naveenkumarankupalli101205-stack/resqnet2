import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import AvailabilityToggle from './components/AvailabilityToggle';
import ActiveAlertCard from './components/ActiveAlertCard';
import EmergencyMap from './components/EmergencyMap';
import ResponseStats from './components/ResponseStats';
import RecentResponseCard from './components/RecentResponseCard';
import AlertNotificationOverlay from '../../components/ui/AlertNotificationOverlay';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const VolunteerDashboard = () => {
  const navigate = useNavigate();
  const [isAvailable, setIsAvailable] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [activeAlerts, setActiveAlerts] = useState([]);
  const [recentResponses, setRecentResponses] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [currentAlert, setCurrentAlert] = useState(null);
  const [volunteerLocation, setVolunteerLocation] = useState({ lat: 40.7128, lng: -74.0060 });
  const [stats, setStats] = useState({
    totalResponses: 12,
    successfulHelps: 11,
    averageResponseTime: 420, // 7 minutes
    communityRating: 4.8
  });

  // Mock active alerts data
  const mockActiveAlerts = [
    {
      id: "alert_001",
      type: "health",
      urgency: "critical",
      location: "Central Park West, Manhattan",
      description: "Elderly person collapsed during morning jog. Conscious but experiencing chest pain.",
      victimName: "Sarah Johnson",
      distance: 850,
      timestamp: new Date(Date.now() - 300000), // 5 minutes ago
      nearbyVolunteers: 4
    },
    {
      id: "alert_002",
      type: "accident",
      urgency: "high",
      location: "Broadway & 42nd Street",
      description: "Minor car accident with possible injuries. Traffic is backing up.",
      victimName: "Michael Chen",
      distance: 1200,
      timestamp: new Date(Date.now() - 600000), // 10 minutes ago
      nearbyVolunteers: 2
    },
    {
      id: "alert_003",
      type: "security",
      urgency: "standard",
      location: "Washington Square Park",
      description: "Person feels unsafe walking alone at night. Requesting escort assistance.",
      victimName: "Anonymous",
      distance: 2100,
      timestamp: new Date(Date.now() - 900000), // 15 minutes ago
      nearbyVolunteers: 6
    }
  ];

  // Mock recent responses data
  const mockRecentResponses = [
    {
      id: "resp_001",
      type: "health",
      status: "completed",
      location: "Times Square, Manhattan",
      timestamp: new Date(Date.now() - 7200000), // 2 hours ago
      responseTime: 360, // 6 minutes
      duration: 45, // 45 minutes
      outcome: "Successfully assisted victim until paramedics arrived. Victim was stable and grateful.",
      rating: 5
    },
    {
      id: "resp_002",
      type: "fire",
      status: "completed",
      location: "Brooklyn Bridge Park",
      timestamp: new Date(Date.now() - 86400000), // 1 day ago
      responseTime: 480, // 8 minutes
      duration: 30,
      outcome: "Helped evacuate area and guided fire department to exact location.",
      rating: 5
    },
    {
      id: "resp_003",
      type: "accident",
      status: "completed",
      location: "5th Avenue & 59th Street",
      timestamp: new Date(Date.now() - 172800000), // 2 days ago
      responseTime: 300, // 5 minutes
      duration: 60,
      outcome: "Provided first aid and traffic control until emergency services arrived.",
      rating: 4
    }
  ];

  useEffect(() => {
    // Load initial data
    setActiveAlerts(mockActiveAlerts);
    setRecentResponses(mockRecentResponses);

    // Simulate receiving a new alert after 5 seconds
    const alertTimer = setTimeout(() => {
      if (isAvailable) {
        const newAlert = {
          id: "alert_new",
          type: "health",
          urgency: "critical",
          location: "Madison Square Garden",
          description: "Person experiencing severe allergic reaction. Needs immediate assistance.",
          distance: 650,
          timestamp: new Date()
        };
        setCurrentAlert(newAlert);
        setShowNotification(true);
      }
    }, 5000);

    return () => clearTimeout(alertTimer);
  }, [isAvailable]);

  const handleAvailabilityToggle = (newStatus) => {
    setIsLoading(true);
    
    setTimeout(() => {
      setIsAvailable(newStatus);
      setIsLoading(false);
      
      if (!newStatus) {
        // Clear active alerts when going offline
        setActiveAlerts([]);
      } else {
        // Reload alerts when going online
        setActiveAlerts(mockActiveAlerts);
      }
    }, 1000);
  };

  const handleAcceptAlert = (alert) => {
    // Remove from active alerts
    setActiveAlerts(prev => prev?.filter(a => a?.id !== alert?.id));
    
    // Navigate to response screen or show success message
    console.log('Accepted alert:', alert);
    
    // Simulate navigation to response coordination
    setTimeout(() => {
      alert('Response accepted! You are now coordinating with the victim.');
    }, 500);
  };

  const handleRejectAlert = (alert) => {
    // Remove from active alerts
    setActiveAlerts(prev => prev?.filter(a => a?.id !== alert?.id));
    console.log('Rejected alert:', alert);
  };

  const handleNotificationAccept = (alert) => {
    setShowNotification(false);
    setCurrentAlert(null);
    handleAcceptAlert(alert);
  };

  const handleNotificationReject = (alert) => {
    setShowNotification(false);
    setCurrentAlert(null);
    handleRejectAlert(alert);
  };

  const handleNotificationClose = () => {
    setShowNotification(false);
    setCurrentAlert(null);
  };

  const handleViewResponseDetails = (response) => {
    console.log('View response details:', response);
    // Navigate to detailed response view
  };

  const handleAlertMapClick = (alert) => {
    console.log('Map alert clicked:', alert);
    // Focus on specific alert or show details
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        userRole="volunteer" 
        emergencyStatus={false}
      />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Page Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Volunteer Dashboard</h1>
                <p className="text-muted-foreground">
                  Help your community by responding to nearby emergencies
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => navigate('/alert-history')}
                iconName="Clock"
                iconPosition="left"
                iconSize={16}
              >
                View History
              </Button>
            </div>
          </div>

          {/* Availability Toggle */}
          <div className="mb-6">
            <AvailabilityToggle
              isAvailable={isAvailable}
              onToggle={handleAvailabilityToggle}
              isLoading={isLoading}
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Active Alerts */}
            <div className="lg:col-span-2 space-y-6">
              {/* Active Alerts Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-foreground">
                    Active Alerts ({activeAlerts?.length})
                  </h2>
                  {isAvailable && (
                    <div className="flex items-center text-sm text-success">
                      <div className="w-2 h-2 bg-success rounded-full mr-2 animate-pulse" />
                      <span>Receiving alerts</span>
                    </div>
                  )}
                </div>

                {!isAvailable ? (
                  <div className="bg-card rounded-lg border border-border p-8 text-center">
                    <Icon name="UserX" size={48} className="text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">
                      You're Currently Unavailable
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Turn on your availability to start receiving emergency alerts from your community.
                    </p>
                    <Button
                      variant="default"
                      onClick={() => handleAvailabilityToggle(true)}
                      iconName="UserCheck"
                      iconPosition="left"
                      iconSize={16}
                    >
                      Go Available
                    </Button>
                  </div>
                ) : activeAlerts?.length === 0 ? (
                  <div className="bg-card rounded-lg border border-border p-8 text-center">
                    <Icon name="Shield" size={48} className="text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">
                      No Active Emergencies
                    </h3>
                    <p className="text-muted-foreground">
                      Your community is safe right now. You'll be notified when help is needed nearby.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activeAlerts?.map((alert) => (
                      <ActiveAlertCard
                        key={alert?.id}
                        alert={alert}
                        onAccept={handleAcceptAlert}
                        onReject={handleRejectAlert}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Emergency Map */}
              <EmergencyMap
                volunteerLocation={volunteerLocation}
                activeAlerts={activeAlerts}
                onAlertClick={handleAlertMapClick}
              />
            </div>

            {/* Right Column - Stats and Recent Responses */}
            <div className="space-y-6">
              {/* Response Stats */}
              <ResponseStats stats={stats} />

              {/* Recent Responses */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-foreground">
                    Recent Responses
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/alert-history')}
                    iconName="ArrowRight"
                    iconPosition="right"
                    iconSize={14}
                  >
                    View All
                  </Button>
                </div>

                <div className="space-y-4">
                  {recentResponses?.slice(0, 3)?.map((response) => (
                    <RecentResponseCard
                      key={response?.id}
                      response={response}
                      onViewDetails={handleViewResponseDetails}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Alert Notification Overlay */}
      <AlertNotificationOverlay
        alert={currentAlert}
        isVisible={showNotification}
        onAccept={handleNotificationAccept}
        onReject={handleNotificationReject}
        onClose={handleNotificationClose}
      />
    </div>
  );
};

export default VolunteerDashboard;