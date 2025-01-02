import { supabase } from './supabase';
import type { BackupConfig, BackupReport, BackendStatistics } from '../types/backup';

export async function getBackupHistory(configId: string, limit = 10) {
  const { data, error } = await supabase
    .from('backup_reports')
    .select('*')
    .eq('config_id', configId)
    .order('begin_time', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as BackupReport[];
}

export async function getBackupConfigs() {
  const { data, error } = await supabase
    .from('backup_configs')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as BackupConfig[];
}

export async function getBackupReports(configId: string) {
  const { data, error } = await supabase
    .from('backup_reports')
    .select(`
      *,
      backend_statistics (*)
    `)
    .eq('config_id', configId)
    .order('begin_time', { ascending: false });

  if (error) throw error;
  return data as (BackupReport & { backend_statistics: BackendStatistics })[];
}

export async function getLatestBackupReport(configId: string) {
  const { data, error } = await supabase
    .from('backup_reports')
    .select('*, backend_statistics (*)')
    .eq('config_id', configId)
    .order('begin_time', { ascending: false })
    .limit(1);

  // Return null if no report found or there's an error
  if (error || !data || data.length === 0) {
    return null;
  }
  
  return data[0] as BackupReport & { backend_statistics: BackendStatistics };
}

export async function processBackupReport(reportData: any) {
  const { data: existingConfig, error: configError } = await supabase
    .from('backup_configs')
    .select('id')
    .eq('machine_id', reportData.Extra['machine-id'])
    .eq('backup_id', reportData.Extra['backup-id'])
    .single();

  if (configError && configError.code !== 'PGRST116') {
    throw configError;
  }

  let configId = existingConfig?.id;

  if (!configId) {
    const { data: newConfig, error: insertError } = await supabase
      .from('backup_configs')
      .insert({
        machine_id: reportData.Extra['machine-id'],
        machine_name: reportData.Extra['machine-name'],
        backup_name: reportData.Extra['backup-name'],
        backup_id: reportData.Extra['backup-id'],
      })
      .select()
      .single();

    if (insertError) throw insertError;
    configId = newConfig.id;
  }

  const { data: report, error: reportError } = await supabase
    .from('backup_reports')
    .insert({
      config_id: configId,
      version: reportData.Data.Version,
      begin_time: reportData.Data.BeginTime,
      end_time: reportData.Data.EndTime,
      duration: reportData.Data.Duration,
      main_operation: reportData.Data.MainOperation,
      parsed_result: reportData.Data.ParsedResult,
      interrupted: reportData.Data.Interrupted,
      examined_files: reportData.Data.ExaminedFiles,
      opened_files: reportData.Data.OpenedFiles,
      size_of_examined_files: reportData.Data.SizeOfExaminedFiles,
      size_of_opened_files: reportData.Data.SizeOfOpenedFiles,
    })
    .select()
    .single();

  if (reportError) throw reportError;

  const { error: statsError } = await supabase
    .from('backend_statistics')
    .insert({
      report_id: report.id,
      remote_calls: reportData.Data.BackendStatistics.RemoteCalls,
      bytes_uploaded: reportData.Data.BackendStatistics.BytesUploaded,
      bytes_downloaded: reportData.Data.BackendStatistics.BytesDownloaded,
      files_uploaded: reportData.Data.BackendStatistics.FilesUploaded,
      files_downloaded: reportData.Data.BackendStatistics.FilesDownloaded,
      files_deleted: reportData.Data.BackendStatistics.FilesDeleted,
      folders_created: reportData.Data.BackendStatistics.FoldersCreated,
      retry_attempts: reportData.Data.BackendStatistics.RetryAttempts,
      known_file_count: reportData.Data.BackendStatistics.KnownFileCount,
      known_file_size: reportData.Data.BackendStatistics.KnownFileSize,
      last_backup_date: reportData.Data.BackendStatistics.LastBackupDate,
      backup_list_count: reportData.Data.BackendStatistics.BackupListCount,
    });

  if (statsError) throw statsError;

  return report;
}
