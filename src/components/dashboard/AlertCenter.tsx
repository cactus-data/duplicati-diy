import { useState } from 'react';
import { AlertTriangle, Info, AlertCircle, Clock } from 'lucide-react';
import type { BackupWithReport } from '../../hooks/useBackups';

interface AlertCenterProps {
  backups: BackupWithReport[];
}

export function AlertCenter({ backups }: AlertCenterProps) {
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Get alerts from backups
  const alerts = backups.flatMap(backup => {
    if (!backup.latest_report) return [];

    let severity = 'info';
    if (backup.latest_report.interrupted) {
      severity = 'critical';
    } else if (backup.latest_report.parsed_result.toLowerCase().includes('warning')) {
      severity = 'warning';
    }

    const message = backup.latest_report.interrupted
      ? `was not backed up due to a critical error!`
      : `backed up "${backup.backup_name}" with ${backup.latest_report.parsed_result}!`;

    return [{
      id: backup.latest_report.id,
      severity,
      message,
      machineName: backup.machine_name,
      timestamp: new Date(backup.latest_report.end_time),
      duration: backup.latest_report.duration,
    }];
  });

  const filteredAlerts = alerts.filter(alert => {
    if (selectedFilter === 'all') return true;
    return alert.severity === selectedFilter;
  });

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center space-x-2 p-6 pb-4">
        <AlertTriangle className="w-5 h-5 text-gray-300" />
        <h2 className="text-lg font-medium text-gray-300">Alert Center</h2>
      </div>

      <div className="flex space-x-2 px-6 pb-6">
        {['all', 'info', 'notice', 'warning', 'critical'].map((filter) => (
          <button
            key={filter}
            onClick={() => setSelectedFilter(filter)}
            className={`px-3 py-1.5 rounded-md text-sm capitalize ${
              selectedFilter === filter
                ? 'bg-[#2C2C2C] text-white'
                : 'text-gray-300 hover:bg-[#2C2C2C]/50'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto min-h-0 px-6">
        {filteredAlerts.map((alert) => {
          let Icon = Info;
          let iconColor = 'text-blue-400';
          
          if (alert.severity === 'critical') {
            Icon = AlertCircle;
            iconColor = 'text-red-500';
          } else if (alert.severity === 'warning') {
            Icon = AlertTriangle;
            iconColor = 'text-yellow-500';
          }
          
          return (
            <div
              key={alert.id}
              className="flex items-start space-x-3"
            >
              <div className={`flex-shrink-0 ${iconColor}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-300">
                  <span className="font-medium">{alert.machineName}</span>{' '}
                  {alert.message}
                </p>
                <div className="flex items-center space-x-1 mt-1">
                  <Clock className="w-3 h-3 text-gray-500" />
                  <p className="text-xs text-gray-500">
                    {alert.timestamp.toRelativeString()} • {alert.timestamp.toLocaleTimeString().slice(0, 5)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
