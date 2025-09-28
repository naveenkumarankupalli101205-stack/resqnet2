import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AlertHistoryCard = ({ alert, userRole, onExport }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getEmergencyTypeIcon = (type) => {
    const iconMap = {
      'medical': 'Heart',
      'fire': 'Flame',
      'accident': 'Car',
      'security': 'Shield',
      'natural': 'CloudRain',
      'other': 'AlertTriangle'
    };
    return iconMap?.[type] || 'AlertTriangle';
  };

  const getStatusColor = (status) => {
    const colorMap = {
      'completed': 'text-success bg-success/10',
      'cancelled': 'text-muted-foreground bg-muted/20',
      'pending': 'text-warning bg-warning/10',
      'in-progress': 'text-accent bg-accent/10',
      'no-response': 'text-destructive bg-destructive/10'
    };
    return colorMap?.[status] || 'text-muted-foreground bg-muted/20';
  };

  const getUrgencyColor = (urgency) => {
    const colorMap = {
      'critical': 'text-primary',
      'high': 'text-warning',
      'medium': 'text-accent',
      'low': 'text-muted-foreground'
    };
    return colorMap?.[urgency] || 'text-muted-foreground';
  };

  const formatDuration = (minutes) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatDistance = (distance) => {
    if (distance < 1000) return `${Math.round(distance)}m`;
    return `${(distance / 1000)?.toFixed(1)}km`;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center mr-3">
            <Icon 
              name={getEmergencyTypeIcon(alert?.type)} 
              size={20} 
              className={getUrgencyColor(alert?.urgency)}
            />
          </div>
          <div>
            <h3 className="font-semibold text-foreground capitalize">
              {alert?.type} Emergency
            </h3>
            <p className="text-sm text-muted-foreground">
              {new Date(alert.timestamp)?.toLocaleDateString()} at {new Date(alert.timestamp)?.toLocaleTimeString()}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(alert?.status)}`}>
            {alert?.status?.replace('-', ' ')}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
            iconSize={16}
            className="p-1"
          />
        </div>
      </div>
      {/* Quick Info */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
        <div className="flex items-center">
          <Icon name="MapPin" size={14} className="text-muted-foreground mr-1" />
          <span className="text-sm text-foreground truncate">
            {alert?.location}
          </span>
        </div>
        {alert?.distance && (
          <div className="flex items-center">
            <Icon name="Navigation" size={14} className="text-muted-foreground mr-1" />
            <span className="text-sm text-foreground">
              {formatDistance(alert?.distance)}
            </span>
          </div>
        )}
        {alert?.responseTime && (
          <div className="flex items-center">
            <Icon name="Clock" size={14} className="text-muted-foreground mr-1" />
            <span className="text-sm text-foreground">
              {formatDuration(alert?.responseTime)}
            </span>
          </div>
        )}
        <div className="flex items-center">
          <Icon name="Users" size={14} className="text-muted-foreground mr-1" />
          <span className="text-sm text-foreground">
            {alert?.respondersCount || 0} helpers
          </span>
        </div>
      </div>
      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t border-border pt-4 space-y-4 animate-fade-in">
          {/* Description */}
          {alert?.description && (
            <div>
              <h4 className="text-sm font-medium text-foreground mb-2">Description</h4>
              <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
                {alert?.description}
              </p>
            </div>
          )}

          {/* Response Details */}
          {userRole === 'victim' && alert?.responders && alert?.responders?.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-foreground mb-2">Volunteers Who Helped</h4>
              <div className="space-y-2">
                {alert?.responders?.map((responder, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded-md">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-success/20 rounded-full flex items-center justify-center mr-2">
                        <Icon name="User" size={14} className="text-success" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{responder?.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Arrived in {formatDuration(responder?.arrivalTime)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Icon name="Star" size={14} className="text-warning mr-1" />
                      <span className="text-sm text-foreground">{responder?.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Volunteer Response Details */}
          {userRole === 'volunteer' && alert?.victimInfo && (
            <div>
              <h4 className="text-sm font-medium text-foreground mb-2">Emergency Details</h4>
              <div className="p-3 bg-muted/30 rounded-md">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Response Time:</span>
                  <span className="text-sm font-medium text-foreground">
                    {formatDuration(alert?.myResponseTime)}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Distance Traveled:</span>
                  <span className="text-sm font-medium text-foreground">
                    {formatDistance(alert?.distance)}
                  </span>
                </div>
                {alert?.feedback && (
                  <div className="mt-2 pt-2 border-t border-border">
                    <span className="text-sm text-muted-foreground">Feedback:</span>
                    <p className="text-sm text-foreground mt-1">{alert?.feedback}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Communication Log */}
          {alert?.communications && alert?.communications?.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-foreground mb-2">Communication Log</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {alert?.communications?.map((comm, index) => (
                  <div key={index} className="flex items-start p-2 bg-muted/20 rounded-md">
                    <Icon name="MessageCircle" size={14} className="text-muted-foreground mr-2 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-foreground">{comm?.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(comm.timestamp)?.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onExport(alert)}
                iconName="Download"
                iconPosition="left"
                iconSize={14}
              >
                Export
              </Button>
              {alert?.status === 'completed' && (
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="Star"
                  iconPosition="left"
                  iconSize={14}
                >
                  Rate
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Alert ID: {alert?.id}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertHistoryCard;