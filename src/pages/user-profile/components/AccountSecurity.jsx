import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';


const AccountSecurity = ({ securitySettings = {}, onSave = () => {} }) => {
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(securitySettings?.twoFactorEnabled || false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const sessions = [
    {
      id: 1,
      device: "Chrome on Windows",
      location: "New York, NY",
      lastActive: "2 minutes ago",
      isCurrent: true
    },
    {
      id: 2,
      device: "Safari on iPhone",
      location: "New York, NY", 
      lastActive: "1 hour ago",
      isCurrent: false
    },
    {
      id: 3,
      device: "Firefox on MacOS",
      location: "New York, NY",
      lastActive: "2 days ago",
      isCurrent: false
    }
  ];

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validatePassword = () => {
    const newErrors = {};

    if (!passwordData?.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!passwordData?.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordData?.newPassword?.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/?.test(passwordData?.newPassword)) {
      newErrors.newPassword = 'Password must contain uppercase, lowercase, and number';
    }

    if (!passwordData?.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (passwordData?.newPassword !== passwordData?.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handlePasswordSubmit = async () => {
    if (!validatePassword()) return;

    setIsUpdating(true);
    try {
      await onSave({ type: 'password', data: passwordData });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setIsChangingPassword(false);
    } catch (error) {
      console.error('Failed to update password:', error);
      setErrors({ submit: 'Failed to update password. Please try again.' });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleTwoFactorToggle = async () => {
    setIsUpdating(true);
    try {
      const newValue = !twoFactorEnabled;
      await onSave({ type: 'twoFactor', enabled: newValue });
      setTwoFactorEnabled(newValue);
    } catch (error) {
      console.error('Failed to update 2FA:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSessionRevoke = async (sessionId) => {
    try {
      await onSave({ type: 'revokeSession', sessionId });
    } catch (error) {
      console.error('Failed to revoke session:', error);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev?.[field]
    }));
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center mb-6">
        <Icon name="Lock" size={20} className="text-primary mr-2" />
        <h2 className="text-lg font-semibold text-foreground">
          Account Security
        </h2>
      </div>
      <div className="space-y-6">
        {/* Password Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-medium text-foreground">Password</h3>
              <p className="text-xs text-muted-foreground">
                Last changed: {securitySettings?.lastPasswordChange || 'Never'}
              </p>
            </div>
            {!isChangingPassword && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsChangingPassword(true)}
                iconName="Edit"
                iconPosition="left"
                iconSize={16}
              >
                Change Password
              </Button>
            )}
          </div>

          {isChangingPassword && (
            <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
              <div className="relative">
                <Input
                  label="Current Password"
                  type={showPasswords?.current ? "text" : "password"}
                  value={passwordData?.currentPassword}
                  onChange={(e) => handlePasswordChange('currentPassword', e?.target?.value)}
                  error={errors?.currentPassword}
                  required
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('current')}
                  className="absolute right-3 top-8 text-muted-foreground hover:text-foreground"
                >
                  <Icon name={showPasswords?.current ? "EyeOff" : "Eye"} size={16} />
                </button>
              </div>

              <div className="relative">
                <Input
                  label="New Password"
                  type={showPasswords?.new ? "text" : "password"}
                  value={passwordData?.newPassword}
                  onChange={(e) => handlePasswordChange('newPassword', e?.target?.value)}
                  error={errors?.newPassword}
                  required
                  placeholder="Enter new password"
                  description="Must be at least 8 characters with uppercase, lowercase, and number"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('new')}
                  className="absolute right-3 top-8 text-muted-foreground hover:text-foreground"
                >
                  <Icon name={showPasswords?.new ? "EyeOff" : "Eye"} size={16} />
                </button>
              </div>

              <div className="relative">
                <Input
                  label="Confirm New Password"
                  type={showPasswords?.confirm ? "text" : "password"}
                  value={passwordData?.confirmPassword}
                  onChange={(e) => handlePasswordChange('confirmPassword', e?.target?.value)}
                  error={errors?.confirmPassword}
                  required
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirm')}
                  className="absolute right-3 top-8 text-muted-foreground hover:text-foreground"
                >
                  <Icon name={showPasswords?.confirm ? "EyeOff" : "Eye"} size={16} />
                </button>
              </div>

              {errors?.submit && (
                <div className="text-sm text-destructive">{errors?.submit}</div>
              )}

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsChangingPassword(false);
                    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                    setErrors({});
                  }}
                  disabled={isUpdating}
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  onClick={handlePasswordSubmit}
                  loading={isUpdating}
                  iconName="Save"
                  iconPosition="left"
                  iconSize={16}
                >
                  Update Password
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Two-Factor Authentication */}
        <div className="flex items-center justify-between p-4 border border-border rounded-lg">
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
              twoFactorEnabled ? 'bg-success/10' : 'bg-muted'
            }`}>
              <Icon 
                name="Smartphone" 
                size={20} 
                className={twoFactorEnabled ? 'text-success' : 'text-muted-foreground'} 
              />
            </div>
            <div>
              <h3 className="text-sm font-medium text-foreground">
                Two-Factor Authentication
              </h3>
              <p className="text-xs text-muted-foreground">
                {twoFactorEnabled ? 'Enabled' : 'Add an extra layer of security'}
              </p>
            </div>
          </div>
          <Button
            variant={twoFactorEnabled ? "outline" : "default"}
            size="sm"
            onClick={handleTwoFactorToggle}
            loading={isUpdating}
            iconName={twoFactorEnabled ? "Shield" : "ShieldCheck"}
            iconPosition="left"
            iconSize={16}
          >
            {twoFactorEnabled ? 'Manage' : 'Enable'}
          </Button>
        </div>

        {/* Active Sessions */}
        <div>
          <h3 className="text-sm font-medium text-foreground mb-4">
            Active Sessions
          </h3>
          <div className="space-y-3">
            {sessions?.map(session => (
              <div key={session?.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center mr-3">
                    <Icon name="Monitor" size={16} className="text-muted-foreground" />
                  </div>
                  <div>
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-foreground">
                        {session?.device}
                      </span>
                      {session?.isCurrent && (
                        <span className="ml-2 px-2 py-1 bg-success/10 text-success text-xs font-medium rounded-full">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {session?.location} • {session?.lastActive}
                    </p>
                  </div>
                </div>
                {!session?.isCurrent && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSessionRevoke(session?.id)}
                    iconName="LogOut"
                    iconSize={16}
                    className="text-destructive hover:text-destructive"
                  >
                    Revoke
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Security Recommendations */}
        <div className="bg-muted/50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-foreground mb-3 flex items-center">
            <Icon name="Shield" size={16} className="mr-2 text-success" />
            Security Recommendations
          </h3>
          <ul className="space-y-2 text-xs text-muted-foreground">
            <li className="flex items-center">
              <Icon name="Check" size={12} className="mr-2 text-success" />
              Use a strong, unique password
            </li>
            <li className="flex items-center">
              <Icon name={twoFactorEnabled ? "Check" : "AlertCircle"} size={12} className={`mr-2 ${twoFactorEnabled ? 'text-success' : 'text-warning'}`} />
              Enable two-factor authentication
            </li>
            <li className="flex items-center">
              <Icon name="Check" size={12} className="mr-2 text-success" />
              Keep your emergency contacts updated
            </li>
            <li className="flex items-center">
              <Icon name="AlertCircle" size={12} className="mr-2 text-warning" />
              Review active sessions regularly
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AccountSecurity;