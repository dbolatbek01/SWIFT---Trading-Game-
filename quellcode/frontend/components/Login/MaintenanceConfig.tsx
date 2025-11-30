// ===== MAINTENANCE CONFIGURATION =====
export const MAINTENANCE_CONFIG = {
  dayOfWeek: 1,        // 0 = Sunday, 1 = Monday, 2 = Tuesday, etc.
  dayName: 'Monday',  // Display name for the day
  startHour: 0,       // Start hour (0-23)
  startMinute: 0,     // Start minute (0-59)
  endHour: 1,         // End hour (0-23)
  endMinute: 0,       // End minute (0-59)
};
// ======================================

/**
 * Check if the current time is within the maintenance window.
 * 
 * @returns true if currently in maintenance window, false otherwise
 */
export function isMaintenanceTime(): boolean {
  const now = new Date();
  const day = now.getDay();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  
  // Check if it's the correct day
  if (day !== MAINTENANCE_CONFIG.dayOfWeek) {
    return false;
  }
  
  // Convert times to minutes for easier comparison
  const currentMinutes = hours * 60 + minutes;
  const maintenanceStart = MAINTENANCE_CONFIG.startHour * 60 + MAINTENANCE_CONFIG.startMinute;
  const maintenanceEnd = MAINTENANCE_CONFIG.endHour * 60 + MAINTENANCE_CONFIG.endMinute;
  
  return currentMinutes >= maintenanceStart && currentMinutes < maintenanceEnd;
}

/**
 * Get formatted maintenance window string for display
 * 
 * @returns Formatted string like "Tuesday 23:30 - 23:37"
 */
export function getMaintenanceWindowString(): string {
  const formatTime = (hour: number, minute: number) => {
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  };
  
  const startTime = formatTime(MAINTENANCE_CONFIG.startHour, MAINTENANCE_CONFIG.startMinute);
  const endTime = formatTime(MAINTENANCE_CONFIG.endHour, MAINTENANCE_CONFIG.endMinute);
  
  return `${MAINTENANCE_CONFIG.dayName} ${startTime} - ${endTime}`;
}
