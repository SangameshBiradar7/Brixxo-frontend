// API utility functions for consistent backend communication

const getBackendUrl = () => {
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
};

const buildUrl = (endpoint: string) => {
  return `${getBackendUrl().replace(/\/$/, "")}/api${endpoint}`;
};

const getAuthHeaders = (): Record<string, string> => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const api = {
  // GET request
  get: async (endpoint: string) => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    };

    const response = await fetch(buildUrl(endpoint), { headers });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw { message: errorData.message || `HTTP error! status: ${response.status}`, status: response.status };
    }

    return response.json();
  },

  // POST request
  post: async (endpoint: string, data?: any) => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    };

    const response = await fetch(buildUrl(endpoint), {
      method: 'POST',
      headers,
      body: data ? JSON.stringify(data) : undefined
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw { message: errorData.message || `HTTP error! status: ${response.status}`, status: response.status };
    }

    return response.json();
  },

  // PUT request
  put: async (endpoint: string, data?: any) => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    };

    const response = await fetch(buildUrl(endpoint), {
      method: 'PUT',
      headers,
      body: data ? JSON.stringify(data) : undefined
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw { message: errorData.message || `HTTP error! status: ${response.status}`, status: response.status };
    }

    return response.json();
  },

  // DELETE request
  delete: async (endpoint: string) => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    };

    const response = await fetch(buildUrl(endpoint), {
      method: 'DELETE',
      headers
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw { message: errorData.message || `HTTP error! status: ${response.status}`, status: response.status };
    }

    return response.json();
  },

  // File upload (multipart/form-data)
  upload: async (endpoint: string, formData: FormData) => {
    const headers = getAuthHeaders(); // Do NOT set Content-Type manually

    const response = await fetch(buildUrl(endpoint), {
      method: 'POST',
      headers,
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw { message: errorData.message || `HTTP error! status: ${response.status}`, status: response.status };
    }

    return response.json();
  }
};