import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import ProfileHeader from './components/ProfileHeader';
import PersonalInfoForm from './components/PersonalInfoForm';
import EmergencyContactsSection from './components/EmergencyContactsSection';
import LocationPreferences from './components/LocationPreferences';
import SafetySettings from './components/SafetySettings';
import AccountSecurity from './components/AccountSecurity';
import NotificationPreferences from './components/NotificationPreferences';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const UserProfile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('personal');
  const [user, setUser] = useState({
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 123-4567",
    address: "123 Oak Street, Springfield, IL 62701",
    dateOfBirth: "1990-05-15",
    emergencyMedicalInfo: "Type 1 Diabetes, carries insulin pen",
    role: "victim",
    verified: true,
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    stats: {
      totalAlerts: 3,
      responseTime: "4 min",
      trustScore: 95
    }
  });

  const [emergencyContacts, setEmergencyContacts] = useState([
    {
      id: 1,
      name: "Michael Johnson",
      relationship: "spouse",
      phone: "+1 (555) 987-6543",
      isPrimary: true
    },
    {
      id: 2,
      name: "Emma Johnson",
      relationship: "parent",
      phone: "+1 (555) 456-7890",
      isPrimary: false
    }
  ]);

  const [locationPreferences, setLocationPreferences] = useState({
    notificationRadius: 2,
    shareLocationWithVolunteers: true,
    shareLocationWithContacts: true,
    allowLocationHistory: false,
    preciseLocation: true,
    locationUpdateFrequency: 'realtime'
  });

  const [safetySettings, setSafetySettings] = useState({
    availableHours: { start: '08:00', end: '22:00' },
    availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
    emergencyTypes: ['medical', 'fire', 'accident', 'security'],
    alertFrequency: 'all',
    autoResponse: false,
    silentHours: { enabled: true, start: '22:00', end: '08:00' }
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    lastPasswordChange: "2 months ago"
  });

  const [notificationPreferences, setNotificationPreferences] = useState({
    emergencyAlerts: true,
    volunteerResponses: true,
    statusUpdates: true,
    communityNews: false,
    soundEnabled: true,
    vibrationEnabled: true,
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    alertSound: 'emergency',
    quietHours: { enabled: true, start: '22:00', end: '08:00' }
  });

  const [isSaving, setIsSaving] = useState(false);

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: 'User' },
    { id: 'contacts', label: 'Emergency Contacts', icon: 'Phone' },
    { id: 'location', label: 'Location & Privacy', icon: 'MapPin' },
    { id: 'safety', label: 'Safety Settings', icon: 'Shield' },
    { id: 'security', label: 'Account Security', icon: 'Lock' },
    { id: 'notifications', label: 'Notifications', icon: 'Bell' }
  ];

  useEffect(() => {
    // Request notification permission if not already granted
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const handleRoleSwitch = async () => {
    setIsSaving(true);
    try {
      const newRole = user?.role === 'victim' ? 'volunteer' : 'victim';
      setUser(prev => ({ ...prev, role: newRole }));
      
      // Navigate to appropriate dashboard
      setTimeout(() => {
        navigate(newRole === 'victim' ? '/victim-dashboard' : '/volunteer-dashboard');
      }, 1000);
    } catch (error) {
      console.error('Failed to switch role:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePersonalInfoSave = async (formData) => {
    setIsSaving(true);
    try {
      setUser(prev => ({ ...prev, ...formData }));
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Failed to save personal info:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const handleEmergencyContactsSave = async (contacts) => {
    setIsSaving(true);
    try {
      setEmergencyContacts(contacts);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Failed to save emergency contacts:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const handleLocationPreferencesSave = async (preferences) => {
    setIsSaving(true);
    try {
      setLocationPreferences(preferences);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Failed to save location preferences:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const handleSafetySettingsSave = async (settings) => {
    setIsSaving(true);
    try {
      setSafetySettings(settings);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Failed to save safety settings:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const handleSecuritySave = async (data) => {
    setIsSaving(true);
    try {
      if (data?.type === 'password') {
        setSecuritySettings(prev => ({
          ...prev,
          lastPasswordChange: 'Just now'
        }));
      } else if (data?.type === 'twoFactor') {
        setSecuritySettings(prev => ({
          ...prev,
          twoFactorEnabled: data?.enabled
        }));
      }
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Failed to save security settings:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const handleNotificationPreferencesSave = async (preferences) => {
    setIsSaving(true);
    try {
      setNotificationPreferences(preferences);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Failed to save notification preferences:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return (
          <PersonalInfoForm
            user={user}
            onSave={handlePersonalInfoSave}
          />
        );
      case 'contacts':
        return (
          <EmergencyContactsSection
            contacts={emergencyContacts}
            onSave={handleEmergencyContactsSave}
          />
        );
      case 'location':
        return (
          <LocationPreferences
            preferences={locationPreferences}
            onSave={handleLocationPreferencesSave}
          />
        );
      case 'safety':
        return (
          <SafetySettings
            settings={safetySettings}
            userRole={user?.role}
            onSave={handleSafetySettingsSave}
          />
        );
      case 'security':
        return (
          <AccountSecurity
            securitySettings={securitySettings}
            onSave={handleSecuritySave}
          />
        );
      case 'notifications':
        return (
          <NotificationPreferences
            preferences={notificationPreferences}
            onSave={handleNotificationPreferencesSave}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        userRole={user?.role}
        emergencyStatus={false}
        onEmergencyAction={() => {}}
      />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Profile Header */}
          <ProfileHeader
            user={user}
            onRoleSwitch={handleRoleSwitch}
            canSwitchRole={true}
          />

          {/* Navigation Tabs */}
          <div className="bg-card rounded-lg border border-border mb-6">
            <div className="flex overflow-x-auto">
              {tabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`
                    flex items-center px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors duration-200
                    ${activeTab === tab?.id
                      ? 'border-primary text-primary bg-primary/5' :'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
                    }
                  `}
                >
                  <Icon name={tab?.icon} size={16} className="mr-2" />
                  {tab?.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="animate-fade-in">
            {renderTabContent()}
          </div>

          {/* Quick Actions */}
          <div className="mt-8 bg-card rounded-lg border border-border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                onClick={() => navigate('/alert-history')}
                iconName="Clock"
                iconPosition="left"
                iconSize={16}
                fullWidth
              >
                View Alert History
              </Button>
              
              <Button
                variant="outline"
                onClick={() => navigate(user?.role === 'victim' ? '/victim-dashboard' : '/volunteer-dashboard')}
                iconName="Activity"
                iconPosition="left"
                iconSize={16}
                fullWidth
              >
                Go to Dashboard
              </Button>
              
              <Button
                variant="outline"
                onClick={() => navigate('/help')}
                iconName="HelpCircle"
                iconPosition="left"
                iconSize={16}
                fullWidth
              >
                Get Help & Support
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserProfile;