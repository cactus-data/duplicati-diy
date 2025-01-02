export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
}

export function formatDuration(duration: string): string {
  // Handle empty or invalid input
  if (!duration) return '-';

  // Parse the PostgreSQL interval format (e.g., "02:30:45" or "1 day 02:30:45")
  const parts = duration.split(' ');
  let timeStr = parts[parts.length - 1];
  let days = 0;

  // Extract days if present
  if (parts.length > 1) {
    days = parseInt(parts[0]);
  }

  // Parse time components
  const [hours, minutes, seconds] = timeStr.split(':').map(Number);
  
  // Calculate total hours including days
  const totalHours = days * 24 + hours;

  // Round up minutes if there are seconds
  const totalMinutes = minutes + (seconds >= 30 ? 1 : 0);

  if (totalHours >= 1) {
    return `${totalHours} hour${totalHours > 1 ? 's' : ''} ${totalMinutes} minute${totalMinutes > 1 ? 's' : ''}`;
  } else if (totalMinutes >= 1) {
    return `${totalMinutes} minute${totalMinutes > 1 ? 's' : ''}`;
  } else {
    return '1 minute'; // Show at least 1 minute for very short durations
  }
}

// Add toRelativeString method to Date prototype
declare global {
  interface Date {
    toRelativeString(): string;
  }
}

Date.prototype.toRelativeString = function(): string {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dateToCompare = new Date(this.getFullYear(), this.getMonth(), this.getDate());
  
  // Check if date is from today
  if (dateToCompare.getTime() === startOfToday.getTime()) {
    return 'today';
  }
  
  const timeDiff = startOfToday.getTime() - dateToCompare.getTime();
  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

  if (days === 1) return 'yesterday';
  if (days === 2) return '2 days ago';
  if (days > 2 && days < 7) return `${days} days ago`;
  
  // For older dates
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks} week${weeks === 1 ? '' : 's'} ago`;
  
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months === 1 ? '' : 's'} ago`;
  
  const years = Math.floor(days / 365);
  return `${years} year${years === 1 ? '' : 's'} ago`;
};

export function getBackupCount(backups: any[]): number {
  // Count total number of reports
  return backups.reduce((total, backup) => {
    // Add 1 for each report in the history array
    return total + (backup.history?.length || 0);
  }, 0);
}

export function getSuccessRate(backups: any[]): number {
  let totalReports = 0;
  let successfulReports = 0;

  backups.forEach(backup => {
    const reports = backup.history || [];
    reports.forEach((report: any) => {
      totalReports++;
      
      // Check for success based on parsed_result and interrupted status
      if (!report.interrupted && 
          report.parsed_result.toLowerCase() === 'success') {
        successfulReports++;
      }
    });
  });

  return totalReports > 0 ? successfulReports / totalReports : 0;
}
