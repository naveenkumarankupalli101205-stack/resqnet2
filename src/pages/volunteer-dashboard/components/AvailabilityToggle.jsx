import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const AvailabilityToggle = ({ 
  isAvailable = true, 
  onToggle = () => {},
  isLoading = false 
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggle = () => {
    if (isLoading) return;
    
    setIsAnimating(true);
    onToggle(!isAvailable);
    
    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <div className="bg-card rounded-lg p-4 border border-border">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={`
            w-3 h-3 rounded-full mr-3 transition-colors duration-200
            ${isAvailable ? 'bg-success animate-pulse' : 'bg-muted-foreground'}
          `} />
          <div>
            <h3 className="font-semibold text-foreground">Volunteer Status</h3>
            <p className="text-sm text-muted-foreground">
              {isAvailable ? 'Available for emergency alerts' : 'Currently unavailable'}
            </p>
          </div>
        </div>
        
        <button
          onClick={handleToggle}
          disabled={isLoading}
          className={`
            relative inline-flex h-8 w-14 items-center rounded-full
            transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
            ${isAvailable ? 'bg-success' : 'bg-muted-foreground'}
            ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            ${isAnimating ? 'scale-95' : 'hover:scale-105'}
          `}
        >
          <span
            className={`
              inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-300 shadow-sm
              ${isAvailable ? 'translate-x-7' : 'translate-x-1'}
            `}
          >
            {isLoading ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-3 h-3 border border-muted-foreground border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <Icon 
                name={isAvailable ? "Check" : "X"} 
                size={14} 
                className={`
                  w-full h-full p-1
                  ${isAvailable ? 'text-success' : 'text-muted-foreground'}
                `}
              />
            )}
          </span>
        </button>
      </div>
      
      {isAvailable && (
        <div className="mt-3 pt-3 border-t border-border">
          <div className="flex items-center text-sm text-muted-foreground">
            <Icon name="MapPin" size={14} className="mr-2" />
            <span>Receiving alerts within 2-3km radius</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvailabilityToggle;