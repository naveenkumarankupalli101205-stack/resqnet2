import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const ExportModal = ({ isOpen, onClose, onExport, userRole }) => {
  const [exportConfig, setExportConfig] = useState({
    format: 'csv',
    dateRange: 'all',
    includeDetails: true,
    includeComments: false,
    includeLocation: true,
    includePersonalInfo: false
  });

  const formatOptions = [
    { value: 'csv', label: 'CSV (Excel Compatible)' },
    { value: 'json', label: 'JSON (Technical Format)' },
    { value: 'pdf', label: 'PDF (Printable Report)' }
  ];

  const dateRangeOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'year', label: 'This Year' },
    { value: 'quarter', label: 'Last 3 Months' },
    { value: 'month', label: 'This Month' },
    { value: 'week', label: 'This Week' }
  ];

  const handleExport = () => {
    onExport(exportConfig);
    onClose();
  };

  const updateConfig = (key, value) => {
    setExportConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-alert bg-black/50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-card rounded-lg max-w-md w-full shadow-emergency-lg animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center mr-3">
              <Icon name="Download" size={20} className="text-accent" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Export Alert History</h3>
              <p className="text-sm text-muted-foreground">
                Download your emergency records
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            iconName="X"
            iconSize={18}
            className="p-1"
          />
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Format Selection */}
          <Select
            label="Export Format"
            description="Choose the file format for your export"
            options={formatOptions}
            value={exportConfig?.format}
            onChange={(value) => updateConfig('format', value)}
          />

          {/* Date Range */}
          <Select
            label="Date Range"
            description="Select the time period to export"
            options={dateRangeOptions}
            value={exportConfig?.dateRange}
            onChange={(value) => updateConfig('dateRange', value)}
          />

          {/* Export Options */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground">Include in Export</h4>
            
            <Checkbox
              label="Detailed alert information"
              description="Emergency type, urgency, timestamps"
              checked={exportConfig?.includeDetails}
              onChange={(e) => updateConfig('includeDetails', e?.target?.checked)}
            />

            <Checkbox
              label="Location data"
              description="Emergency locations and distances"
              checked={exportConfig?.includeLocation}
              onChange={(e) => updateConfig('includeLocation', e?.target?.checked)}
            />

            {userRole === 'victim' && (
              <Checkbox
                label="Volunteer information"
                description="Names and response details of helpers"
                checked={exportConfig?.includeComments}
                onChange={(e) => updateConfig('includeComments', e?.target?.checked)}
              />
            )}

            {userRole === 'volunteer' && (
              <Checkbox
                label="Communication logs"
                description="Messages and coordination details"
                checked={exportConfig?.includeComments}
                onChange={(e) => updateConfig('includeComments', e?.target?.checked)}
              />
            )}

            <Checkbox
              label="Personal information"
              description="Contact details and profile data"
              checked={exportConfig?.includePersonalInfo}
              onChange={(e) => updateConfig('includePersonalInfo', e?.target?.checked)}
            />
          </div>

          {/* Privacy Notice */}
          <div className="p-3 bg-warning/10 rounded-md">
            <div className="flex items-start">
              <Icon name="Shield" size={16} className="text-warning mr-2 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-warning mb-1">Privacy Notice</p>
                <p className="text-xs text-muted-foreground">
                  Exported data contains sensitive information. Store securely and follow local privacy regulations.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-6 border-t border-border">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={handleExport}
            iconName="Download"
            iconPosition="left"
            iconSize={16}
            className="flex-1"
          >
            Export Data
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;