// ====== frontend/src/admin/services/fieldService.js ======
import BaseService from './baseService';

class FieldService extends BaseService {
  constructor() {
    super('/admin/fields');
  }

  async getAllFields() {
    return this.get('/');
  }

  async getFieldsWithBookings(date) {
    return this.get('/with-bookings', { date });
  }

  async createField(fieldData) {
    return this.post('/', fieldData);
  }

  async updateField(fieldId, fieldData) {
    return this.put(`/${fieldId}`, fieldData);
  }
}

export default new FieldService();

// Named exports for compatibility
export const getAllFields = () => new FieldService().getAllFields();
export const getFieldsWithBookings = (date) => new FieldService().getFieldsWithBookings(date);
export const createField = (data) => new FieldService().createField(data);
export const updateField = (id, data) => new FieldService().updateField(id, data);
