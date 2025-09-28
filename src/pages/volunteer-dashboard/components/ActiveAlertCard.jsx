import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ActiveAlertCard = ({ 
  alert = {},
  onAccept = () => {},
  onReject = () => {},
  isProcessing = false 
}) => {
  const [actionType, setActionType] = useState(null);

  const getEmergencyIcon = (type) => {
    switch (type) {
      case 'health':
        return 'Heart';
      case 'fire':
        return 'Flame';
      case 'accident':
        return 'Car';
      case 'security':
        return 'Shield';
      default:
        return 'AlertTriangle';
    }
  };

  const getEmergencyColor = (type) => {
    switch (type) {
      case 'health':
        return 'text-red-600 bg-red-50';
      case 'fire':
        return 'text-orange-600 bg-orange-50';
      case 'accident':
        return 'text-yellow-600 bg-yellow-50';
      case 'security':
        return 'text-blue-600 bg-blue-50';
      default:
        return 'text-primary bg-primary/10';
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'critical':
        return 'text-primary bg-primary/10';
      case 'high':
        return 'text-warning bg-warning/10';
      default:
        return 'text-muted-foreground bg-muted/10';
    }
  };

  const getDistanceText = (distance) => {
    if (distance < 1000) {
      return `${Math.round(distance)}m`;
    }
    return `${(distance / 1000)?.toFixed(1)}km`;
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const alertTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - alertTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const hours = Math.floor(diffInMinutes / 60);
    return `${hours}h ago`;
  };

  const handleAccept = () => {
    setActionType('accept');
    onAccept(alert);
  };

  const handleReject = () => {
    setActionType('reject');
    onReject(alert);
  };

  return (
    <div className="bg-card rounded-lg border border-border p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center">
          <div className={`
            w-10 h-10 rounded-full flex items-center justify-center mr-3
            ${getEmergencyColor(alert?.type)}
          `}>
            <Icon 
              name={getEmergencyIcon(alert?.type)} 
              size={20} 
              strokeWidth={2}
            />
          </div>
          <div>
            <h3 className="font-semibold text-foreground capitalize">
              {alert?.type || 'Emergency'} Alert
            </h3>
            <div className="flex items-center text-sm text-muted-foreground">
              <Icon name="Clock" size={14} className="mr-1" />
              <span>{getTimeAgo(alert?.timestamp)}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className={`
            px-2 py-1 rounded-full text-xs font-medium capitalize
            ${getUrgencyColor(alert?.urgency)}
          `}>
            {alert?.urgency || 'standard'}
          </span>
          <div className="flex items-center text-sm font-medium text-primary">
            <Icon name="MapPin" size={14} className="mr-1" />
            <span>{getDistanceText(alert?.distance)}</span>
          </div>
        </div>
      </div>
      {/* Location */}
      <div className="mb-3">
        <div className="flex items-center text-sm text-foreground">
          <Icon name="Navigation" size={14} className="mr-2 text-muted-foreground" />
          <span className="font-medium">{alert?.location}</span>
        </div>
      </div>
      {/* Description */}
      {alert?.description && (
        <div className="mb-4 p-3 bg-muted/30 rounded-md">
          <p className="text-sm text-foreground">{alert?.description}</p>
        </div>
      )}
      {/* Victim Info */}
      <div className="flex items-center mb-4 p-2 bg-muted/20 rounded-md">
        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-3">
          <Icon name="User" size={16} className="text-primary" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">
            {alert?.victimName || 'Anonymous'}
          </p>
          <p className="text-xs text-muted-foreground">
            Needs immediate assistance
          </p>
        </div>
      </div>
      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          size="default"
          onClick={handleReject}
          disabled={isProcessing}
          loading={isProcessing && actionType === 'reject'}
          iconName="X"
          iconPosition="left"
          iconSize={16}
          className="flex-1"
        >
          Decline
        </Button>
        <Button
          variant="default"
          size="default"
          onClick={handleAccept}
          disabled={isProcessing}
          loading={isProcessing && actionType === 'accept'}
          iconName="Check"
          iconPosition="left"
          iconSize={16}
          className="flex-1 bg-success hover:bg-success/90 text-success-foreground"
        >
          Respond
        </Button>
      </div>
      {/* Response Time Indicator */}
      <div className="mt-3 pt-3 border-t border-border">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Expected response time: 5-10 minutes</span>
          <div className="flex items-center">
            <Icon name="Users" size={12} className="mr-1" />
            <span>{alert?.nearbyVolunteers || 3} volunteers nearby</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveAlertCard;