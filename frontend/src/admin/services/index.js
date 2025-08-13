// ========================
// 🔗 FRONTEND SERVICES REFACTORING
// ========================

// ====== frontend/src/admin/services/index.js (Main Service Export) ======
export { default as dashboardService } from './dashboardService';
export { default as bookingService } from './bookingService';
export { default as customerService } from './customerService';
export { default as fieldService } from './fieldService';
export { default as revenueService } from './revenueService';
export { default as adminService } from './adminService';

// Re-export for backward compatibility
export * from './dashboardService';
export * from './bookingService';
export * from './customerService';
export * from './fieldService';
export * from './revenueService';
export * from './adminService';







