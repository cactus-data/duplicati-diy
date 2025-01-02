import { useState, useEffect } from 'react';
import { getBackupConfigs, getLatestBackupReport, getBackupHistory } from '../lib/api';
import type { BackupConfig, BackupReport } from '../types/backup';

export type BackupWithReport = BackupConfig & {
  latest_report?: BackupReport;
  history?: BackupReport[];
};

export function useBackups() {
  const [backups, setBackups] = useState<BackupWithReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const configs = await getBackupConfigs();
        const backupsWithReports = await Promise.all(
          configs.map(async (config) => {
            try {
              const report = await getLatestBackupReport(config.id);
              const history = await getBackupHistory(config.id, 10);
              return { ...config, latest_report: report, history };
            } catch {
              return config;
            }
          })
        );
        setBackups(backupsWithReports);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch backup data'));
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { backups, loading, error };
}
