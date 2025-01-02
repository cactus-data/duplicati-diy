import { HardDrive, Link2 } from 'lucide-react';
import { StatCard } from './StatCard';
import { SuccessRate } from './SuccessRate';
import { getBackupCount, getSuccessRate } from '../../utils/format';
import type { BackupWithReport } from '../../hooks/useBackups';

function getMachineCount(backups: BackupWithReport[]): number {
  // Create a Set of unique machine_ids to count unique machines
  const uniqueMachines = new Set(backups.map(backup => backup.machine_id));
  return uniqueMachines.size;
}

interface DashboardStatsProps {
  backups: BackupWithReport[];
}

export function DashboardStats({ backups }: DashboardStatsProps) {
  const totalMachines = getMachineCount(backups);
  const totalBackups = getBackupCount(backups);

  const successRate = getSuccessRate(backups);

  return (
    <div className="grid grid-cols-2 gap-6">
      <StatCard
        title="Total machines"
        value={totalMachines}
        icon={HardDrive}
      />
      <StatCard
        title="Total backups"
        value={totalBackups}
        icon={Link2}
      />
      <SuccessRate rate={successRate} />
    </div>
  );
}
