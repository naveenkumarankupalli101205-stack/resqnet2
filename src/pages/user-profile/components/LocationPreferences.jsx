import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const LocationPreferences = ({ preferences = {}, onSave = () => {} }) => {
  const [settings, setSettings] = useState({
    notificationRadius: preferences?.notificationRadius || 2,
    shareLocationWithVolunteers: preferences?.shareLocationWithVolunteers ?? true,
    shareLocationWithContacts: preferences?.shareLocationWithContacts ?? true,
    allowLocationHistory: preferences?.allowLocationHistory ?? false,
    preciseLocation: preferences?.preciseLocation ?? true,
    locationUpdateFrequency: preferences?.locationUpdateFrequency || 'realtime',
    ...preferences
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const radiusOptions = [
    { value: 0.5, label: '0.5 km (Very Close)' },
    { value: 1, label: '1 km (Close)' },
    { value: 2, label: '2 km (Moderate)' },
    { value: 3, label: '3 km (Wide)' },
    { value: 5, label: '5 km (Very Wide)' }
  ];

  const updateFrequencyOptions = [
    { value: 'realtime', label: 'Real-time (High accuracy)' },
    { value: 'frequent', label: 'Every 30 seconds' },
    { value: 'moderate', label: 'Every 2 minutes' },
    { value: 'conservative', label: 'Every 5 minutes' }
  ];

  const handleSettingChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(settings);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save location preferences:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setSettings({
      notificationRadius: preferences?.notificationRadius || 2,
      shareLocationWithVolunteers: preferences?.shareLocationWithVolunteers ?? true,
      shareLocationWithContacts: preferences?.shareLocationWithContacts ?? true,
      allowLocationHistory: preferences?.allowLocationHistory ?? false,
      preciseLocation: preferences?.preciseLocation ?? true,
      locationUpdateFrequency: preferences?.locationUpdateFrequency || 'realtime',
      ...preferences
    });
    setIsEditing(false);
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Icon name="MapPin" size={20} className="text-primary mr-2" />
          <h2 className="text-lg font-semibold text-foreground">
            Location & Privacy
          </h2>
        </div>
        {!isEditing && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
            iconName="Edit"
            iconPosition="left"
            iconSize={16}
          >
            Edit
          </Button>
        )}
      </div>
      <div className="space-y-6">
        {/* Notification Radius */}
        <div>
          <Select
            label="Alert Notification Radius"
            description="How far away should you receive emergency alerts?"
            options={radiusOptions}
            value={settings?.notificationRadius}
            onChange={(value) => handleSettingChange('notificationRadius', value)}
            disabled={!isEditing}
          />
        </div>

        {/* Location Update Frequency */}
        <div>
          <Select
            label="Location Update Frequency"
            description="How often should your location be updated during emergencies?"
            options={updateFrequencyOptions}
            value={settings?.locationUpdateFrequency}
            onChange={(value) => handleSettingChange('locationUpdateFrequency', value)}
            disabled={!isEditing}
          />
        </div>

        {/* Privacy Settings */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-foreground mb-3">
            Privacy Controls
          </h3>

          <Checkbox
            label="Share location with volunteers during emergencies"
            description="Allow nearby volunteers to see your location when you send an alert"
            checked={settings?.shareLocationWithVolunteers}
            onChange={(e) => handleSettingChange('shareLocationWithVolunteers', e?.target?.checked)}
            disabled={!isEditing}
          />

          <Checkbox
            label="Share location with emergency contacts"
            description="Automatically notify your emergency contacts with your location"
            checked={settings?.shareLocationWithContacts}
            onChange={(e) => handleSettingChange('shareLocationWithContacts', e?.target?.checked)}
            disabled={!isEditing}
          />

          <Checkbox
            label="Enable precise location"
            description="Use GPS for more accurate location (may drain battery faster)"
            checked={settings?.preciseLocation}
            onChange={(e) => handleSettingChange('preciseLocation', e?.target?.checked)}
            disabled={!isEditing}
          />

          <Checkbox
            label="Allow location history storage"
            description="Store location history for emergency response analysis"
            checked={settings?.allowLocationHistory}
            onChange={(e) => handleSettingChange('allowLocationHistory', e?.target?.checked)}
            disabled={!isEditing}
          />
        </div>

        {/* Current Location Status */}
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-success rounded-full mr-2 animate-pulse" />
              <span className="text-sm font-medium text-foreground">
                Location Services Active
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              iconName="RefreshCw"
              iconSize={16}
              className="text-muted-foreground"
            >
              Refresh
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Last updated: {new Date()?.toLocaleTimeString()}
          </p>
        </div>

        {isEditing && (
          <div className="flex gap-3 pt-4 border-t border-border">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={handleSave}
              loading={isSaving}
              iconName="Save"
              iconPosition="left"
              iconSize={16}
            >
              Save Preferences
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationPreferences;