import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const SafetySettings = ({ settings = {}, userRole, onSave = () => {} }) => {
  const [safetySettings, setSafetySettings] = useState({
    availableHours: settings?.availableHours || { start: '08:00', end: '22:00' },
    availableDays: settings?.availableDays || ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
    emergencyTypes: settings?.emergencyTypes || ['medical', 'fire', 'accident', 'security'],
    alertFrequency: settings?.alertFrequency || 'all',
    autoResponse: settings?.autoResponse || false,
    silentHours: settings?.silentHours || { enabled: false, start: '22:00', end: '08:00' },
    ...settings
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const emergencyTypeOptions = [
    { value: 'medical', label: 'Medical Emergency', description: 'Health-related emergencies' },
    { value: 'fire', label: 'Fire Emergency', description: 'Fire and smoke incidents' },
    { value: 'accident', label: 'Accident', description: 'Vehicle and other accidents' },
    { value: 'security', label: 'Security Threat', description: 'Personal safety concerns' },
    { value: 'natural', label: 'Natural Disaster', description: 'Weather and natural events' },
    { value: 'other', label: 'Other Emergency', description: 'General emergency situations' }
  ];

  const alertFrequencyOptions = [
    { value: 'all', label: 'All Alerts', description: 'Receive every emergency alert' },
    { value: 'critical', label: 'Critical Only', description: 'Only life-threatening emergencies' },
    { value: 'nearby', label: 'Very Close Only', description: 'Only alerts within 1km' },
    { value: 'custom', label: 'Custom Filter', description: 'Based on your preferences' }
  ];

  const dayOptions = [
    { value: 'monday', label: 'Monday' },
    { value: 'tuesday', label: 'Tuesday' },
    { value: 'wednesday', label: 'Wednesday' },
    { value: 'thursday', label: 'Thursday' },
    { value: 'friday', label: 'Friday' },
    { value: 'saturday', label: 'Saturday' },
    { value: 'sunday', label: 'Sunday' }
  ];

  const timeOptions = Array.from({ length: 24 }, (_, i) => {
    const hour = i?.toString()?.padStart(2, '0');
    return { value: `${hour}:00`, label: `${hour}:00` };
  });

  const handleSettingChange = (field, value) => {
    setSafetySettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTimeChange = (type, field, value) => {
    setSafetySettings(prev => ({
      ...prev,
      [type]: {
        ...prev?.[type],
        [field]: value
      }
    }));
  };

  const handleDayToggle = (day) => {
    setSafetySettings(prev => ({
      ...prev,
      availableDays: prev?.availableDays?.includes(day)
        ? prev?.availableDays?.filter(d => d !== day)
        : [...prev?.availableDays, day]
    }));
  };

  const handleEmergencyTypeToggle = (type) => {
    setSafetySettings(prev => ({
      ...prev,
      emergencyTypes: prev?.emergencyTypes?.includes(type)
        ? prev?.emergencyTypes?.filter(t => t !== type)
        : [...prev?.emergencyTypes, type]
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(safetySettings);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save safety settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setSafetySettings({
      availableHours: settings?.availableHours || { start: '08:00', end: '22:00' },
      availableDays: settings?.availableDays || ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      emergencyTypes: settings?.emergencyTypes || ['medical', 'fire', 'accident', 'security'],
      alertFrequency: settings?.alertFrequency || 'all',
      autoResponse: settings?.autoResponse || false,
      silentHours: settings?.silentHours || { enabled: false, start: '22:00', end: '08:00' },
      ...settings
    });
    setIsEditing(false);
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Icon name="Shield" size={20} className="text-primary mr-2" />
          <h2 className="text-lg font-semibold text-foreground">
            Safety Settings
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
        {/* Volunteer-specific settings */}
        {userRole === 'volunteer' && (
          <>
            {/* Availability Schedule */}
            <div>
              <h3 className="text-sm font-medium text-foreground mb-3">
                Availability Schedule
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Select
                  label="Available From"
                  options={timeOptions}
                  value={safetySettings?.availableHours?.start}
                  onChange={(value) => handleTimeChange('availableHours', 'start', value)}
                  disabled={!isEditing}
                />
                
                <Select
                  label="Available Until"
                  options={timeOptions}
                  value={safetySettings?.availableHours?.end}
                  onChange={(value) => handleTimeChange('availableHours', 'end', value)}
                  disabled={!isEditing}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Available Days
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {dayOptions?.map(day => (
                    <Checkbox
                      key={day?.value}
                      label={day?.label}
                      checked={safetySettings?.availableDays?.includes(day?.value)}
                      onChange={() => handleDayToggle(day?.value)}
                      disabled={!isEditing}
                    />
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Emergency Type Preferences */}
        <div>
          <h3 className="text-sm font-medium text-foreground mb-3">
            Emergency Types
          </h3>
          <p className="text-xs text-muted-foreground mb-4">
            {userRole === 'volunteer' ?'Select which types of emergencies you can help with' :'Select which types of emergencies you might need help with'
            }
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {emergencyTypeOptions?.map(type => (
              <div key={type?.value} className="border border-border rounded-lg p-3">
                <Checkbox
                  label={type?.label}
                  description={type?.description}
                  checked={safetySettings?.emergencyTypes?.includes(type?.value)}
                  onChange={() => handleEmergencyTypeToggle(type?.value)}
                  disabled={!isEditing}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Alert Frequency */}
        <div>
          <Select
            label="Alert Frequency"
            description={userRole === 'volunteer' ?'How many alerts would you like to receive?' :'How should we prioritize your emergency alerts?'
            }
            options={alertFrequencyOptions}
            value={safetySettings?.alertFrequency}
            onChange={(value) => handleSettingChange('alertFrequency', value)}
            disabled={!isEditing}
          />
        </div>

        {/* Silent Hours */}
        <div className="space-y-4">
          <Checkbox
            label="Enable Silent Hours"
            description="Reduce non-critical notifications during specified hours"
            checked={safetySettings?.silentHours?.enabled}
            onChange={(e) => handleTimeChange('silentHours', 'enabled', e?.target?.checked)}
            disabled={!isEditing}
          />

          {safetySettings?.silentHours?.enabled && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-6">
              <Select
                label="Silent From"
                options={timeOptions}
                value={safetySettings?.silentHours?.start}
                onChange={(value) => handleTimeChange('silentHours', 'start', value)}
                disabled={!isEditing}
              />
              
              <Select
                label="Silent Until"
                options={timeOptions}
                value={safetySettings?.silentHours?.end}
                onChange={(value) => handleTimeChange('silentHours', 'end', value)}
                disabled={!isEditing}
              />
            </div>
          )}
        </div>

        {/* Auto Response (Volunteer only) */}
        {userRole === 'volunteer' && (
          <Checkbox
            label="Enable Auto-Response"
            description="Automatically accept alerts that match your preferences during available hours"
            checked={safetySettings?.autoResponse}
            onChange={(e) => handleSettingChange('autoResponse', e?.target?.checked)}
            disabled={!isEditing}
          />
        )}

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
              Save Settings
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SafetySettings;