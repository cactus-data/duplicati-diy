import { X } from 'lucide-react';
import type { BackupReport } from '../../types/backup';
import { formatBytes, formatDuration } from '../../utils/format';

interface BackupDetailsModalProps {
  report: BackupReport;
  onClose: () => void;
}

export function BackupDetailsModal({ report, onClose }: BackupDetailsModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg shadow-xl w-full max-w-3xl mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div>
            <h2 className="text-xl font-semibold text-white">
              Backup Report Details
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              {new Date(report.begin_time).toLocaleString()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-4">General Information</h3>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm text-gray-500">Status</dt>
                  <dd className={`mt-1 text-sm ${
                    report.parsed_result === 'Success' 
                      ? 'text-green-400' 
                      : 'text-yellow-400'
                  }`}>
                    {report.parsed_result}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Begin Time</dt>
                  <dd className="mt-1 text-sm text-white">
                    {new Date(report.begin_time).toLocaleString()}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">End Time</dt>
                  <dd className="mt-1 text-sm text-white">
                    {new Date(report.end_time).toLocaleString()}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Duration</dt>
                  <dd className="mt-1 text-sm text-white">{formatDuration(report.duration)}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Version</dt>
                  <dd className="mt-1 text-sm text-white">{report.version}</dd>
                </div>
              </dl>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-4">Statistics</h3>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm text-gray-500">Source Size</dt>
                  <dd className="mt-1 text-sm text-white">
                    {formatBytes(Number(report.size_of_examined_files))}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Destination Size</dt>
                  <dd className="mt-1 text-sm text-white">
                    {formatBytes(Number(report.size_of_opened_files))}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Examined Files</dt>
                  <dd className="mt-1 text-sm text-white">
                    {report.examined_files.toLocaleString()}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Opened Files</dt>
                  <dd className="mt-1 text-sm text-white">
                    {report.opened_files.toLocaleString()}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Operation</dt>
                  <dd className="mt-1 text-sm text-white">{report.main_operation}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t border-gray-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-lg hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
