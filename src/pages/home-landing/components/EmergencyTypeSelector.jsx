import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const EmergencyTypeSelector = ({ onTypeSelect, selectedType }) => {
  const emergencyTypes = [
    {
      id: 'health',
      label: 'Medical Emergency',
      icon: 'Heart',
      color: 'text-primary',
      bgColor: 'bg-primary/10 hover:bg-primary/20',
      description: 'Health issues, injuries, medical assistance needed'
    },
    {
      id: 'fire',
      label: 'Fire Emergency',
      icon: 'Flame',
      color: 'text-warning',
      bgColor: 'bg-warning/10 hover:bg-warning/20',
      description: 'Fire incidents, smoke, evacuation assistance'
    },
    {
      id: 'accident',
      label: 'Accident',
      icon: 'Car',
      color: 'text-destructive',
      bgColor: 'bg-destructive/10 hover:bg-destructive/20',
      description: 'Vehicle accidents, falls, physical incidents'
    },
    {
      id: 'security',
      label: 'Security Issue',
      icon: 'Shield',
      color: 'text-accent',
      bgColor: 'bg-accent/10 hover:bg-accent/20',
      description: 'Safety concerns, suspicious activity, threats'
    },
    {
      id: 'natural',
      label: 'Natural Disaster',
      icon: 'Cloud',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10 hover:bg-secondary/20',
      description: 'Weather emergencies, floods, earthquakes'
    },
    {
      id: 'other',
      label: 'Other Emergency',
      icon: 'AlertCircle',
      color: 'text-muted-foreground',
      bgColor: 'bg-muted hover:bg-muted/80',
      description: 'Any other urgent assistance needed'
    }
  ];

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-foreground mb-2">
          What type of emergency?
        </h3>
        <p className="text-sm text-muted-foreground">
          Select the category that best describes your situation
        </p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {emergencyTypes?.map((type) => (
          <button
            key={type?.id}
            onClick={() => onTypeSelect(type?.id)}
            className={`
              p-4 rounded-lg border-2 transition-all duration-200 text-left
              ${selectedType === type?.id 
                ? 'border-primary bg-primary/10 shadow-emergency-sm' 
                : 'border-border hover:border-border/60'
              }
              ${type?.bgColor}
            `}
          >
            <div className="flex flex-col items-center text-center">
              <div className={`
                w-12 h-12 rounded-lg flex items-center justify-center mb-3
                ${selectedType === type?.id ? 'bg-primary/20' : 'bg-background/50'}
              `}>
                <Icon 
                  name={type?.icon} 
                  size={24} 
                  className={selectedType === type?.id ? 'text-primary' : type?.color} 
                />
              </div>
              <h4 className="font-medium text-foreground text-sm mb-1">
                {type?.label}
              </h4>
              <p className="text-xs text-muted-foreground leading-tight">
                {type?.description}
              </p>
            </div>
          </button>
        ))}
      </div>
      {selectedType && (
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center text-sm text-foreground">
            <Icon name="Info" size={16} className="mr-2 text-accent" />
            <span>
              Selected: <strong className="capitalize">
                {emergencyTypes?.find(t => t?.id === selectedType)?.label}
              </strong>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmergencyTypeSelector;