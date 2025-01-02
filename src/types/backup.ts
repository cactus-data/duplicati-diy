export interface BackupConfig {
  id: string;
  machine_id: string;
  machine_name: string;
  backup_name: string;
  backup_id: string;
  created_at: string;
}

export interface BackupReport {
  id: string;
  config_id: string;
  version: string;
  begin_time: string;
  end_time: string;
  duration: string;
  main_operation: string;
  parsed_result: string;
  interrupted: boolean;
  examined_files: number;
  opened_files: number;
  size_of_examined_files: number;
  size_of_opened_files: number;
  created_at: string;
}

export interface GroupedBackup {
  backup_id: string;
  backup_name: string;
  machines: (BackupConfig & { latest_report?: BackupReport; history?: BackupReport[] })[];
  total_size: number;
}

export interface BackendStatistics {
  id: string;
  report_id: string;
  remote_calls: number;
  bytes_uploaded: number;
  bytes_downloaded: number;
  files_uploaded: number;
  files_downloaded: number;
  files_deleted: number;
  folders_created: number;
  retry_attempts: number;
  known_file_count: number;
  known_file_size: number;
  last_backup_date: string | null;
  backup_list_count: number;
  created_at: string;
}
