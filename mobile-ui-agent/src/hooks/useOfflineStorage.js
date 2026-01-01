import { useState, useEffect, useCallback } from 'react';

const DB_NAME = 'hsc-learning-offline';
const DB_VERSION = 1;
const STORES = {
  QUIZ_DATA: 'quiz_data',
  USER_PROGRESS: 'user_progress',
  CACHED_RESPONSES: 'cached_responses',
  PENDING_REQUESTS: 'pending_requests'
};

export const useOfflineStorage = () => {
  const [db, setDb] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);

  // Initialize IndexedDB
  useEffect(() => {
    const initDB = async () => {
      try {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => {
          setError('Failed to open database');
        };

        request.onsuccess = (event) => {
          const database = event.target.result;
          setDb(database);
          setIsReady(true);
        };

        request.onupgradeneeded = (event) => {
          const database = event.target.result;

          // Create object stores
          Object.values(STORES).forEach(storeName => {
            if (!database.objectStoreNames.contains(storeName)) {
              const store = database.createObjectStore(storeName, { 
                keyPath: 'id',
                autoIncrement: true 
              });
              
              // Add indexes for common queries
              if (storeName === STORES.QUIZ_DATA) {
                store.createIndex('subject', 'subject', { unique: false });
                store.createIndex('module', 'module', { unique: false });
              }
              
              if (storeName === STORES.USER_PROGRESS) {
                store.createIndex('userId', 'userId', { unique: false });
                store.createIndex('timestamp', 'timestamp', { unique: false });
              }
              
              if (storeName === STORES.CACHED_RESPONSES) {
                store.createIndex('url', 'url', { unique: false });
                store.createIndex('timestamp', 'timestamp', { unique: false });
              }
              
              if (storeName === STORES.PENDING_REQUESTS) {
                store.createIndex('priority', 'priority', { unique: false });
                store.createIndex('timestamp', 'timestamp', { unique: false });
              }
            }
          });
        };
      } catch (err) {
        setError(err.message);
      }
    };

    initDB();
  }, []);

  // Generic function to add data to a store
  const addData = useCallback(async (storeName, data) => {
    if (!db) {
      throw new Error('Database not ready');
    }

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      
      const dataWithTimestamp = {
        ...data,
        timestamp: Date.now()
      };
      
      const request = store.add(dataWithTimestamp);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }, [db]);

  // Generic function to get data from a store
  const getData = useCallback(async (storeName, key) => {
    if (!db) {
      throw new Error('Database not ready');
    }

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(key);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }, [db]);

  // Generic function to get all data from a store
  const getAllData = useCallback(async (storeName, indexName = null, indexValue = null) => {
    if (!db) {
      throw new Error('Database not ready');
    }

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      
      let request;
      if (indexName && indexValue) {
        const index = store.index(indexName);
        request = index.getAll(indexValue);
      } else {
        request = store.getAll();
      }
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }, [db]);

  // Generic function to update data in a store
  const updateData = useCallback(async (storeName, data) => {
    if (!db) {
      throw new Error('Database not ready');
    }

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      
      const dataWithTimestamp = {
        ...data,
        updatedAt: Date.now()
      };
      
      const request = store.put(dataWithTimestamp);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }, [db]);

  // Generic function to delete data from a store
  const deleteData = useCallback(async (storeName, key) => {
    if (!db) {
      throw new Error('Database not ready');
    }

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(key);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }, [db]);

  // Clear old cached data
  const clearOldData = useCallback(async (storeName, maxAge = 7 * 24 * 60 * 60 * 1000) => {
    if (!db) {
      throw new Error('Database not ready');
    }

    const cutoffTime = Date.now() - maxAge;
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const index = store.index('timestamp');
      const range = IDBKeyRange.upperBound(cutoffTime);
      
      const request = index.openCursor(range);
      
      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        } else {
          resolve();
        }
      };
      
      request.onerror = () => reject(request.error);
    });
  }, [db]);

  // Quiz-specific functions
  const cacheQuizData = useCallback(async (quizData) => {
    return addData(STORES.QUIZ_DATA, quizData);
  }, [addData]);

  const getCachedQuizData = useCallback(async (subject, module) => {
    return getAllData(STORES.QUIZ_DATA, 'subject', subject);
  }, [getAllData]);

  // User progress functions
  const saveUserProgress = useCallback(async (progressData) => {
    return addData(STORES.USER_PROGRESS, progressData);
  }, [addData]);

  const getUserProgress = useCallback(async (userId) => {
    return getAllData(STORES.USER_PROGRESS, 'userId', userId);
  }, [getAllData]);

  // API response caching
  const cacheResponse = useCallback(async (url, responseData) => {
    return addData(STORES.CACHED_RESPONSES, {
      url,
      data: responseData
    });
  }, [addData]);

  const getCachedResponse = useCallback(async (url) => {
    const responses = await getAllData(STORES.CACHED_RESPONSES, 'url', url);
    return responses.length > 0 ? responses[0] : null;
  }, [getAllData]);

  // Pending requests for sync when online
  const addPendingRequest = useCallback(async (requestData) => {
    return addData(STORES.PENDING_REQUESTS, {
      ...requestData,
      priority: requestData.priority || 1
    });
  }, [addData]);

  const getPendingRequests = useCallback(async () => {
    return getAllData(STORES.PENDING_REQUESTS);
  }, [getAllData]);

  const removePendingRequest = useCallback(async (requestId) => {
    return deleteData(STORES.PENDING_REQUESTS, requestId);
  }, [deleteData]);

  // Storage size management
  const getStorageSize = useCallback(async () => {
    if (!navigator.storage || !navigator.storage.estimate) {
      return null;
    }

    const estimate = await navigator.storage.estimate();
    return {
      quota: estimate.quota,
      usage: estimate.usage,
      percentUsed: (estimate.usage / estimate.quota) * 100
    };
  }, []);

  // Clear all offline data
  const clearAllData = useCallback(async () => {
    if (!db) {
      throw new Error('Database not ready');
    }

    const promises = Object.values(STORES).map(storeName => {
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.clear();
        
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    });

    return Promise.all(promises);
  }, [db]);

  return {
    // State
    isReady,
    error,
    
    // Generic operations
    addData,
    getData,
    getAllData,
    updateData,
    deleteData,
    clearOldData,
    
    // Quiz-specific
    cacheQuizData,
    getCachedQuizData,
    
    // User progress
    saveUserProgress,
    getUserProgress,
    
    // API caching
    cacheResponse,
    getCachedResponse,
    
    // Sync functionality
    addPendingRequest,
    getPendingRequests,
    removePendingRequest,
    
    // Storage management
    getStorageSize,
    clearAllData
  };
};