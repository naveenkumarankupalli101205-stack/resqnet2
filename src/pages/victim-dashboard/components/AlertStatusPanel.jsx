import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const AlertStatusPanel = ({ 
  activeAlert = null,
  volunteerResponses = [],
  onCancelAlert = () => {},
  onContactVolunteer = () => {}
}) => {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (!activeAlert) return;

    const startTime = new Date(activeAlert.timestamp);
    const timer = setInterval(() => {
      const now = new Date();
      const elapsed = Math.floor((now - startTime) / 1000);
      setElapsedTime(elapsed);
    }, 1000);

    return () => clearInterval(timer);
  }, [activeAlert]);

  const formatElapsedTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs?.toString()?.padStart(2, '0')}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'text-warning';
      case 'accepted':
        return 'text-success';
      case 'en_route':
        return 'text-accent';
      case 'arrived':
        return 'text-primary';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-warning/10';
      case 'accepted':
        return 'bg-success/10';
      case 'en_route':
        return 'bg-accent/10';
      case 'arrived':
        return 'bg-primary/10';
      default:
        return 'bg-muted/10';
    }
  };

  if (!activeAlert) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 text-center">
        <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="Shield" size={24} className="text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No Active Emergency</h3>
        <p className="text-sm text-muted-foreground">
          Your emergency network is ready. Press SOS if you need immediate assistance.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Alert Header */}
      <div className="bg-primary/5 border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
              <Icon name="AlertTriangle" size={20} className="text-primary animate-pulse" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Emergency Alert Active</h3>
              <p className="text-sm text-muted-foreground">
                {activeAlert?.type && `${activeAlert?.type?.charAt(0)?.toUpperCase() + activeAlert?.type?.slice(1)} Emergency`}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-mono font-bold text-primary">
              {formatElapsedTime(elapsedTime)}
            </div>
            <p className="text-xs text-muted-foreground">elapsed</p>
          </div>
        </div>
      </div>
      {/* Alert Details */}
      <div className="p-4 space-y-4">
        {/* Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Status:</span>
          <div className={`
            px-3 py-1 rounded-full text-xs font-medium capitalize
            ${getStatusColor(activeAlert?.status)} ${getStatusBg(activeAlert?.status)}
          `}>
            {activeAlert?.status === 'en_route' ? 'En Route' : activeAlert?.status}
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Location:</span>
          <span className="text-sm font-medium text-foreground">
            {activeAlert?.location || 'Current location'}
          </span>
        </div>

        {/* Volunteers Notified */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Volunteers notified:</span>
          <span className="text-sm font-medium text-foreground">
            {activeAlert?.volunteersNotified || 0}
          </span>
        </div>
      </div>
      {/* Volunteer Responses */}
      {volunteerResponses?.length > 0 && (
        <div className="border-t border-border">
          <div className="p-4">
            <h4 className="font-semibold text-foreground mb-3">
              Volunteer Responses ({volunteerResponses?.length})
            </h4>
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {volunteerResponses?.map((response) => (
                <div key={response?.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center mr-3">
                      <Icon name="User" size={16} className="text-success" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {response?.volunteerName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {response?.distance}m away • ETA: {response?.eta} min
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => onContactVolunteer(response)}
                    className="p-2 hover:bg-muted rounded-md transition-colors duration-150"
                    title="Contact volunteer"
                  >
                    <Icon name="Phone" size={16} className="text-accent" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* Actions */}
      <div className="border-t border-border p-4">
        <button
          onClick={() => onCancelAlert(activeAlert?.id)}
          className="w-full px-4 py-2 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-lg font-medium transition-colors duration-150 flex items-center justify-center"
        >
          <Icon name="X" size={16} className="mr-2" />
          Cancel Emergency Alert
        </button>
      </div>
    </div>
  );
};

export default AlertStatusPanel;