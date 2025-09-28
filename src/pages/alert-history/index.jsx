import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import AlertHistoryCard from './components/AlertHistoryCard';
import FilterControls from './components/FilterControls';
import StatisticsPanel from './components/StatisticsPanel';
import ExportModal from './components/ExportModal';

const AlertHistory = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState('victim'); // Mock user role
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('newest');
  
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    urgency: 'all',
    dateRange: 'all',
    startDate: '',
    endDate: ''
  });

  // Mock alert history data
  const mockAlerts = [
    {
      id: 'ALT-2024-001',
      type: 'medical',
      urgency: 'critical',
      status: 'completed',
      timestamp: new Date('2024-09-25T14:30:00'),
      location: 'Downtown Medical Center, 5th Avenue',
      distance: 850,
      responseTime: 12,
      respondersCount: 2,
      description: `Elderly person collapsed at bus stop. Required immediate medical attention and transport to hospital.`,
      responders: [
        {
          name: 'Dr. Sarah Johnson',
          arrivalTime: 8,
          rating: 4.9
        },
        {
          name: 'Mike Rodriguez',
          arrivalTime: 12,
          rating: 4.7
        }
      ],
      communications: [
        {
          message: 'On my way, ETA 5 minutes',
          timestamp: new Date('2024-09-25T14:32:00')
        },
        {
          message: 'Patient stable, ambulance called',
          timestamp: new Date('2024-09-25T14:42:00')
        }
      ],
      feedback: `Excellent response time. The volunteers were professional and provided immediate first aid until paramedics arrived.`
    },
    {
      id: 'ALT-2024-002',
      type: 'fire',
      urgency: 'high',
      status: 'completed',
      timestamp: new Date('2024-09-22T09:15:00'),
      location: 'Residential Area, Oak Street',
      distance: 1200,
      responseTime: 18,
      respondersCount: 3,
      description: `Kitchen fire in apartment building. Smoke detected, residents evacuating.`,
      responders: [
        {
          name: 'Fire Captain Tom Wilson',
          arrivalTime: 15,
          rating: 5.0
        },
        {
          name: 'Lisa Chen',
          arrivalTime: 18,
          rating: 4.8
        },
        {
          name: 'Robert Martinez',
          arrivalTime: 20,
          rating: 4.6
        }
      ],
      communications: [
        {
          message: 'Fire department notified, coordinating evacuation',
          timestamp: new Date('2024-09-22T09:17:00')
        },
        {
          message: 'All residents safely evacuated',
          timestamp: new Date('2024-09-22T09:33:00')
        }
      ]
    },
    {
      id: 'ALT-2024-003',
      type: 'accident',
      urgency: 'medium',
      status: 'cancelled',
      timestamp: new Date('2024-09-20T16:45:00'),
      location: 'Highway 101, Exit 15',
      distance: 2100,
      responseTime: null,
      respondersCount: 0,
      description: `Minor vehicle collision, initially thought serious but resolved by police arrival.`,
      communications: [
        {
          message: 'False alarm - police already on scene',
          timestamp: new Date('2024-09-20T16:47:00')
        }
      ]
    },
    {
      id: 'ALT-2024-004',
      type: 'security',
      urgency: 'high',
      status: 'completed',
      timestamp: new Date('2024-09-18T22:30:00'),
      location: 'University Campus, Library Parking',
      distance: 650,
      responseTime: 25,
      respondersCount: 1,
      description: `Suspicious activity reported near campus library. Student felt unsafe walking alone.`,
      responders: [
        {
          name: 'Campus Security Officer James',
          arrivalTime: 25,
          rating: 4.5
        }
      ],
      myResponseTime: 25,
      victimInfo: {
        name: 'Anonymous Student',
        resolved: true
      }
    },
    {
      id: 'ALT-2024-005',
      type: 'natural',
      urgency: 'critical',
      status: 'in-progress',
      timestamp: new Date('2024-09-27T08:20:00'),
      location: 'Riverside Park, Flood Zone',
      distance: 1800,
      responseTime: null,
      respondersCount: 4,
      description: `Flash flood warning - multiple people trapped in park area. Coordinating with emergency services.`,
      responders: [
        {
          name: 'Emergency Response Team Alpha',
          arrivalTime: null,
          rating: null
        }
      ]
    }
  ];

  // Mock statistics
  const mockStats = {
    totalAlerts: userRole === 'victim' ? 12 : 28,
    resolvedAlerts: userRole === 'victim' ? 10 : null,
    totalResponses: userRole === 'volunteer' ? 28 : null,
    peopleHelped: userRole === 'volunteer' ? 35 : null,
    avgResponseTime: 15,
    uniqueVolunteers: userRole === 'victim' ? 8 : null,
    averageRating: userRole === 'volunteer' ? 4.7 : null,
    successRate: 85,
    thisMonth: 3,
    streak: 12
  };

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'urgency', label: 'By Urgency' },
    { value: 'distance', label: 'By Distance' },
    { value: 'status', label: 'By Status' }
  ];

  // Filter and search alerts
  const filteredAlerts = mockAlerts?.filter(alert => {
    // Search filter
    if (searchQuery) {
      const searchLower = searchQuery?.toLowerCase();
      const matchesSearch = 
        alert?.location?.toLowerCase()?.includes(searchLower) ||
        alert?.description?.toLowerCase()?.includes(searchLower) ||
        alert?.id?.toLowerCase()?.includes(searchLower) ||
        alert?.type?.toLowerCase()?.includes(searchLower);
      
      if (!matchesSearch) return false;
    }

    // Type filter
    if (filters?.type !== 'all' && alert?.type !== filters?.type) return false;

    // Status filter
    if (filters?.status !== 'all' && alert?.status !== filters?.status) return false;

    // Urgency filter
    if (filters?.urgency !== 'all' && alert?.urgency !== filters?.urgency) return false;

    // Date range filter
    if (filters?.dateRange !== 'all') {
      const alertDate = new Date(alert.timestamp);
      const now = new Date();
      
      switch (filters?.dateRange) {
        case 'today':
          if (alertDate?.toDateString() !== now?.toDateString()) return false;
          break;
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          if (alertDate < weekAgo) return false;
          break;
        case 'month':
          const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
          if (alertDate < monthAgo) return false;
          break;
        case 'quarter':
          const quarterAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
          if (alertDate < quarterAgo) return false;
          break;
        case 'year':
          if (alertDate?.getFullYear() !== now?.getFullYear()) return false;
          break;
        case 'custom':
          if (filters?.startDate && alertDate < new Date(filters.startDate)) return false;
          if (filters?.endDate && alertDate > new Date(filters.endDate)) return false;
          break;
      }
    }

    return true;
  });

  // Sort alerts
  const sortedAlerts = [...filteredAlerts]?.sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.timestamp) - new Date(a.timestamp);
      case 'oldest':
        return new Date(a.timestamp) - new Date(b.timestamp);
      case 'urgency':
        const urgencyOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        return urgencyOrder?.[b?.urgency] - urgencyOrder?.[a?.urgency];
      case 'distance':
        return (a?.distance || 0) - (b?.distance || 0);
      case 'status':
        return a?.status?.localeCompare(b?.status);
      default:
        return 0;
    }
  });

  // Pagination
  const itemsPerPage = 10;
  const totalPages = Math.ceil(sortedAlerts?.length / itemsPerPage);
  const paginatedAlerts = sortedAlerts?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({
      type: 'all',
      status: 'all',
      urgency: 'all',
      dateRange: 'all',
      startDate: '',
      endDate: ''
    });
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handleExportAlert = (alert) => {
    // Mock export single alert
    const dataStr = JSON.stringify(alert, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `alert-${alert?.id}.json`;
    link?.click();
    URL.revokeObjectURL(url);
  };

  const handleBulkExport = (config) => {
    // Mock bulk export
    setIsLoading(true);
    
    setTimeout(() => {
      const exportData = {
        exportConfig: config,
        alerts: filteredAlerts,
        statistics: mockStats,
        exportDate: new Date()?.toISOString(),
        userRole: userRole
      };

      const dataStr = config?.format === 'json' 
        ? JSON.stringify(exportData, null, 2)
        : 'CSV export would be generated here';
      
      const mimeType = config?.format === 'json' ? 'application/json' : 'text/csv';
      const extension = config?.format === 'json' ? 'json' : 'csv';
      
      const dataBlob = new Blob([dataStr], { type: mimeType });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `alert-history-${new Date()?.toISOString()?.split('T')?.[0]}.${extension}`;
      link?.click();
      URL.revokeObjectURL(url);
      
      setIsLoading(false);
    }, 1500);
  };

  const handleRoleSwitch = () => {
    setUserRole(userRole === 'victim' ? 'volunteer' : 'victim');
  };

  useEffect(() => {
    // Simulate loading
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, [filters, searchQuery]);

  return (
    <div className="min-h-screen bg-background">
      <Header 
        userRole={userRole}
        emergencyStatus={false}
        onEmergencyAction={() => {}}
      />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Alert History</h1>
              <p className="text-muted-foreground">
                {userRole === 'victim' ?'Track your emergency alerts and volunteer responses' :'Review your volunteer activities and community impact'
                }
              </p>
            </div>
            <div className="flex items-center space-x-3 mt-4 md:mt-0">
              {/* Role Switch (Demo) */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleRoleSwitch}
                iconName="RefreshCw"
                iconPosition="left"
                iconSize={16}
              >
                Switch to {userRole === 'victim' ? 'Volunteer' : 'Victim'} View
              </Button>
              
              <Button
                variant="default"
                onClick={() => setIsExportModalOpen(true)}
                iconName="Download"
                iconPosition="left"
                iconSize={16}
              >
                Export History
              </Button>
            </div>
          </div>

          {/* Statistics Panel */}
          <StatisticsPanel stats={mockStats} userRole={userRole} />

          {/* Filter Controls */}
          <FilterControls
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onSearch={handleSearch}
            searchQuery={searchQuery}
            onClearFilters={handleClearFilters}
            userRole={userRole}
          />

          {/* Results Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <p className="text-sm text-muted-foreground">
                Showing {paginatedAlerts?.length} of {filteredAlerts?.length} alerts
              </p>
              {searchQuery && (
                <div className="flex items-center text-sm text-primary">
                  <Icon name="Search" size={14} className="mr-1" />
                  <span>"{searchQuery}"</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e?.target?.value)}
                className="text-sm border border-border rounded-md px-2 py-1 bg-background text-foreground"
              >
                {sortOptions?.map(option => (
                  <option key={option?.value} value={option?.value}>
                    {option?.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Alert List */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-primary rounded-full animate-pulse"></div>
                <div className="w-4 h-4 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-4 h-4 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <span className="text-muted-foreground ml-2">Loading alerts...</span>
              </div>
            </div>
          ) : paginatedAlerts?.length > 0 ? (
            <div className="space-y-4">
              {paginatedAlerts?.map((alert) => (
                <AlertHistoryCard
                  key={alert?.id}
                  alert={alert}
                  userRole={userRole}
                  onExport={handleExportAlert}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="History" size={32} className="text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No Alerts Found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || Object.values(filters)?.some(f => f !== 'all' && f !== '')
                  ? 'Try adjusting your search or filter criteria'
                  : userRole === 'victim' ?'You haven\'t sent any emergency alerts yet' :'You haven\'t responded to any alerts yet'
                }
              </p>
              {(searchQuery || Object.values(filters)?.some(f => f !== 'all' && f !== '')) && (
                <Button
                  variant="outline"
                  onClick={handleClearFilters}
                  iconName="X"
                  iconPosition="left"
                  iconSize={16}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 mt-8">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                iconName="ChevronLeft"
                iconSize={16}
              >
                Previous
              </Button>
              
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="w-8 h-8"
                    >
                      {page}
                    </Button>
                  );
                })}
                {totalPages > 5 && (
                  <>
                    <span className="text-muted-foreground">...</span>
                    <Button
                      variant={currentPage === totalPages ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setCurrentPage(totalPages)}
                      className="w-8 h-8"
                    >
                      {totalPages}
                    </Button>
                  </>
                )}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                iconName="ChevronRight"
                iconSize={16}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </main>
      {/* Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleBulkExport}
        userRole={userRole}
      />
    </div>
  );
};

export default AlertHistory;