import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const ProfileHeader = ({ 
  user, 
  onRoleSwitch = () => {}, 
  canSwitchRole = true 
}) => {
  const getRoleConfig = (role) => {
    switch (role) {
      case 'victim':
        return {
          label: 'Help Seeker',
          icon: 'User',
          color: 'text-primary',
          bgColor: 'bg-primary/10'
        };
      case 'volunteer':
        return {
          label: 'Volunteer Helper',
          icon: 'Heart',
          color: 'text-success',
          bgColor: 'bg-success/10'
        };
      default:
        return {
          label: 'Community Member',
          icon: 'User',
          color: 'text-muted-foreground',
          bgColor: 'bg-muted'
        };
    }
  };

  const roleConfig = getRoleConfig(user?.role);

  return (
    <div className="bg-card rounded-lg border border-border p-6 mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
        {/* Profile Image */}
        <div className="relative">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-muted">
            <Image
              src={user?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"}
              alt={`${user?.name}'s profile`}
              className="w-full h-full object-cover"
            />
          </div>
          <div className={`absolute -bottom-1 -right-1 w-8 h-8 rounded-full ${roleConfig?.bgColor} flex items-center justify-center border-2 border-card`}>
            <Icon 
              name={roleConfig?.icon} 
              size={16} 
              className={roleConfig?.color} 
            />
          </div>
        </div>

        {/* Profile Info */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-1">
                {user?.name}
              </h1>
              <p className="text-muted-foreground mb-2">
                {user?.email}
              </p>
              <div className="flex items-center gap-2">
                <div className={`px-3 py-1 rounded-full ${roleConfig?.bgColor}`}>
                  <span className={`text-sm font-medium ${roleConfig?.color}`}>
                    {roleConfig?.label}
                  </span>
                </div>
                {user?.verified && (
                  <div className="flex items-center text-success">
                    <Icon name="CheckCircle" size={16} className="mr-1" />
                    <span className="text-sm font-medium">Verified</span>
                  </div>
                )}
              </div>
            </div>

            {/* Role Switch */}
            {canSwitchRole && (
              <div className="flex flex-col items-end gap-2">
                <span className="text-sm text-muted-foreground">Switch Role</span>
                <button
                  onClick={onRoleSwitch}
                  className="flex items-center px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors duration-200"
                >
                  <Icon 
                    name={user?.role === 'victim' ? 'Heart' : 'User'} 
                    size={16} 
                    className="mr-2" 
                  />
                  <span className="text-sm font-medium">
                    {user?.role === 'victim' ? 'Become Volunteer' : 'Need Help'}
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="flex gap-6 mt-4 pt-4 border-t border-border">
            <div className="text-center">
              <div className="text-lg font-bold text-foreground">
                {user?.stats?.totalAlerts || 0}
              </div>
              <div className="text-xs text-muted-foreground">
                {user?.role === 'victim' ? 'Alerts Sent' : 'Responses'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-foreground">
                {user?.stats?.responseTime || 'N/A'}
              </div>
              <div className="text-xs text-muted-foreground">
                Avg Response
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-success">
                {user?.stats?.trustScore || 0}%
              </div>
              <div className="text-xs text-muted-foreground">
                Trust Score
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;