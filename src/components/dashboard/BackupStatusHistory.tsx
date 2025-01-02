import { useState } from 'react';
import { BackupDetailsModal } from './BackupDetailsModal';
import type { BackupReport } from '../../types/backup';

const STATUS_BLOCKS = 10;

interface BackupStatusHistoryProps {
  reports: BackupReport[];
}

export function BackupStatusHistory({ reports = [] }: BackupStatusHistoryProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedReport, setSelectedReport] = useState<BackupReport | null>(null);

  const latestReports = reports
    .sort((a, b) => new Date(b.begin_time).getTime() - new Date(a.begin_time).getTime())
    .slice(0, STATUS_BLOCKS);

  // Fill array with empty blocks if not enough reports
  const blocks = Array(STATUS_BLOCKS).fill(null);
  latestReports.forEach((report, index) => {
    blocks[index] = report;
  });

  return (
    <div 
      className="relative flex items-center"
      onMouseEnter={() => {
        setIsExpanded(true);
      }}
      onMouseLeave={() => {
        setIsExpanded(false);
      }}
    >
      <div className={`flex items-center transition-all duration-300 ${isExpanded ? 'gap-1' : 'gap-0'}`}>
        {blocks.map((report, index) => (
          <div
            onClick={() => report && setSelectedReport(report)}
            key={report?.id || index}
            className={`w-1.5 h-5 transition-all duration-300 ${
              !report
                ? 'border border-dashed border-gray-700'
                : report.parsed_result === 'Success' 
                ? 'bg-green-500 cursor-pointer hover:bg-green-400 border border-black/20'
                : 'bg-yellow-500 cursor-pointer hover:bg-yellow-400 border border-black/20'
            }`}
          />
        ))}
      </div>

      {selectedReport && (
        <BackupDetailsModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
        />
      )}
    </div>
  );
}
