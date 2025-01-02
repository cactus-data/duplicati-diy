import { RefreshCw } from 'lucide-react';
import { DashboardStats } from '../components/dashboard/DashboardStats';
import { BackupTable } from '../components/dashboard/BackupTable';
import { useBackups } from '../hooks/useBackups';

export function Machines() {
  const { backups, loading, error } = useBackups();

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Backups</h1>
        <p className="text-gray-400">
          Manage all your backup configurations
        </p>
      </div>

      <DashboardStats backups={backups} />

      <div className="bg-gray-900 rounded-lg shadow overflow-hidden">
        <div className="p-4">
          <input
            type="text"
            placeholder="Search"
            className="w-64 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {error && (
          <div className="p-4 bg-red-900/30 text-red-300">
            Failed to load backups. Please try again later.
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center p-8">
            <RefreshCw className="w-6 h-6 text-gray-400 animate-spin" />
          </div>
        ) : (
          <BackupTable backups={backups} groupByBackupId={true} />
        )}
      </div>
    </div>
  );
}
