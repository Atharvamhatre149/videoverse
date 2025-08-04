import axios from 'axios';
import { useState, useEffect, useCallback, useRef } from 'react';
import useUserStore from '../store/useUserStore';

// Debug function for cookies
const logCookies = () => {
  console.log('All Cookies:', document.cookie);
};

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  timeout: 20000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add request interceptor to log cookies
apiClient.interceptors.request.use(
  config => {
    // Always ensure credentials are included
    config.withCredentials = true;
    
    console.log('Request URL:', config.url);
    console.log('Request withCredentials:', config.withCredentials);
    logCookies();
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add response interceptor to check cookie setting
apiClient.interceptors.response.use(
  response => {
    console.log('Response from:', response.config.url);
    console.log('Response headers:', response.headers);
    
    // Check for Set-Cookie header
    const setCookieHeader = response.headers['set-cookie'];
    if (setCookieHeader) {
      console.log('Set-Cookie header received');
    }
    
    logCookies();
    return response;
  },
  async error => {
    const originalRequest = error.config;
    const { clearUser, getUser } = useUserStore.getState();

    // Log error details
    console.error('API Error:', {
      url: originalRequest?.url,
      status: error.response?.status,
      statusText: error.response?.statusText
    });

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return apiClient(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      const skipRefreshFor = [
        '/users/refresh-token',
        '/users/login',
        '/users/logout'
      ];

      if (!skipRefreshFor.includes(originalRequest.url)) {
        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const refreshResponse = await apiClient.post('/users/refresh-token');
          processQueue(null);
          isRefreshing = false;
          return apiClient(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          isRefreshing = false;
          
          if (getUser()) {
            clearUser();
            window.dispatchEvent(new CustomEvent(AUTH_EVENTS.REFRESH_FAILED));
          }
          return Promise.reject(refreshError);
        }
      }
    }

    if (error.response?.status === 401 && 
        !['/users/refresh-token', '/users/login'].includes(originalRequest.url) && 
        getUser()) {
      clearUser();
      window.dispatchEvent(new CustomEvent(AUTH_EVENTS.UNAUTHORIZED));
    }

    return Promise.reject(error);
  }
);


const videoUploadConfig = {
  timeout: 10 * 60 * 1000 
};

// Create custom event for auth navigation
export const AUTH_EVENTS = {
  UNAUTHORIZED: 'auth:unauthorized',
  REFRESH_FAILED: 'auth:refresh_failed'
};

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};


// Basic HTTP methods
export const api = {
  get: (url, params = {}) => apiClient.get(url, { params }),
  post: (url, data, config = {}) => {
    // Apply video upload timeout for video upload endpoint
    if (url.includes('/videos/publish-video')) {
      config = { ...config, ...videoUploadConfig };
    }
    return apiClient.post(url, data, config);
  },
  put: (url, data) => apiClient.put(url, data),
  patch: (url, data) => apiClient.patch(url, data),
  delete: (url) => apiClient.delete(url),
};

// Hook for GET requests
export const useFetch = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const cancelTokenRef = useRef();

  const fetchData = useCallback(async () => {
    if (!url) return;

    // Cancel previous request
    if (cancelTokenRef.current) {
      cancelTokenRef.current.cancel('Request cancelled');
    }

    // Create new cancel token
    cancelTokenRef.current = axios.CancelToken.source();

    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get(url, {
        params: options.params,
        cancelToken: cancelTokenRef.current.token,
      });
      
      setData(response.data);
    } catch (err) {
      if (!axios.isCancel(err)) {
        setError(err);
      }
    } finally {
      setLoading(false);
    }
  }, [url, JSON.stringify(options)]);

  useEffect(() => {
    fetchData();
    
    return () => {
      if (cancelTokenRef.current) {
        cancelTokenRef.current.cancel('Component unmounted');
      }
    };
  }, [fetchData]);

  const refetch = () => fetchData();

  return { data, loading, error, refetch };
};  

// Hook for POST/PUT/PATCH/DELETE requests
export const useMutation = (method = 'post') => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const mutate = useCallback(async (url, payload) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api[method](url, payload);
      setData(response.data);

      return response.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [method]);

  const reset = () => {
    setData(null);
    setError(null);
    setLoading(false);
  };

  return { mutate, loading, error, data, reset };
};

// Specific hooks for different HTTP methods
export const usePost = () => useMutation('post');
export const usePut = () => useMutation('put');
export const usePatch = () => useMutation('patch');
export const useDelete = () => useMutation('delete');

// Infinite query hook specifically for videos
export const useInfiniteVideos = (baseUrl = '/videos', pageSize = 12) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const cancelTokenRef = useRef();

  const fetchVideos = useCallback(async (pageNum = 1, append = false) => {
    // Cancel previous request
    if (cancelTokenRef.current) {
      cancelTokenRef.current.cancel('Request cancelled');
    }

    // Create new cancel token
    cancelTokenRef.current = axios.CancelToken.source();

    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
        setVideos([]);
      }
      setError(null);

      const response = await api.get(baseUrl, {
        page: pageNum,
        cancelToken: cancelTokenRef.current.token,
      });

      // Handle your API response format
      const responseData = response.data.data || response.data;
    
      const newVideos = responseData.docs || responseData.videos || responseData.data || responseData;
      const totalPages = responseData.totalPages || Math.ceil((responseData.totalDocs || responseData.total || 0) / pageSize);
      const hasNextPage = responseData.hasNextPage;
      
      if (append) {
        setVideos(prev => [...prev, ...newVideos]);
      } else {
        setVideos(newVideos);
      }

      setHasMore(hasNextPage !== undefined ? hasNextPage : pageNum < totalPages);
      setPage(pageNum);
      
    } catch (err) {
      if (!axios.isCancel(err)) {
        setError(err);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [baseUrl, pageSize]);

  // Initial fetch
  useEffect(() => {
    fetchVideos(1, false);
    
    return () => {
      if (cancelTokenRef.current) {
        cancelTokenRef.current.cancel('Component unmounted');
      }
    };
  }, [fetchVideos]);

  // Load more videos
  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      fetchVideos(page + 1, true);
    }
  }, [fetchVideos, page, loadingMore, hasMore]);

  // Refresh all videos
  const refresh = useCallback(() => {
    fetchVideos(1, false);
  }, [fetchVideos]);

  return {
    videos,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMore,
    refresh,
  };
};

export default api; 