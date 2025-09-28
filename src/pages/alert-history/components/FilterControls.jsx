import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const FilterControls = ({ 
  filters, 
  onFiltersChange, 
  onSearch, 
  searchQuery, 
  onClearFilters,
  userRole 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const emergencyTypeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'medical', label: 'Medical Emergency' },
    { value: 'fire', label: 'Fire Emergency' },
    { value: 'accident', label: 'Accident' },
    { value: 'security', label: 'Security Issue' },
    { value: 'natural', label: 'Natural Disaster' },
    { value: 'other', label: 'Other' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'pending', label: 'Pending' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'no-response', label: 'No Response' }
  ];

  const urgencyOptions = [
    { value: 'all', label: 'All Urgency' },
    { value: 'critical', label: 'Critical' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' }
  ];

  const dateRangeOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'Last 3 Months' },
    { value: 'year', label: 'This Year' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const hasActiveFilters = () => {
    return Object.values(filters)?.some(value => value !== 'all' && value !== '');
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      {/* Search and Quick Actions */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex-1">
          <Input
            type="search"
            placeholder="Search by location, description, or alert ID..."
            value={searchQuery}
            onChange={(e) => onSearch(e?.target?.value)}
            className="w-full"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            iconName="Filter"
            iconPosition="left"
            iconSize={16}
            className={hasActiveFilters() ? 'border-primary text-primary' : ''}
          >
            Filters
            {hasActiveFilters() && (
              <span className="ml-1 w-2 h-2 bg-primary rounded-full"></span>
            )}
          </Button>
          {hasActiveFilters() && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              iconName="X"
              iconSize={14}
            >
              Clear
            </Button>
          )}
        </div>
      </div>
      {/* Expanded Filters */}
      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-border animate-fade-in">
          <Select
            label="Emergency Type"
            options={emergencyTypeOptions}
            value={filters?.type}
            onChange={(value) => handleFilterChange('type', value)}
          />

          <Select
            label="Status"
            options={statusOptions}
            value={filters?.status}
            onChange={(value) => handleFilterChange('status', value)}
          />

          <Select
            label="Urgency Level"
            options={urgencyOptions}
            value={filters?.urgency}
            onChange={(value) => handleFilterChange('urgency', value)}
          />

          <Select
            label="Date Range"
            options={dateRangeOptions}
            value={filters?.dateRange}
            onChange={(value) => handleFilterChange('dateRange', value)}
          />

          {/* Custom Date Range */}
          {filters?.dateRange === 'custom' && (
            <>
              <Input
                type="date"
                label="From Date"
                value={filters?.startDate}
                onChange={(e) => handleFilterChange('startDate', e?.target?.value)}
              />
              <Input
                type="date"
                label="To Date"
                value={filters?.endDate}
                onChange={(e) => handleFilterChange('endDate', e?.target?.value)}
              />
            </>
          )}
        </div>
      )}
      {/* Active Filters Summary */}
      {hasActiveFilters() && (
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {Object.entries(filters)?.map(([key, value]) => {
            if (value === 'all' || value === '') return null;
            
            const getFilterLabel = (key, value) => {
              switch (key) {
                case 'type':
                  return emergencyTypeOptions?.find(opt => opt?.value === value)?.label || value;
                case 'status':
                  return statusOptions?.find(opt => opt?.value === value)?.label || value;
                case 'urgency':
                  return urgencyOptions?.find(opt => opt?.value === value)?.label || value;
                case 'dateRange':
                  return dateRangeOptions?.find(opt => opt?.value === value)?.label || value;
                default:
                  return value;
              }
            };

            return (
              <span
                key={key}
                className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
              >
                {getFilterLabel(key, value)}
                <button
                  onClick={() => handleFilterChange(key, 'all')}
                  className="ml-1 hover:bg-primary/20 rounded-full p-0.5"
                >
                  <Icon name="X" size={10} />
                </button>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FilterControls;