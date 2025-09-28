import React from 'react';
import Icon from '../../../components/AppIcon';

const EmergencyTypeSelector = ({ 
  selectedType = null,
  onTypeSelect = () => {},
  disabled = false
}) => {
  const emergencyTypes = [
    {
      id: "health",
      label: "Medical Emergency",
      icon: "Heart",
      color: "text-primary",
      bgColor: "bg-primary/10 hover:bg-primary/20",
      description: "Health issues, injuries, medical assistance needed"
    },
    {
      id: "fire",
      label: "Fire Emergency",
      icon: "Flame",
      color: "text-warning",
      bgColor: "bg-warning/10 hover:bg-warning/20",
      description: "Fire incidents, smoke, burning situations"
    },
    {
      id: "accident",
      label: "Accident",
      icon: "Car",
      color: "text-destructive",
      bgColor: "bg-destructive/10 hover:bg-destructive/20",
      description: "Vehicle accidents, falls, physical incidents"
    },
    {
      id: "security",
      label: "Security Issue",
      icon: "Shield",
      color: "text-accent",
      bgColor: "bg-accent/10 hover:bg-accent/20",
      description: "Safety concerns, suspicious activity, threats"
    }
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Emergency Type</h3>
        {selectedType && (
          <button
            onClick={() => onTypeSelect(null)}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-150"
            disabled={disabled}
          >
            Clear selection
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {emergencyTypes?.map((type) => (
          <button
            key={type?.id}
            onClick={() => onTypeSelect(type?.id)}
            disabled={disabled}
            className={`
              relative p-4 rounded-lg border-2 text-left transition-all duration-200
              ${selectedType === type?.id 
                ? `border-primary ${type?.bgColor?.replace('hover:', '')} shadow-emergency-sm` 
                : `border-border ${type?.bgColor} hover:border-muted-foreground`
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
            `}
          >
            <div className="flex items-start">
              <div className={`
                w-10 h-10 rounded-lg flex items-center justify-center mr-3 flex-shrink-0
                ${selectedType === type?.id ? 'bg-primary/20' : 'bg-muted/50'}
              `}>
                <Icon 
                  name={type?.icon} 
                  size={20} 
                  className={selectedType === type?.id ? 'text-primary' : type?.color} 
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className={`
                  font-semibold text-sm mb-1
                  ${selectedType === type?.id ? 'text-primary' : 'text-foreground'}
                `}>
                  {type?.label}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {type?.description}
                </p>
              </div>
            </div>

            {/* Selection Indicator */}
            {selectedType === type?.id && (
              <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                <Icon name="Check" size={12} className="text-primary-foreground" strokeWidth={3} />
              </div>
            )}
          </button>
        ))}
      </div>
      {selectedType && (
        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center">
            <Icon name="Info" size={16} className="text-muted-foreground mr-2" />
            <p className="text-sm text-muted-foreground">
              Selected: <span className="font-medium text-foreground">
                {emergencyTypes?.find(t => t?.id === selectedType)?.label}
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmergencyTypeSelector;