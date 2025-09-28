import React from 'react';
import Icon from '../../../components/AppIcon';

const TrustSignals = () => {
  const trustBadges = [
    {
      icon: 'Shield',
      title: 'SSL Secured',
      description: 'Your data is encrypted and protected'
    },
    {
      icon: 'CheckCircle',
      title: 'Community Verified',
      description: 'Trusted by 10,000+ community members'
    },
    {
      icon: 'Heart',
      title: 'Emergency Certified',
      description: 'Compliant with emergency response standards'
    }
  ];

  const communityStats = [
    { label: 'Active Volunteers', value: '2,847', icon: 'Users' },
    { label: 'Emergency Responses', value: '15,623', icon: 'Activity' },
    { label: 'Average Response Time', value: '3.2 min', icon: 'Clock' },
    { label: 'Community Rating', value: '4.9/5', icon: 'Star' }
  ];

  return (
    <div className="space-y-8">
      {/* Trust Badges */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground text-center">
          Your Safety is Our Priority
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {trustBadges?.map((badge, index) => (
            <div
              key={index}
              className="flex flex-col items-center p-4 bg-card border border-border rounded-lg hover:shadow-md transition-shadow duration-200"
            >
              <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mb-3">
                <Icon name={badge?.icon} size={24} className="text-success" />
              </div>
              <h4 className="font-semibold text-foreground text-center mb-1">
                {badge?.title}
              </h4>
              <p className="text-xs text-muted-foreground text-center">
                {badge?.description}
              </p>
            </div>
          ))}
        </div>
      </div>
      {/* Community Stats */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground text-center">
          Join Our Emergency Response Network
        </h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {communityStats?.map((stat, index) => (
            <div
              key={index}
              className="text-center p-3 bg-muted/30 rounded-lg"
            >
              <div className="flex items-center justify-center mb-2">
                <Icon name={stat?.icon} size={20} className="text-primary" />
              </div>
              <div className="text-lg font-bold text-foreground">
                {stat?.value}
              </div>
              <div className="text-xs text-muted-foreground">
                {stat?.label}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Security Notice */}
      <div className="p-4 bg-accent/5 border border-accent/20 rounded-lg">
        <div className="flex items-start space-x-3">
          <Icon name="Info" size={20} className="text-accent mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-foreground mb-1">
              Privacy & Security
            </h4>
            <p className="text-sm text-muted-foreground">
              Your personal information is encrypted and only shared with verified volunteers during active emergencies. We never sell or share your data with third parties.
            </p>
          </div>
        </div>
      </div>
      {/* Emergency Services Notice */}
      <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
        <div className="flex items-start space-x-3">
          <Icon name="AlertTriangle" size={20} className="text-primary mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-foreground mb-1">
              Emergency Services Integration
            </h4>
            <p className="text-sm text-muted-foreground">
              ResQNet complements but does not replace official emergency services. For life-threatening emergencies, always call 911 first.
            </p>
          </div>
        </div>
      </div>
      {/* Contact Support */}
      <div className="text-center pt-4 border-t border-border">
        <p className="text-sm text-muted-foreground mb-2">
          Need help getting started?
        </p>
        <div className="flex items-center justify-center space-x-4">
          <button className="flex items-center text-sm text-primary hover:text-primary/80 transition-colors duration-150">
            <Icon name="Mail" size={16} className="mr-1" />
            support@resqnet.com
          </button>
          <button className="flex items-center text-sm text-primary hover:text-primary/80 transition-colors duration-150">
            <Icon name="Phone" size={16} className="mr-1" />
            1-800-RESQNET
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrustSignals;