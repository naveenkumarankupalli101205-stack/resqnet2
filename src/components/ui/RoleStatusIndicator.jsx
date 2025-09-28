import React, { useState } from 'react';
import Icon from '../AppIcon';

const RoleStatusIndicator = ({ 
  userRole = 'volunteer', 
  isAvailable = true, 
  emergencyStatus = false,
  onStatusToggle = () => {},
  showToggle = true,
  compact = false
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getRoleConfig = () => {
    switch (userRole) {
      case 'victim':
        return {
          label: 'Help Seeker',
          icon: 'User',
          color: emergencyStatus ? 'text-primary' : 'text-muted-foreground',
          bgColor: emergencyStatus ? 'bg-primary/10' : 'bg-muted'
        };
      case 'volunteer':
        return {
          label: 'Volunteer',
          icon: 'Heart',
          color: isAvailable ? 'text-success' : 'text-muted-foreground',
          bgColor: isAvailable ? 'bg-success/10' : 'bg-muted'
        };
      default:
        return {
          label: 'User',
          icon: 'User',
          color: 'text-muted-foreground',
          bgColor: 'bg-muted'
        };
    }
  };

  const getStatusText = () => {
    if (userRole === 'victim') {
      return emergencyStatus ? 'Emergency Active' : 'Safe';
    }
    return isAvailable ? 'Available' : 'Unavailable';
  };

  const getStatusDot = () => {
    if (userRole === 'victim') {
      return emergencyStatus ? 'bg-primary animate-pulse-emergency' : 'bg-success';
    }
    return isAvailable ? 'bg-success' : 'bg-muted-foreground';
  };

  const roleConfig = getRoleConfig();

  const handleToggle = () => {
    if (showToggle && userRole === 'volunteer') {
      onStatusToggle(!isAvailable);
    }
  };

  if (compact) {
    return (
      <div className="flex items-center">
        <div className={`w-2 h-2 rounded-full mr-2 ${getStatusDot()}`} />
        <span className="text-xs font-medium text-muted-foreground capitalize">
          {userRole}
        </span>
      </div>
    );
  }

  return (
    <div className="relative">
      <div 
        className={`
          flex items-center px-3 py-2 rounded-lg cursor-pointer
          ${roleConfig?.bgColor} hover:bg-opacity-80
          transition-all duration-200
          ${isExpanded ? 'shadow-emergency-sm' : ''}
        `}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className={`w-2 h-2 rounded-full mr-2 ${getStatusDot()}`} />
        <Icon 
          name={roleConfig?.icon} 
          size={16} 
          className={`mr-2 ${roleConfig?.color}`} 
        />
        <span className="text-sm font-medium text-foreground capitalize mr-2">
          {userRole}
        </span>
        <Icon 
          name={isExpanded ? "ChevronUp" : "ChevronDown"} 
          size={14} 
          className="text-muted-foreground" 
        />
      </div>
      {isExpanded && (
        <div className="absolute right-0 top-full mt-1 w-64 bg-popover border border-border rounded-md shadow-emergency-md z-50 animate-fade-in">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <Icon 
                  name={roleConfig?.icon} 
                  size={20} 
                  className={roleConfig?.color} 
                />
                <span className="ml-2 font-semibold text-popover-foreground">
                  {roleConfig?.label}
                </span>
              </div>
              <div className={`w-3 h-3 rounded-full ${getStatusDot()}`} />
            </div>

            <div className="mb-3">
              <p className="text-sm text-muted-foreground mb-1">Status:</p>
              <p className="text-sm font-medium text-popover-foreground">
                {getStatusText()}
              </p>
            </div>

            {userRole === 'volunteer' && showToggle && (
              <div className="flex items-center justify-between pt-3 border-t border-border">
                <span className="text-sm text-popover-foreground">
                  Available for alerts
                </span>
                <button
                  onClick={(e) => {
                    e?.stopPropagation();
                    handleToggle();
                  }}
                  className={`
                    relative inline-flex h-6 w-11 items-center rounded-full
                    transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                    ${isAvailable ? 'bg-success' : 'bg-muted-foreground'}
                  `}
                >
                  <span
                    className={`
                      inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200
                      ${isAvailable ? 'translate-x-6' : 'translate-x-1'}
                    `}
                  />
                </button>
              </div>
            )}

            {userRole === 'victim' && emergencyStatus && (
              <div className="pt-3 border-t border-border">
                <div className="flex items-center text-primary">
                  <Icon name="AlertTriangle" size={16} className="mr-2" />
                  <span className="text-sm font-medium">
                    Emergency alert active
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleStatusIndicator;