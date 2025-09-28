import React, { useState } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const EmergencyActionButton = ({ 
  onEmergencyAction = () => {}, 
  isActive = false, 
  position = 'floating', // 'floating' | 'inline' | 'overlay'
  size = 'default' // 'sm' | 'default' | 'lg'
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const handleEmergencyClick = () => {
    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200]);
    }

    setIsPressed(true);
    onEmergencyAction();

    // Reset pressed state
    setTimeout(() => setIsPressed(false), 300);
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-10 h-10';
      case 'lg':
        return 'w-16 h-16';
      default:
        return 'w-14 h-14';
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm':
        return 18;
      case 'lg':
        return 28;
      default:
        return 24;
    }
  };

  if (position === 'floating') {
    return (
      <button
        onClick={handleEmergencyClick}
        className={`
          fixed bottom-6 right-6 z-emergency
          ${getSizeClasses()}
          bg-primary hover:bg-primary/90 active:bg-primary/80
          text-primary-foreground rounded-full
          shadow-emergency-lg hover:shadow-emergency-md
          flex items-center justify-center
          transition-all duration-200
          ${isPressed ? 'scale-95' : 'hover:scale-105'}
          ${isActive ? 'animate-pulse-emergency' : ''}
          focus:outline-none focus:ring-4 focus:ring-primary/30
        `}
        style={{ touchAction: 'manipulation' }}
        aria-label="Emergency SOS Button"
      >
        <Icon 
          name="AlertTriangle" 
          size={getIconSize()} 
          strokeWidth={2.5}
          className={isActive ? 'animate-pulse' : ''}
        />
      </button>
    );
  }

  if (position === 'overlay') {
    return (
      <div className="fixed inset-0 z-alert bg-black/50 flex items-center justify-center p-4">
        <div className="bg-card rounded-lg p-6 max-w-sm w-full text-center shadow-emergency-lg">
          <div className="mb-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Icon name="AlertTriangle" size={32} className="text-primary" strokeWidth={2} />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Emergency Alert
            </h3>
            <p className="text-sm text-muted-foreground">
              Press and hold to send emergency alert to nearby volunteers
            </p>
          </div>
          
          <Button
            variant="destructive"
            size="lg"
            onClick={handleEmergencyClick}
            iconName="AlertTriangle"
            iconPosition="left"
            iconSize={20}
            fullWidth
            className="font-bold mb-3"
          >
            SEND SOS ALERT
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => {}}
            fullWidth
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  // Inline position
  return (
    <Button
      variant="destructive"
      size={size}
      onClick={handleEmergencyClick}
      iconName="AlertTriangle"
      iconPosition="left"
      iconSize={getIconSize()}
      className={`
        font-bold shadow-emergency-md
        ${isPressed ? 'scale-95' : ''}
        ${isActive ? 'animate-pulse-emergency' : ''}
        transition-transform duration-200
      `}
    >
      {size === 'sm' ? 'SOS' : 'EMERGENCY SOS'}
    </Button>
  );
};

export default EmergencyActionButton;