/*
  # Remove unique constraint from backup_configs

  1. Changes
    - Remove the unique constraint on (machine_id, backup_id) from backup_configs table
    - This allows multiple configurations with the same machine_id and backup_id

  Note: This is a backwards-compatible change that allows more flexible configuration management
*/

ALTER TABLE backup_configs
DROP CONSTRAINT IF EXISTS backup_configs_machine_id_backup_id_key;
