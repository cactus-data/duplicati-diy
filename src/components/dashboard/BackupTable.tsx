import { Link } from 'react-router-dom';
import { Link as LinkIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { BackupStatusHistory } from './BackupStatusHistory';
import { formatBytes, formatDuration } from '../../utils/format'; 
import type { BackupConfig, BackupReport } from '../../types/backup';

interface BackupTableProps {
  backups: (BackupConfig & { latest_report?: BackupReport })[];
  groupByBackupId?: boolean;
}

export function BackupTable({ backups, groupByBackupId = true }: BackupTableProps) {
  const displayData = groupByBackupId 
    ? Object.values(backups.reduce<Record<string, GroupedBackup>>((acc, backup) => {
        if (!acc[backup.backup_id]) {
          acc[backup.backup_id] = {
            backup_id: backup.backup_id,
            backup_name: backup.backup_name,
            machines: [],
            total_size: 0,
          };
        }
        
        const size = backup.latest_report?.size_of_opened_files || 0;
        acc[backup.backup_id].machines.push(backup);
        acc[backup.backup_id].total_size += Number(size);
        
        return acc;
      }, {}))
    : backups;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead className="border-b border-gray-800">
          <tr className="text-left text-gray-400 text-sm whitespace-nowrap">
            <th className="py-3 px-4">Status</th>
            <th className="py-3 px-4">{groupByBackupId ? 'Backup ID' : 'Machine ID'}</th>
            <th className="py-3 px-4">{groupByBackupId ? 'Backup Name' : 'Machine Name'}</th>
            <th className="py-3 px-4">End time relative</th>
            <th className="py-3 px-4">End time</th>
            <th className="py-3 px-4">Duration</th>
            <th className="py-3 px-4">Source</th>
            <th className="py-3 px-4">Destination</th>
          </tr>
        </thead>
        <tbody className="text-gray-300">
          {displayData.map((item) => {
            const isGroup = 'machines' in item;
            const backup = isGroup ? item.machines[0] : item;
            const reports = isGroup
              ? item.machines.flatMap((m, idx) => 
                  (m.history || []).map(h => ({ ...h, machineIndex: idx }))
                )
              : (backup.history || []).map(h => ({ ...h, machineIndex: 0 }));
            
            const uniqueKey = `${isGroup ? 'backup' : 'machine'}-${
              isGroup ? item.backup_id : backup.machine_id
            }-${Date.now()}`;
            
            return (
            <tr key={uniqueKey} className="border-b border-gray-800 whitespace-nowrap">
              <td className="py-3 px-4">
                <BackupStatusHistory 
                  reports={reports.map(r => r)}
                />
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center space-x-2">
                  <span>{isGroup ? item.backup_id : backup.machine_id}</span>
                  <LinkIcon className="w-4 h-4 text-gray-500 hover:text-gray-300 cursor-pointer flex-shrink-0" />
                </div>
              </td>
              <td className="py-3 px-4">
                {isGroup ? item.backup_name : backup.machine_name}
              </td>
              <td className="py-3 px-4">
                {backup.latest_report
                  ? new Date(backup.latest_report.end_time).toRelativeString()
                  : '-'}
              </td>
              <td className="py-3 px-4">
                {backup.latest_report
                  ? new Date(backup.latest_report.end_time).toLocaleString()
                  : '-'}
              </td>
              <td className="py-3 px-4">
                {formatDuration(backup.latest_report?.duration || '')}
              </td>
              <td className="py-3 px-4">
                {formatBytes(
                  isGroup
                    ? item.machines.reduce((sum, m) => sum + Number(m.latest_report?.size_of_examined_files || 0), 0)
                    : Number(backup.latest_report?.size_of_examined_files || 0)
                )}
              </td>
              <td className="py-3 px-4">
                {formatBytes(isGroup ? item.total_size : Number(backup.latest_report?.size_of_opened_files || 0))}
              </td>
            </tr>
          )})}
        </tbody>
      </table>
      <div className="flex justify-between items-center p-4 border-t border-gray-800">
        <select className="bg-gray-900 text-gray-300 rounded px-3 py-1.5 text-sm border border-gray-700">
          <option>20 items per page</option>
          <option>50 items per page</option>
          <option>100 items per page</option>
        </select>
        <div className="flex items-center space-x-4 text-sm text-gray-400">
          <span>1 - 2 of 2</span> 
          <div className="flex space-x-1">
          <button className="p-1 rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button className="p-1 rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
            <ChevronRight className="w-5 h-5" />
          </button>
          </div>
        </div>
      </div>
    </div>
  );
}
