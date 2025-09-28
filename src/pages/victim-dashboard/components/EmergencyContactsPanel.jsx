import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const EmergencyContactsPanel = ({ 
  emergencyContacts = [],
  onCallContact = () => {},
  onEditContacts = () => {}
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const defaultContacts = [
    {
      id: "911",
      name: "Emergency Services",
      phone: "911",
      type: "emergency",
      icon: "Phone",
      description: "Police, Fire, Medical"
    },
    {
      id: "poison",
      name: "Poison Control",
      phone: "1-800-222-1222",
      type: "medical",
      icon: "AlertTriangle",
      description: "24/7 Poison Help"
    }
  ];

  const allContacts = [...defaultContacts, ...emergencyContacts];

  const handleCall = (contact) => {
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100]);
    }
    onCallContact(contact);
  };

  const getContactIcon = (type) => {
    switch (type) {
      case 'emergency':
        return 'Phone';
      case 'medical':
        return 'Heart';
      case 'family':
        return 'Users';
      case 'friend':
        return 'User';
      default:
        return 'Phone';
    }
  };

  const getContactColor = (type) => {
    switch (type) {
      case 'emergency':
        return 'text-primary';
      case 'medical':
        return 'text-success';
      case 'family':
        return 'text-accent';
      case 'friend':
        return 'text-warning';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center">
          <Icon name="Phone" size={20} className="text-foreground mr-2" />
          <h3 className="font-semibold text-foreground">Emergency Contacts</h3>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={onEditContacts}
            className="p-2 hover:bg-muted rounded-md transition-colors duration-150"
            title="Edit contacts"
          >
            <Icon name="Edit" size={16} className="text-muted-foreground" />
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-muted rounded-md transition-colors duration-150"
          >
            <Icon 
              name={isExpanded ? "ChevronUp" : "ChevronDown"} 
              size={16} 
              className="text-muted-foreground" 
            />
          </button>
        </div>
      </div>
      {/* Quick Access Contacts */}
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {allContacts?.slice(0, isExpanded ? allContacts?.length : 4)?.map((contact) => (
            <button
              key={contact?.id}
              onClick={() => handleCall(contact)}
              className="flex items-center p-3 bg-muted/30 hover:bg-muted/50 rounded-lg transition-all duration-150 text-left group"
            >
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center mr-3 flex-shrink-0
                ${contact?.type === 'emergency' ? 'bg-primary/10' : 'bg-muted/50'}
                group-hover:scale-105 transition-transform duration-150
              `}>
                <Icon 
                  name={getContactIcon(contact?.type)} 
                  size={18} 
                  className={getContactColor(contact?.type)} 
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-foreground text-sm truncate">
                  {contact?.name}
                </h4>
                <p className="text-xs text-muted-foreground truncate">
                  {contact?.description || contact?.phone}
                </p>
              </div>

              <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                <Icon name="ExternalLink" size={14} className="text-muted-foreground" />
              </div>
            </button>
          ))}
        </div>

        {/* Add Contact Button */}
        {isExpanded && (
          <button
            onClick={onEditContacts}
            className="w-full mt-3 p-3 border-2 border-dashed border-muted-foreground/30 hover:border-muted-foreground/50 rounded-lg transition-colors duration-150 flex items-center justify-center text-muted-foreground hover:text-foreground"
          >
            <Icon name="Plus" size={18} className="mr-2" />
            <span className="text-sm font-medium">Add Emergency Contact</span>
          </button>
        )}
      </div>
      {/* Emergency Instructions */}
      <div className="border-t border-border p-4 bg-muted/20">
        <div className="flex items-start">
          <Icon name="Info" size={16} className="text-muted-foreground mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong>Emergency tip:</strong> For life-threatening situations, always call 911 first. 
              Use volunteer network for non-critical assistance and community support.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyContactsPanel;