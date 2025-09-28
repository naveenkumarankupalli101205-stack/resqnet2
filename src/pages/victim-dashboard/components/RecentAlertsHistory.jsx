import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const RecentAlertsHistory = ({ 
  recentAlerts = [],
  onViewDetails = () => {},
  onViewAllHistory = () => {}
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const mockRecentAlerts = [
    {
      id: "alert_001",
      type: "health",
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      status: "resolved",
      location: "Main St & 5th Ave",
      responseTime: "4 minutes",
      volunteersResponded: 2,
      outcome: "Assisted by volunteer, transported to hospital"
    },
    {
      id: "alert_002",
      type: "accident",
      timestamp: new Date(Date.now() - 86400000 * 2), // 2 days ago
      status: "resolved",
      location: "Park Avenue",
      responseTime: "7 minutes",
      volunteersResponded: 1,
      outcome: "Minor injury treated on scene"
    },
    {
      id: "alert_003",
      type: "security",
      timestamp: new Date(Date.now() - 86400000 * 5), // 5 days ago
      status: "cancelled",
      location: "Home address",
      responseTime: "N/A",
      volunteersResponded: 0,
      outcome: "False alarm, cancelled by user"
    }
  ];

  const alertsToShow = recentAlerts?.length > 0 ? recentAlerts : mockRecentAlerts;

  const getTypeIcon = (type) => {
    switch (type) {
      case 'health':
        return 'Heart';
      case 'fire':
        return 'Flame';
      case 'accident':
        return 'Car';
      case 'security':
        return 'Shield';
      default:
        return 'AlertTriangle';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'health':
        return 'text-primary';
      case 'fire':
        return 'text-warning';
      case 'accident':
        return 'text-destructive';
      case 'security':
        return 'text-accent';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved':
        return 'text-success bg-success/10';
      case 'cancelled':
        return 'text-muted-foreground bg-muted/50';
      case 'active':
        return 'text-primary bg-primary/10';
      default:
        return 'text-muted-foreground bg-muted/10';
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - new Date(timestamp);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      return 'Less than an hour ago';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center">
          <Icon name="Clock" size={20} className="text-foreground mr-2" />
          <h3 className="font-semibold text-foreground">Recent Alerts</h3>
          {alertsToShow?.length > 0 && (
            <span className="ml-2 px-2 py-1 bg-muted rounded-full text-xs text-muted-foreground">
              {alertsToShow?.length}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={onViewAllHistory}
            className="text-sm text-accent hover:text-accent/80 transition-colors duration-150"
          >
            View all
          </button>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-muted rounded-md transition-colors duration-150"
          >
            <Icon 
              name={isCollapsed ? "ChevronDown" : "ChevronUp"} 
              size={16} 
              className="text-muted-foreground" 
            />
          </button>
        </div>
      </div>
      {/* Alerts List */}
      {!isCollapsed && (
        <div className="divide-y divide-border">
          {alertsToShow?.length === 0 ? (
            <div className="p-6 text-center">
              <div className="w-12 h-12 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-3">
                <Icon name="Clock" size={20} className="text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">No recent emergency alerts</p>
            </div>
          ) : (
            alertsToShow?.slice(0, 3)?.map((alert) => (
              <div key={alert?.id} className="p-4 hover:bg-muted/30 transition-colors duration-150">
                <div className="flex items-start justify-between">
                  <div className="flex items-start flex-1">
                    <div className="w-10 h-10 bg-muted/50 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <Icon 
                        name={getTypeIcon(alert?.type)} 
                        size={18} 
                        className={getTypeColor(alert?.type)} 
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-foreground text-sm capitalize">
                          {alert?.type} Emergency
                        </h4>
                        <span className={`
                          px-2 py-1 rounded-full text-xs font-medium capitalize
                          ${getStatusColor(alert?.status)}
                        `}>
                          {alert?.status}
                        </span>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Icon name="MapPin" size={12} className="mr-1" />
                          <span className="truncate">{alert?.location}</span>
                        </div>
                        
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Icon name="Clock" size={12} className="mr-1" />
                          <span>{formatTimeAgo(alert?.timestamp)}</span>
                          {alert?.responseTime !== "N/A" && (
                            <>
                              <span className="mx-2">•</span>
                              <span>Response: {alert?.responseTime}</span>
                            </>
                          )}
                        </div>

                        {alert?.volunteersResponded > 0 && (
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Icon name="Users" size={12} className="mr-1" />
                            <span>{alert?.volunteersResponded} volunteer{alert?.volunteersResponded > 1 ? 's' : ''} responded</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onViewDetails(alert)}
                    className="ml-2 p-2 hover:bg-muted rounded-md transition-colors duration-150 flex-shrink-0"
                    title="View details"
                  >
                    <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
                  </button>
                </div>

                {/* Outcome */}
                {alert?.outcome && (
                  <div className="mt-3 p-2 bg-muted/30 rounded-md ml-13">
                    <p className="text-xs text-muted-foreground">
                      <strong>Outcome:</strong> {alert?.outcome}
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
      {/* Footer */}
      {!isCollapsed && alertsToShow?.length > 3 && (
        <div className="border-t border-border p-3 text-center">
          <button
            onClick={onViewAllHistory}
            className="text-sm text-accent hover:text-accent/80 transition-colors duration-150 font-medium"
          >
            View {alertsToShow?.length - 3} more alerts
          </button>
        </div>
      )}
    </div>
  );
};

export default RecentAlertsHistory;