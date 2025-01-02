import { useBackups } from '../hooks/useBackups';
import { DashboardStats } from '../components/dashboard/DashboardStats';
import { StorageGraph } from '../components/dashboard/StorageGraph';
import { AlertCenter } from '../components/dashboard/AlertCenter';

export function Dashboard() {
  const { backups, loading, error } = useBackups();

  return (
    <div className="h-full bg-gray-900 p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Machines</h1>
        <p className="text-gray-400">
          Manage all the machines in your organisation
        </p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Stats and Graph Section */}
        <div className="col-span-8 space-y-6">
          <DashboardStats backups={backups} />
          {/* Graph Card */}
          <div className="bg-[#1C1C1C] rounded-lg p-6">
            <StorageGraph backups={backups} />
          </div>
        </div>
        {/* Alert Center */}
        <div className="col-span-4 bg-[#1C1C1C] rounded-lg h-[calc(100vh-20rem)]">
          <AlertCenter backups={backups} />
        </div>
      </div>
    </div>
  );
}
