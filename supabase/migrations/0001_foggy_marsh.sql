/*
  # Duplicati Backup Reports Schema

  1. New Tables
    - `backup_configs`: Stores backup configuration details
      - `id` (uuid, primary key)
      - `machine_id` (text): Machine identifier
      - `machine_name` (text): Machine name
      - `backup_name` (text): Name of the backup
      - `backup_id` (text): Backup identifier
      - `created_at` (timestamptz)

    - `backup_reports`: Stores main backup report data
      - `id` (uuid, primary key)
      - `config_id` (uuid, foreign key)
      - `version` (text): Duplicati version
      - `begin_time` (timestamptz)
      - `end_time` (timestamptz)
      - `duration` (interval)
      - `main_operation` (text)
      - `parsed_result` (text)
      - `interrupted` (boolean)
      - `examined_files` (bigint)
      - `opened_files` (bigint)
      - `size_of_examined_files` (bigint)
      - `size_of_opened_files` (bigint)
      - `created_at` (timestamptz)

    - `backend_statistics`: Stores backup statistics
      - `id` (uuid, primary key)
      - `report_id` (uuid, foreign key)
      - `remote_calls` (integer)
      - `bytes_uploaded` (bigint)
      - `bytes_downloaded` (bigint)
      - `files_uploaded` (integer)
      - `files_downloaded` (integer)
      - `files_deleted` (integer)
      - `folders_created` (integer)
      - `retry_attempts` (integer)
      - `known_file_count` (integer)
      - `known_file_size` (bigint)
      - `last_backup_date` (timestamptz)
      - `backup_list_count` (integer)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create backup_configs table
CREATE TABLE IF NOT EXISTS backup_configs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  machine_id text NOT NULL,
  machine_name text NOT NULL,
  backup_name text NOT NULL,
  backup_id text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(machine_id, backup_id)
);

-- Create backup_reports table
CREATE TABLE IF NOT EXISTS backup_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  config_id uuid REFERENCES backup_configs(id) ON DELETE CASCADE,
  version text NOT NULL,
  begin_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  duration interval NOT NULL,
  main_operation text NOT NULL,
  parsed_result text NOT NULL,
  interrupted boolean NOT NULL DEFAULT false,
  examined_files bigint NOT NULL DEFAULT 0,
  opened_files bigint NOT NULL DEFAULT 0,
  size_of_examined_files bigint NOT NULL DEFAULT 0,
  size_of_opened_files bigint NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create backend_statistics table
CREATE TABLE IF NOT EXISTS backend_statistics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id uuid REFERENCES backup_reports(id) ON DELETE CASCADE,
  remote_calls integer NOT NULL DEFAULT 0,
  bytes_uploaded bigint NOT NULL DEFAULT 0,
  bytes_downloaded bigint NOT NULL DEFAULT 0,
  files_uploaded integer NOT NULL DEFAULT 0,
  files_downloaded integer NOT NULL DEFAULT 0,
  files_deleted integer NOT NULL DEFAULT 0,
  folders_created integer NOT NULL DEFAULT 0,
  retry_attempts integer NOT NULL DEFAULT 0,
  known_file_count integer NOT NULL DEFAULT 0,
  known_file_size bigint NOT NULL DEFAULT 0,
  last_backup_date timestamptz,
  backup_list_count integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE backup_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE backup_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE backend_statistics ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow authenticated users to read backup_configs"
  ON backup_configs
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to read backup_reports"
  ON backup_reports
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to read backend_statistics"
  ON backend_statistics
  FOR SELECT
  TO authenticated
  USING (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_backup_configs_machine_id ON backup_configs(machine_id);
CREATE INDEX IF NOT EXISTS idx_backup_reports_config_id ON backup_reports(config_id);
CREATE INDEX IF NOT EXISTS idx_backup_reports_begin_time ON backup_reports(begin_time);
CREATE INDEX IF NOT EXISTS idx_backend_statistics_report_id ON backend_statistics(report_id);
