// ====== frontend/src/admin/services/baseService.js ======
import API from '../../services/api';

class BaseService {
  constructor(baseURL = '/admin') {
    this.baseURL = baseURL;
  }

  getAuthHeaders() {
    const token = localStorage.getItem('adminToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async request(method, endpoint, data = null, config = {}) {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const requestConfig = {
        method,
        url,
        headers: {
          ...this.getAuthHeaders(),
          ...config.headers
        },
        ...config
      };

      if (data) {
        if (method.toLowerCase() === 'get') {
          requestConfig.params = data;
        } else {
          requestConfig.data = data;
        }
      }

      const response = await API(requestConfig);
      return response.data;
    } catch (error) {
      console.error(`Error in ${method} ${endpoint}:`, error);
      throw error;
    }
  }

  async get(endpoint, params = {}, config = {}) {
    return this.request('GET', endpoint, params, config);
  }

  async post(endpoint, data = {}, config = {}) {
    return this.request('POST', endpoint, data, config);
  }

  async put(endpoint, data = {}, config = {}) {
    return this.request('PUT', endpoint, data, config);
  }

  async patch(endpoint, data = {}, config = {}) {
    return this.request('PATCH', endpoint, data, config);
  }

  async delete(endpoint, config = {}) {
    return this.request('DELETE', endpoint, null, config);
  }
}

export default BaseService;
