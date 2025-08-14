// ====== frontend/src/admin/services/index.js (UPDATED) ======
// Main service exports
export { default as dashboardService } from './dashboardService';
export { default as bookingService } from './bookingService';
export { default as customerService } from './customerService';
export { default as fieldService } from './fieldService';
export { default as revenueService } from './revenueService';
export { default as inventoryService } from './inventoryService';
export { default as maintenanceService } from './maintenanceService';
export { default as adminService } from './adminService';


// Re-export all named exports for backward compatibility
export * from './dashboardService';
export * from './bookingService';
export * from './customerService';
export * from './fieldService';
export * from './revenueService';
export * from './inventoryService';
export * from './maintenanceService';
export * from './adminService';

// Legacy exports mapping
export {
  // Dashboard
  getDashboardStats,
  getRecentBookings
} from './dashboardService';