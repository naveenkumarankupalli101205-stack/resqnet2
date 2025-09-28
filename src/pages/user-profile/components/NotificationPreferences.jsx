import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const NotificationPreferences = ({ preferences = {}, onSave = () => {} }) => {
  const [settings, setSettings] = useState({
    emergencyAlerts: preferences?.emergencyAlerts ?? true,
    volunteerResponses: preferences?.volunteerResponses ?? true,
    statusUpdates: preferences?.statusUpdates ?? true,
    communityNews: preferences?.communityNews ?? false,
    soundEnabled: preferences?.soundEnabled ?? true,
    vibrationEnabled: preferences?.vibrationEnabled ?? true,
    emailNotifications: preferences?.emailNotifications ?? true,
    smsNotifications: preferences?.smsNotifications ?? false,
    pushNotifications: preferences?.pushNotifications ?? true,
    alertSound: preferences?.alertSound || 'emergency',
    quietHours: preferences?.quietHours || { enabled: false, start: '22:00', end: '08:00' },
    ...preferences
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const alertSoundOptions = [
    { value: 'emergency', label: 'Emergency Siren' },
    { value: 'urgent', label: 'Urgent Beep' },
    { value: 'gentle', label: 'Gentle Chime' },
    { value: 'vibrate', label: 'Vibration Only' },
    { value: 'silent', label: 'Silent' }
  ];

  const timeOptions = Array.from({ length: 24 }, (_, i) => {
    const hour = i?.toString()?.padStart(2, '0');
    return { value: `${hour}:00`, label: `${hour}:00` };
  });

  const handleSettingChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleQuietHoursChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      quietHours: {
        ...prev?.quietHours,
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(settings);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save notification preferences:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setSettings({
      emergencyAlerts: preferences?.emergencyAlerts ?? true,
      volunteerResponses: preferences?.volunteerResponses ?? true,
      statusUpdates: preferences?.statusUpdates ?? true,
      communityNews: preferences?.communityNews ?? false,
      soundEnabled: preferences?.soundEnabled ?? true,
      vibrationEnabled: preferences?.vibrationEnabled ?? true,
      emailNotifications: preferences?.emailNotifications ?? true,
      smsNotifications: preferences?.smsNotifications ?? false,
      pushNotifications: preferences?.pushNotifications ?? true,
      alertSound: preferences?.alertSound || 'emergency',
      quietHours: preferences?.quietHours || { enabled: false, start: '22:00', end: '08:00' },
      ...preferences
    });
    setIsEditing(false);
  };

  const testNotification = () => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('ResQNet Test', {
        body: 'This is how emergency notifications will appear.',
        icon: '/favicon.ico'
      });
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Icon name="Bell" size={20} className="text-primary mr-2" />
          <h2 className="text-lg font-semibold text-foreground">
            Notification Preferences
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
        {/* Notification Types */}
        <div>
          <h3 className="text-sm font-medium text-foreground mb-4">
            Notification Types
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border border-border rounded-lg">
              <div className="flex items-center">
                <Icon name="AlertTriangle" size={16} className="text-primary mr-3" />
                <div>
                  <span className="text-sm font-medium text-foreground">Emergency Alerts</span>
                  <p className="text-xs text-muted-foreground">Critical emergency notifications</p>
                </div>
              </div>
              <Checkbox
                checked={settings?.emergencyAlerts}
                onChange={(e) => handleSettingChange('emergencyAlerts', e?.target?.checked)}
                disabled={!isEditing}
              />
            </div>

            <div className="flex items-center justify-between p-3 border border-border rounded-lg">
              <div className="flex items-center">
                <Icon name="Users" size={16} className="text-success mr-3" />
                <div>
                  <span className="text-sm font-medium text-foreground">Volunteer Responses</span>
                  <p className="text-xs text-muted-foreground">When volunteers accept your alerts</p>
                </div>
              </div>
              <Checkbox
                checked={settings?.volunteerResponses}
                onChange={(e) => handleSettingChange('volunteerResponses', e?.target?.checked)}
                disabled={!isEditing}
              />
            </div>

            <div className="flex items-center justify-between p-3 border border-border rounded-lg">
              <div className="flex items-center">
                <Icon name="Info" size={16} className="text-muted-foreground mr-3" />
                <div>
                  <span className="text-sm font-medium text-foreground">Status Updates</span>
                  <p className="text-xs text-muted-foreground">Alert resolution and progress updates</p>
                </div>
              </div>
              <Checkbox
                checked={settings?.statusUpdates}
                onChange={(e) => handleSettingChange('statusUpdates', e?.target?.checked)}
                disabled={!isEditing}
              />
            </div>

            <div className="flex items-center justify-between p-3 border border-border rounded-lg">
              <div className="flex items-center">
                <Icon name="MessageSquare" size={16} className="text-muted-foreground mr-3" />
                <div>
                  <span className="text-sm font-medium text-foreground">Community News</span>
                  <p className="text-xs text-muted-foreground">Safety tips and community updates</p>
                </div>
              </div>
              <Checkbox
                checked={settings?.communityNews}
                onChange={(e) => handleSettingChange('communityNews', e?.target?.checked)}
                disabled={!isEditing}
              />
            </div>
          </div>
        </div>

        {/* Delivery Methods */}
        <div>
          <h3 className="text-sm font-medium text-foreground mb-4">
            Delivery Methods
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-3 border border-border rounded-lg">
              <div className="flex items-center">
                <Icon name="Smartphone" size={16} className="text-primary mr-2" />
                <span className="text-sm font-medium text-foreground">Push</span>
              </div>
              <Checkbox
                checked={settings?.pushNotifications}
                onChange={(e) => handleSettingChange('pushNotifications', e?.target?.checked)}
                disabled={!isEditing}
              />
            </div>

            <div className="flex items-center justify-between p-3 border border-border rounded-lg">
              <div className="flex items-center">
                <Icon name="Mail" size={16} className="text-primary mr-2" />
                <span className="text-sm font-medium text-foreground">Email</span>
              </div>
              <Checkbox
                checked={settings?.emailNotifications}
                onChange={(e) => handleSettingChange('emailNotifications', e?.target?.checked)}
                disabled={!isEditing}
              />
            </div>

            <div className="flex items-center justify-between p-3 border border-border rounded-lg">
              <div className="flex items-center">
                <Icon name="MessageCircle" size={16} className="text-primary mr-2" />
                <span className="text-sm font-medium text-foreground">SMS</span>
              </div>
              <Checkbox
                checked={settings?.smsNotifications}
                onChange={(e) => handleSettingChange('smsNotifications', e?.target?.checked)}
                disabled={!isEditing}
              />
            </div>
          </div>
        </div>

        {/* Sound & Vibration */}
        <div>
          <h3 className="text-sm font-medium text-foreground mb-4">
            Sound & Vibration
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div className="flex items-center">
                  <Icon name="Volume2" size={16} className="text-primary mr-2" />
                  <span className="text-sm font-medium text-foreground">Sound Alerts</span>
                </div>
                <Checkbox
                  checked={settings?.soundEnabled}
                  onChange={(e) => handleSettingChange('soundEnabled', e?.target?.checked)}
                  disabled={!isEditing}
                />
              </div>

              <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div className="flex items-center">
                  <Icon name="Vibrate" size={16} className="text-primary mr-2" />
                  <span className="text-sm font-medium text-foreground">Vibration</span>
                </div>
                <Checkbox
                  checked={settings?.vibrationEnabled}
                  onChange={(e) => handleSettingChange('vibrationEnabled', e?.target?.checked)}
                  disabled={!isEditing}
                />
              </div>
            </div>

            {settings?.soundEnabled && (
              <div className="flex gap-4">
                <div className="flex-1">
                  <Select
                    label="Alert Sound"
                    options={alertSoundOptions}
                    value={settings?.alertSound}
                    onChange={(value) => handleSettingChange('alertSound', value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={testNotification}
                    iconName="Play"
                    iconPosition="left"
                    iconSize={16}
                  >
                    Test
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quiet Hours */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-foreground">
              Quiet Hours
            </h3>
            <Checkbox
              label="Enable"
              checked={settings?.quietHours?.enabled}
              onChange={(e) => handleQuietHoursChange('enabled', e?.target?.checked)}
              disabled={!isEditing}
            />
          </div>

          {settings?.quietHours?.enabled && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Quiet From"
                options={timeOptions}
                value={settings?.quietHours?.start}
                onChange={(value) => handleQuietHoursChange('start', value)}
                disabled={!isEditing}
              />
              
              <Select
                label="Quiet Until"
                options={timeOptions}
                value={settings?.quietHours?.end}
                onChange={(value) => handleQuietHoursChange('end', value)}
                disabled={!isEditing}
              />
            </div>
          )}

          <p className="text-xs text-muted-foreground mt-2">
            Emergency alerts will still come through during quiet hours
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

export default NotificationPreferences;