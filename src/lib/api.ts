// API utility functions for consistent backend communication

// Use only NEXT_PUBLIC_API_URL in your frontend
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const buildUrl = (endpoint: string) => {
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : "/" + endpoint;
  const prefix = cleanEndpoint.startsWith("/auth") ? "" : "/api";
  return `${API_BASE.replace(/\/$/, "")}${prefix}${cleanEndpoint}`;
};



// Get authentication headers (if token exists)
const getAuthHeaders = (): Record<string, string> => {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const api = {
  // GET request
  get: async (endpoint: string) => {
    const response = await fetch(buildUrl(endpoint), {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}`);
    }

    return response.json();
  },

  // POST request
  post: async (endpoint: string, data?: any) => {
    const response = await fetch(buildUrl(endpoint), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}`);
    }

    return response.json();
  },

  // PUT request
  put: async (endpoint: string, data?: any) => {
    const response = await fetch(buildUrl(endpoint), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}`);
    }

    return response.json();
  },

  // DELETE request
  delete: async (endpoint: string) => {
    const response = await fetch(buildUrl(endpoint), {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}`);
    }

    return response.json();
  },

  // File upload
  upload: async (endpoint: string, formData: FormData) => {
    const response = await fetch(buildUrl(endpoint), {
      method: "POST",
      headers: {
        ...getAuthHeaders(), // no content type
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}`);
    }

    return response.json();
  },
};
