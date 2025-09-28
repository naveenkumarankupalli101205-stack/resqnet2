import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const AlertNotificationOverlay = ({ 
  alert = null,
  isVisible = false,
  onAccept = () => {},
  onReject = () => {},
  onClose = () => {},
  autoCloseDelay = 30000 // 30 seconds
}) => {
  const [timeRemaining, setTimeRemaining] = useState(autoCloseDelay / 1000);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!isVisible || !alert) return;

    // Haptic feedback for incoming alert
    if (navigator.vibrate) {
      navigator.vibrate([300, 100, 300, 100, 300]);
    }

    // Auto-close timer
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isVisible, alert, onClose]);

  useEffect(() => {
    if (isVisible) {
      setTimeRemaining(autoCloseDelay / 1000);
    }
  }, [isVisible, autoCloseDelay]);

  const handleAccept = async () => {
    setIsProcessing(true);
    
    // Haptic feedback for acceptance
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100]);
    }

    try {
      await onAccept(alert);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    setIsProcessing(true);
    
    try {
      await onReject(alert);
    } finally {
      setIsProcessing(false);
    }
  };

  const getDistanceText = (distance) => {
    if (distance < 1000) {
      return `${Math.round(distance)}m away`;
    }
    return `${(distance / 1000)?.toFixed(1)}km away`;
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'critical':
        return 'text-primary';
      case 'high':
        return 'text-warning';
      default:
        return 'text-muted-foreground';
    }
  };

  const getUrgencyBg = (urgency) => {
    switch (urgency) {
      case 'critical':
        return 'bg-primary/10';
      case 'high':
        return 'bg-warning/10';
      default:
        return 'bg-muted/10';
    }
  };

  if (!isVisible || !alert) return null;

  return (
    <div className="fixed inset-0 z-alert bg-black/60 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-card rounded-lg max-w-md w-full shadow-emergency-lg animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
              <Icon name="AlertTriangle" size={20} className="text-primary animate-pulse" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Emergency Alert</h3>
              <p className="text-sm text-muted-foreground">
                Auto-closes in {timeRemaining}s
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded-md transition-colors duration-150"
            disabled={isProcessing}
          >
            <Icon name="X" size={18} className="text-muted-foreground" />
          </button>
        </div>

        {/* Alert Details */}
        <div className="p-4 space-y-4">
          {/* Location and Distance */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Icon name="MapPin" size={16} className="text-muted-foreground mr-2" />
              <span className="text-sm text-foreground">
                {alert?.location || 'Location unavailable'}
              </span>
            </div>
            {alert?.distance && (
              <span className="text-sm font-medium text-primary">
                {getDistanceText(alert?.distance)}
              </span>
            )}
          </div>

          {/* Urgency Level */}
          <div className="flex items-center">
            <Icon name="Clock" size={16} className="text-muted-foreground mr-2" />
            <span className="text-sm text-foreground mr-2">Urgency:</span>
            <span className={`
              text-sm font-medium px-2 py-1 rounded-full capitalize
              ${getUrgencyColor(alert?.urgency)} ${getUrgencyBg(alert?.urgency)}
            `}>
              {alert?.urgency || 'standard'}
            </span>
          </div>

          {/* Alert Type */}
          {alert?.type && (
            <div className="flex items-center">
              <Icon name="Info" size={16} className="text-muted-foreground mr-2" />
              <span className="text-sm text-foreground mr-2">Type:</span>
              <span className="text-sm font-medium text-foreground capitalize">
                {alert?.type}
              </span>
            </div>
          )}

          {/* Additional Details */}
          {alert?.description && (
            <div className="p-3 bg-muted/50 rounded-md">
              <p className="text-sm text-foreground">
                {alert?.description}
              </p>
            </div>
          )}

          {/* Timestamp */}
          <div className="flex items-center text-xs text-muted-foreground">
            <Icon name="Clock" size={14} className="mr-1" />
            <span className="font-mono">
              {alert?.timestamp ? new Date(alert.timestamp)?.toLocaleTimeString() : 'Just now'}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-4 border-t border-border">
          <Button
            variant="outline"
            size="default"
            onClick={handleReject}
            disabled={isProcessing}
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
            loading={isProcessing}
            iconName="Check"
            iconPosition="left"
            iconSize={16}
            className="flex-1 bg-success hover:bg-success/90 text-success-foreground"
          >
            Respond
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-muted">
          <div 
            className="h-full bg-primary transition-all duration-1000 ease-linear"
            style={{ 
              width: `${((autoCloseDelay / 1000 - timeRemaining) / (autoCloseDelay / 1000)) * 100}%` 
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AlertNotificationOverlay;