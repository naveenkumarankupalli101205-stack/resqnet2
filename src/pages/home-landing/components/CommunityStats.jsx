import React from 'react';
import Icon from '../../../components/AppIcon';

const CommunityStats = () => {
  const stats = [
    {
      id: 1,
      label: 'Active Volunteers',
      value: '2,847',
      icon: 'Users',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
      change: '+12% this month'
    },
    {
      id: 2,
      label: 'Emergencies Resolved',
      value: '15,293',
      icon: 'CheckCircle',
      color: 'text-success',
      bgColor: 'bg-success/10',
      change: '98.7% success rate'
    },
    {
      id: 3,
      label: 'Average Response Time',
      value: '4.2 min',
      icon: 'Clock',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      change: '-15% faster'
    },
    {
      id: 4,
      label: 'Communities Served',
      value: '156',
      icon: 'MapPin',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      change: 'Nationwide coverage'
    }
  ];

  const successStories = [
    {
      id: 1,
      title: "Medical Emergency Response",
      description: "Sarah received immediate help when she collapsed at home. Three volunteers arrived within 3 minutes and provided first aid until paramedics arrived.",
      location: "Downtown District",
      timeAgo: "2 hours ago",
      type: "health"
    },
    {
      id: 2,
      title: "Fire Evacuation Assistance",
      description: "Elderly couple safely evacuated from apartment fire with help from ResQNet volunteers who assisted with mobility and pet rescue.",
      location: "Riverside Community",
      timeAgo: "1 day ago",
      type: "fire"
    },
    {
      id: 3,
      title: "Car Accident Support",
      description: "Quick response team helped secure accident scene and provided comfort to victims while emergency services were en route.",
      location: "Highway 101",
      timeAgo: "3 days ago",
      type: "accident"
    }
  ];

  const getTypeIcon = (type) => {
    switch (type) {
      case 'health': return 'Heart';
      case 'fire': return 'Flame';
      case 'accident': return 'Car';
      default: return 'AlertCircle';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'health': return 'text-primary';
      case 'fire': return 'text-warning';
      case 'accident': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="bg-background py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Community Statistics */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Community Impact
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real people helping real people in emergency situations across communities
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats?.map((stat) => (
            <div key={stat?.id} className="bg-card border border-border rounded-xl p-6 text-center hover:shadow-emergency-sm transition-all duration-200">
              <div className={`w-12 h-12 ${stat?.bgColor} rounded-lg flex items-center justify-center mx-auto mb-4`}>
                <Icon name={stat?.icon} size={24} className={stat?.color} />
              </div>
              <div className="text-2xl lg:text-3xl font-bold text-foreground mb-1">
                {stat?.value}
              </div>
              <div className="text-sm font-medium text-muted-foreground mb-2">
                {stat?.label}
              </div>
              <div className="text-xs text-success">
                {stat?.change}
              </div>
            </div>
          ))}
        </div>

        {/* Success Stories */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">
              Recent Success Stories
            </h3>
            <p className="text-muted-foreground">
              Real emergency responses from our community network
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {successStories?.map((story) => (
              <div key={story?.id} className="bg-card border border-border rounded-xl p-6 hover:shadow-emergency-sm transition-all duration-200">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center mr-3">
                    <Icon name={getTypeIcon(story?.type)} size={20} className={getTypeColor(story?.type)} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground text-sm">
                      {story?.title}
                    </h4>
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                      <Icon name="MapPin" size={12} className="mr-1" />
                      <span>{story?.location}</span>
                      <span className="mx-2">•</span>
                      <span>{story?.timeAgo}</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {story?.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Signals */}
        <div className="bg-muted/30 rounded-xl p-8 text-center">
          <h3 className="text-xl font-semibold text-foreground mb-6">
            Trusted Emergency Response Platform
          </h3>
          
          <div className="flex flex-wrap justify-center items-center gap-8 mb-6">
            <div className="flex items-center">
              <Icon name="Shield" size={20} className="text-success mr-2" />
              <span className="text-sm font-medium text-foreground">SSL Secured</span>
            </div>
            <div className="flex items-center">
              <Icon name="CheckCircle" size={20} className="text-success mr-2" />
              <span className="text-sm font-medium text-foreground">Emergency Certified</span>
            </div>
            <div className="flex items-center">
              <Icon name="Users" size={20} className="text-success mr-2" />
              <span className="text-sm font-medium text-foreground">Community Verified</span>
            </div>
            <div className="flex items-center">
              <Icon name="Clock" size={20} className="text-success mr-2" />
              <span className="text-sm font-medium text-foreground">24/7 Available</span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            ResQNet complies with emergency service standards and maintains the highest security protocols 
            to protect user data and ensure reliable emergency response coordination.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CommunityStats;