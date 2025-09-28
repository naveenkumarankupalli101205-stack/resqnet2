import React from 'react';
import Icon from '../../../components/AppIcon';

const RecentResponseCard = ({ 
  response = {},
  onViewDetails = () => {}
}) => {
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-success bg-success/10';
      case 'in-progress':
        return 'text-warning bg-warning/10';
      case 'cancelled':
        return 'text-muted-foreground bg-muted/10';
      default:
        return 'text-primary bg-primary/10';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return 'CheckCircle';
      case 'in-progress':
        return 'Clock';
      case 'cancelled':
        return 'XCircle';
      default:
        return 'AlertCircle';
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return date?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date?.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const formatDuration = (minutes) => {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  return (
    <div className="bg-card rounded-lg border border-border p-4 hover:shadow-sm transition-shadow duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center">
          <div className={`
            w-10 h-10 rounded-full flex items-center justify-center mr-3
            ${getEmergencyColor(response?.type)}
          `}>
            <Icon 
              name={getEmergencyIcon(response?.type)} 
              size={18} 
              strokeWidth={2}
            />
          </div>
          <div>
            <h4 className="font-medium text-foreground capitalize">
              {response?.type || 'Emergency'} Response
            </h4>
            <p className="text-sm text-muted-foreground">
              {formatDate(response?.timestamp)}
            </p>
          </div>
        </div>
        
        <div className={`
          flex items-center px-2 py-1 rounded-full text-xs font-medium
          ${getStatusColor(response?.status)}
        `}>
          <Icon 
            name={getStatusIcon(response?.status)} 
            size={12} 
            className="mr-1" 
          />
          <span className="capitalize">{response?.status}</span>
        </div>
      </div>
      {/* Location */}
      <div className="flex items-center mb-2">
        <Icon name="MapPin" size={14} className="text-muted-foreground mr-2" />
        <span className="text-sm text-foreground">{response?.location}</span>
      </div>
      {/* Response Details */}
      <div className="grid grid-cols-2 gap-4 mb-3 p-3 bg-muted/20 rounded-md">
        <div>
          <p className="text-xs text-muted-foreground">Response Time</p>
          <p className="text-sm font-medium text-foreground">
            {formatDuration(response?.responseTime || 0)}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Duration</p>
          <p className="text-sm font-medium text-foreground">
            {formatDuration(response?.duration || 0)}
          </p>
        </div>
      </div>
      {/* Outcome */}
      {response?.outcome && (
        <div className="mb-3">
          <p className="text-xs text-muted-foreground mb-1">Outcome</p>
          <p className="text-sm text-foreground">{response?.outcome}</p>
        </div>
      )}
      {/* Rating */}
      {response?.rating && (
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-muted-foreground">Victim Rating</span>
          <div className="flex items-center">
            {[...Array(5)]?.map((_, i) => (
              <Icon
                key={i}
                name="Star"
                size={12}
                className={`
                  ${i < response?.rating ? 'text-warning fill-current' : 'text-muted-foreground'}
                `}
              />
            ))}
            <span className="ml-1 text-xs text-muted-foreground">
              ({response?.rating}/5)
            </span>
          </div>
        </div>
      )}
      {/* Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className="flex items-center text-xs text-muted-foreground">
          <Icon name="Users" size={12} className="mr-1" />
          <span>ID: #{response?.id}</span>
        </div>
        <button
          onClick={() => onViewDetails(response)}
          className="text-xs text-primary hover:text-primary/80 transition-colors duration-150 font-medium"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default RecentResponseCard;