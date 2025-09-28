import React from 'react';
import Icon from '../../../components/AppIcon';

const ResponseStats = ({ 
  stats = {
    totalResponses: 0,
    successfulHelps: 0,
    averageResponseTime: 0,
    communityRating: 0
  }
}) => {
  const formatResponseTime = (minutes) => {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const getRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars?.push(
        <Icon key={i} name="Star" size={14} className="text-warning fill-current" />
      );
    }
    
    if (hasHalfStar) {
      stars?.push(
        <Icon key="half" name="Star" size={14} className="text-warning fill-current opacity-50" />
      );
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars?.push(
        <Icon key={`empty-${i}`} name="Star" size={14} className="text-muted-foreground" />
      );
    }
    
    return stars;
  };

  const statItems = [
    {
      icon: 'Activity',
      label: 'Total Responses',
      value: stats?.totalResponses?.toString(),
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      icon: 'CheckCircle',
      label: 'Successful Helps',
      value: stats?.successfulHelps?.toString(),
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      icon: 'Clock',
      label: 'Avg Response Time',
      value: formatResponseTime(stats?.averageResponseTime),
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    },
    {
      icon: 'Heart',
      label: 'Community Rating',
      value: stats?.communityRating?.toFixed(1),
      color: 'text-red-500',
      bgColor: 'bg-red-50',
      extra: (
        <div className="flex items-center mt-1">
          {getRatingStars(stats?.communityRating)}
        </div>
      )
    }
  ];

  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <div className="flex items-center mb-4">
        <Icon name="TrendingUp" size={20} className="text-primary mr-2" />
        <h3 className="font-semibold text-foreground">Your Impact</h3>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statItems?.map((item, index) => (
          <div key={index} className="text-center">
            <div className={`
              w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2
              ${item?.bgColor}
            `}>
              <Icon name={item?.icon} size={20} className={item?.color} />
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">
              {item?.value}
            </div>
            <div className="text-xs text-muted-foreground">
              {item?.label}
            </div>
            {item?.extra && item?.extra}
          </div>
        ))}
      </div>
      {/* Achievement Badges */}
      <div className="mt-6 pt-4 border-t border-border">
        <h4 className="text-sm font-medium text-foreground mb-3">Recent Achievements</h4>
        <div className="flex flex-wrap gap-2">
          {stats?.totalResponses >= 5 && (
            <div className="flex items-center px-2 py-1 bg-success/10 text-success rounded-full text-xs">
              <Icon name="Award" size={12} className="mr-1" />
              <span>Helper</span>
            </div>
          )}
          {stats?.totalResponses >= 10 && (
            <div className="flex items-center px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
              <Icon name="Shield" size={12} className="mr-1" />
              <span>Guardian</span>
            </div>
          )}
          {stats?.averageResponseTime <= 300 && stats?.totalResponses >= 3 && (
            <div className="flex items-center px-2 py-1 bg-warning/10 text-warning rounded-full text-xs">
              <Icon name="Zap" size={12} className="mr-1" />
              <span>Quick Responder</span>
            </div>
          )}
          {stats?.communityRating >= 4.5 && (
            <div className="flex items-center px-2 py-1 bg-red-50 text-red-500 rounded-full text-xs">
              <Icon name="Heart" size={12} className="mr-1" />
              <span>Community Hero</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResponseStats;