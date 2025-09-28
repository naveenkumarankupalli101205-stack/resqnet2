import React from 'react';
import Icon from '../../../components/AppIcon';

const StatisticsPanel = ({ stats, userRole }) => {
  const formatDuration = (minutes) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getStatCards = () => {
    if (userRole === 'victim') {
      return [
        {
          title: 'Total Alerts Sent',
          value: stats?.totalAlerts || 0,
          icon: 'AlertTriangle',
          color: 'text-primary bg-primary/10'
        },
        {
          title: 'Successfully Resolved',
          value: stats?.resolvedAlerts || 0,
          icon: 'CheckCircle',
          color: 'text-success bg-success/10'
        },
        {
          title: 'Average Response Time',
          value: stats?.avgResponseTime ? formatDuration(stats?.avgResponseTime) : 'N/A',
          icon: 'Clock',
          color: 'text-accent bg-accent/10'
        },
        {
          title: 'Volunteers Helped',
          value: stats?.uniqueVolunteers || 0,
          icon: 'Users',
          color: 'text-secondary bg-secondary/10'
        }
      ];
    } else {
      return [
        {
          title: 'Alerts Responded',
          value: stats?.totalResponses || 0,
          icon: 'Heart',
          color: 'text-success bg-success/10'
        },
        {
          title: 'People Helped',
          value: stats?.peopleHelped || 0,
          icon: 'Users',
          color: 'text-primary bg-primary/10'
        },
        {
          title: 'Average Response Time',
          value: stats?.avgResponseTime ? formatDuration(stats?.avgResponseTime) : 'N/A',
          icon: 'Clock',
          color: 'text-accent bg-accent/10'
        },
        {
          title: 'Community Rating',
          value: stats?.averageRating ? `${stats?.averageRating?.toFixed(1)}/5` : 'N/A',
          icon: 'Star',
          color: 'text-warning bg-warning/10'
        }
      ];
    }
  };

  const statCards = getStatCards();

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">
          {userRole === 'victim' ? 'Emergency History Summary' : 'Volunteer Impact Summary'}
        </h2>
        <div className="flex items-center text-sm text-muted-foreground">
          <Icon name="TrendingUp" size={16} className="mr-1" />
          <span>Last updated: {new Date()?.toLocaleDateString()}</span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards?.map((stat, index) => (
          <div key={index} className="p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${stat?.color}`}>
                <Icon name={stat?.icon} size={20} />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-foreground">{stat?.value}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{stat?.title}</p>
          </div>
        ))}
      </div>
      {/* Additional Insights */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-success/5 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Success Rate</p>
            <p className="text-lg font-semibold text-success">
              {stats?.successRate ? `${Math.round(stats?.successRate)}%` : 'N/A'}
            </p>
          </div>
          <div className="p-3 bg-accent/5 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">This Month</p>
            <p className="text-lg font-semibold text-accent">
              {stats?.thisMonth || 0} {userRole === 'victim' ? 'alerts' : 'responses'}
            </p>
          </div>
          <div className="p-3 bg-warning/5 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Streak</p>
            <p className="text-lg font-semibold text-warning">
              {stats?.streak || 0} days active
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPanel;