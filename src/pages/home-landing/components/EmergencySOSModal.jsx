import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import EmergencyTypeSelector from './EmergencyTypeSelector';

const EmergencySOSModal = ({ isVisible, onClose, onSendAlert, userLocation }) => {
  const [selectedType, setSelectedType] = useState('');
  const [urgencyLevel, setUrgencyLevel] = useState('high');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (isCountingDown && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (isCountingDown && countdown === 0) {
      handleSendAlert();
    }
  }, [isCountingDown, countdown]);

  useEffect(() => {
    if (isVisible) {
      // Reset state when modal opens
      setSelectedType('');
      setUrgencyLevel('high');
      setAdditionalInfo('');
      setIsCountingDown(false);
      setCountdown(5);
      setIsSending(false);
    }
  }, [isVisible]);

  const urgencyLevels = [
    {
      id: 'critical',
      label: 'Critical',
      description: 'Life-threatening emergency',
      color: 'text-primary',
      bgColor: 'bg-primary/10 border-primary/30'
    },
    {
      id: 'high',
      label: 'High',
      description: 'Urgent assistance needed',
      color: 'text-warning',
      bgColor: 'bg-warning/10 border-warning/30'
    },
    {
      id: 'medium',
      label: 'Medium',
      description: 'Help needed soon',
      color: 'text-accent',
      bgColor: 'bg-accent/10 border-accent/30'
    }
  ];

  const handleStartCountdown = () => {
    if (!selectedType) {
      alert('Please select an emergency type first');
      return;
    }
    
    setIsCountingDown(true);
    
    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100, 50, 100]);
    }
  };

  const handleSendAlert = async () => {
    setIsSending(true);
    setIsCountingDown(false);

    const alertData = {
      id: `alert_${Date.now()}`,
      type: selectedType,
      urgency: urgencyLevel,
      description: additionalInfo || `${selectedType} emergency - immediate assistance needed`,
      location: userLocation || {
        latitude: 37.7749,
        longitude: -122.4194,
        address: "Current Location"
      },
      timestamp: new Date()?.toISOString(),
      status: 'active'
    };

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      onSendAlert(alertData);
      onClose();
    } catch (error) {
      console.error('Failed to send alert:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleCancel = () => {
    setIsCountingDown(false);
    setCountdown(5);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-alert bg-black/70 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-card rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-emergency-lg animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
              <Icon name="AlertTriangle" size={20} className="text-primary animate-pulse" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Emergency Alert</h3>
              <p className="text-sm text-muted-foreground">
                {isCountingDown ? `Sending in ${countdown}s` : 'Configure your emergency alert'}
              </p>
            </div>
          </div>
          {!isCountingDown && !isSending && (
            <button
              onClick={onClose}
              className="p-1 hover:bg-muted rounded-md transition-colors duration-150"
            >
              <Icon name="X" size={18} className="text-muted-foreground" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {isCountingDown ? (
            <div className="text-center py-8">
              <div className="relative inline-block mb-6">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-3xl font-bold text-primary">{countdown}</span>
                </div>
                <div className="absolute inset-0 rounded-full border-4 border-primary animate-ping opacity-20"></div>
              </div>
              <h4 className="text-xl font-semibold text-foreground mb-2">
                Sending Emergency Alert
              </h4>
              <p className="text-muted-foreground mb-6">
                Your alert will be sent to nearby volunteers in {countdown} seconds
              </p>
              <Button
                variant="outline"
                size="default"
                onClick={handleCancel}
                iconName="X"
                iconPosition="left"
                iconSize={16}
              >
                Cancel Alert
              </Button>
            </div>
          ) : isSending ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Loader2" size={32} className="text-primary animate-spin" />
              </div>
              <h4 className="text-xl font-semibold text-foreground mb-2">
                Sending Alert...
              </h4>
              <p className="text-muted-foreground">
                Notifying nearby volunteers and emergency services
              </p>
            </div>
          ) : (
            <>
              {/* Emergency Type Selection */}
              <EmergencyTypeSelector
                onTypeSelect={setSelectedType}
                selectedType={selectedType}
              />

              {/* Urgency Level */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h4 className="font-semibold text-foreground mb-4">Urgency Level</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {urgencyLevels?.map((level) => (
                    <button
                      key={level?.id}
                      onClick={() => setUrgencyLevel(level?.id)}
                      className={`
                        p-4 rounded-lg border-2 transition-all duration-200 text-left
                        ${urgencyLevel === level?.id 
                          ? `border-primary bg-primary/10` 
                          : `border-border ${level?.bgColor}`
                        }
                      `}
                    >
                      <div className="text-center">
                        <h5 className={`font-medium mb-1 ${urgencyLevel === level?.id ? 'text-primary' : level?.color}`}>
                          {level?.label}
                        </h5>
                        <p className="text-xs text-muted-foreground">
                          {level?.description}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Additional Information */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h4 className="font-semibold text-foreground mb-4">Additional Information (Optional)</h4>
                <textarea
                  value={additionalInfo}
                  onChange={(e) => setAdditionalInfo(e?.target?.value)}
                  placeholder="Describe your situation, any specific help needed, or important details..."
                  className="w-full h-24 p-3 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  maxLength={200}
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-muted-foreground">
                    {additionalInfo?.length}/200 characters
                  </span>
                </div>
              </div>

              {/* Location Info */}
              {userLocation && (
                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="flex items-center">
                    <Icon name="MapPin" size={16} className="text-success mr-2" />
                    <span className="text-sm font-medium text-foreground">Location detected</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Your current location will be shared with responding volunteers
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Actions */}
        {!isCountingDown && !isSending && (
          <div className="flex gap-3 p-6 border-t border-border">
            <Button
              variant="outline"
              size="default"
              onClick={onClose}
              iconName="X"
              iconPosition="left"
              iconSize={16}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="default"
              onClick={handleStartCountdown}
              disabled={!selectedType}
              iconName="AlertTriangle"
              iconPosition="left"
              iconSize={16}
              className="flex-1 font-bold"
            >
              Send Emergency Alert
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmergencySOSModal;