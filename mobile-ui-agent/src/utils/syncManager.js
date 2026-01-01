import { useEffect, useState } from 'react';
import { useOfflineStorage } from '../hooks/useOfflineStorage';
import { progressAPI } from './progressAPI.js';

const PROGRESS_SYNC_QUEUE_KEY = 'progress_sync_queue';
const RETRY_DELAYS = [1000, 2000, 4000, 8000, 16000, 32000]; // Exponential backoff in ms

let offlineStorageClient = null;
let syncManagerInstance = null;

const registerOfflineStorageClient = (client) => {
  offlineStorageClient = client;
  if (client && syncManagerInstance?.flushInMemoryPendingRequests) {
    syncManagerInstance.flushInMemoryPendingRequests();
  }
};

const getOfflineStorageClient = () => offlineStorageClient;

const getOfflineStorageOrWarn = () => {
  const client = getOfflineStorageClient();
  if (!client) {
    console.warn('[SyncManager] Offline storage client not ready. Operation will be skipped.');
  }
  return client;
};

class SyncManager {
  constructor() {
    this.isOnline = navigator.onLine;
    this.syncInProgress = false;
    this.retryAttempts = new Map();
    this.maxRetries = 6;
    this.retryDelay = 1000; // Start with 1 second
    this.progressQueue = this.loadProgressQueue();
    this.inMemoryPendingRequests = [];
    
    // Listen for online/offline events
    window.addEventListener('online', this.handleOnline.bind(this));
    window.addEventListener('offline', this.handleOffline.bind(this));
  }

  // Load progress sync queue from localStorage
  loadProgressQueue() {
    try {
      const stored = localStorage.getItem(PROGRESS_SYNC_QUEUE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading progress sync queue:', error);
      return [];
    }
  }

  // Save progress queue to localStorage
  saveProgressQueue() {
    try {
      localStorage.setItem(PROGRESS_SYNC_QUEUE_KEY, JSON.stringify(this.progressQueue));
    } catch (error) {
      console.error('Error saving progress sync queue:', error);
    }
  }

  // Add progress operation to sync queue
  addProgressToQueue(operation) {
    const queueItem = {
      id: Date.now() + Math.random(),
      timestamp: Date.now(),
      retryCount: 0,
      operation,
      priority: operation.priority || 1,
      type: 'progress'
    };

    this.progressQueue.push(queueItem);
    this.progressQueue.sort((a, b) => b.priority - a.priority); // Sort by priority desc
    this.saveProgressQueue();

    // Try to process immediately if online
    if (this.isOnline) {
      this.syncProgressQueue();
    }

    return queueItem.id;
  }

  // Process progress sync queue
  async syncProgressQueue() {
    if (this.syncInProgress || !this.isOnline || this.progressQueue.length === 0) {
      return;
    }

    this.syncInProgress = true;

    try {
      // Check if backend is available
      const healthCheck = await progressAPI.checkSyncHealth();
      if (!healthCheck.available) {
        console.log('Progress API not available, skipping sync');
        return;
      }

      // Process items by priority
      const itemsToProcess = [...this.progressQueue];
      
      for (const item of itemsToProcess) {
        try {
          await this.processProgressItem(item);
          this.removeFromProgressQueue(item.id);
        } catch (error) {
          await this.handleFailedProgressSync(item, error);
        }
      }
    } catch (error) {
      console.error('Error processing progress sync queue:', error);
    } finally {
      this.syncInProgress = false;
    }
  }

  // Process a single progress queue item
  async processProgressItem(item) {
    const { operation } = item;
    
    switch (operation.action) {
      case 'SAVE_PROGRESS':
        return await progressAPI.saveProgress(operation.data);
      
      case 'QUIZ_COMPLETION':
        return await progressAPI.saveQuizCompletion(operation.data);
      
      case 'UPDATE_DAILY_GOAL':
        return await progressAPI.updateDailyGoal(operation.data.goal);
      
      case 'RESET_SUBJECT':
        return await progressAPI.resetSubjectProgress(operation.data.subjectId);
      
      case 'BULK_SYNC':
        return await progressAPI.bulkSync(operation.data);
      
      default:
        throw new Error(`Unknown progress operation: ${operation.action}`);
    }
  }

  // Handle failed progress sync with exponential backoff
  async handleFailedProgressSync(item, error) {
    item.retryCount++;
    item.lastError = error.message;
    item.lastRetryAt = Date.now();

    if (item.retryCount >= this.maxRetries) {
      console.error(`Max retries exceeded for progress sync item ${item.id}:`, error);
      this.removeFromProgressQueue(item.id);
      return;
    }

    // Calculate delay with exponential backoff
    const delayIndex = Math.min(item.retryCount - 1, RETRY_DELAYS.length - 1);
    const delay = RETRY_DELAYS[delayIndex];

    console.log(`Retrying progress sync item ${item.id} in ${delay}ms (attempt ${item.retryCount}/${this.maxRetries})`);

    // Schedule retry
    setTimeout(() => {
      this.syncProgressQueue();
    }, delay);

    this.saveProgressQueue();
  }

  // Remove operation from progress queue
  removeFromProgressQueue(id) {
    this.progressQueue = this.progressQueue.filter(item => item.id !== id);
    this.saveProgressQueue();
  }

  // Get progress queue status
  getProgressQueueStatus() {
    return {
      itemCount: this.progressQueue.length,
      oldestItem: this.progressQueue.length > 0 ? Math.min(...this.progressQueue.map(item => item.timestamp)) : null,
      failedItems: this.progressQueue.filter(item => item.retryCount > 0).length
    };
  }

  async flushInMemoryPendingRequests() {
    if (this.inMemoryPendingRequests.length === 0) {
      return;
    }

    const offlineStorage = getOfflineStorageClient();
    if (!offlineStorage?.addPendingRequest) {
      return;
    }

    const pending = [...this.inMemoryPendingRequests];
    this.inMemoryPendingRequests = [];

    await Promise.all(
      pending.map((request) => offlineStorage.addPendingRequest(request))
    );
  }

  handleOnline() {
    this.isOnline = true;
    console.log('Back online - starting sync...');
    this.flushInMemoryPendingRequests();
    this.syncPendingRequests();
    this.syncProgressQueue();
  }

  handleOffline() {
    this.isOnline = false;
    console.log('Gone offline - queuing requests...');
  }

  async syncPendingRequests() {
    if (this.syncInProgress || !this.isOnline) {
      return;
    }

    this.syncInProgress = true;
    
    try {
      const offlineStorage = getOfflineStorageOrWarn();
      let pendingRequests = [];

      if (offlineStorage?.getPendingRequests) {
        await this.flushInMemoryPendingRequests();
        pendingRequests = await offlineStorage.getPendingRequests();
      } else {
        pendingRequests = [...this.inMemoryPendingRequests];
        this.inMemoryPendingRequests = [];
      }

      if (pendingRequests.length === 0) {
        console.log('No pending requests to sync');
        return;
      }

      console.log(`Syncing ${pendingRequests.length} pending requests...`);
      
      // Sort by priority and timestamp
      pendingRequests.sort((a, b) => {
        if (a.priority !== b.priority) {
          return b.priority - a.priority; // Higher priority first
        }
        return a.timestamp - b.timestamp; // Older first
      });

      const results = await Promise.allSettled(
        pendingRequests.map(request => this.processRequest(request))
      );

      const successful = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;
      
      console.log(`Sync completed: ${successful} successful, ${failed} failed`);
      
      // Trigger success event for UI updates
      window.dispatchEvent(new CustomEvent('syncCompleted', {
        detail: { successful, failed, total: pendingRequests.length }
      }));
      
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      this.syncInProgress = false;
    }
  }

  async processRequest(request) {
    const { id, clientId, url, method, headers, body, retryCount = 0 } = request;
    const requestKey = id ?? clientId ?? (request.clientId = `${Date.now()}-${Math.random()}`);
    const offlineStorage = getOfflineStorageClient();
    
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: body ? JSON.stringify(body) : undefined
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Remove successful request from pending queue
      if (offlineStorage?.removePendingRequest && id) {
        await offlineStorage.removePendingRequest(id);
      }
      
      // Cache the response if it's a GET request
      if (method === 'GET' && offlineStorage?.cacheResponse) {
        await offlineStorage.cacheResponse(url, data);
      }
      
      console.log(`Successfully synced request ${requestKey}: ${method} ${url}`);
      return data;
      
    } catch (error) {
      console.error(`Failed to sync request ${requestKey}:`, error);
      
      const currentRetries = this.retryAttempts.get(requestKey) || 0;
      
      if (currentRetries < this.maxRetries) {
        // Schedule retry with exponential backoff
        const delay = this.retryDelay * Math.pow(2, currentRetries);
        this.retryAttempts.set(requestKey, currentRetries + 1);
        
        setTimeout(() => {
          this.processRequest(request);
        }, delay);
        
        console.log(`Retrying request ${requestKey} in ${delay}ms (attempt ${currentRetries + 1}/${this.maxRetries})`);
      } else {
        // Max retries reached, remove from queue and log error
        if (offlineStorage?.removePendingRequest && id) {
          await offlineStorage.removePendingRequest(id);
        }
        this.retryAttempts.delete(requestKey);
        console.error(`Max retries reached for request ${requestKey}, removing from queue`);
      }
      
      throw error;
    }
  }

  async queueRequest(url, options = {}) {
    const offlineStorage = getOfflineStorageClient();
    
    const request = {
      clientId: `${Date.now()}-${Math.random()}`,
      url,
      method: options.method || 'GET',
      headers: options.headers || {},
      body: options.body,
      priority: options.priority || 1,
      timestamp: Date.now()
    };

    const persistRequest = async () => {
      if (offlineStorage?.addPendingRequest) {
        const { clientId, ...payload } = request;
        await offlineStorage.addPendingRequest(payload);
      } else {
        this.inMemoryPendingRequests.push({ ...request });
      }
    };
    
    if (this.isOnline) {
      try {
        // Try to execute immediately if online
        return await this.processRequest(request);
      } catch (error) {
        // If immediate execution fails, queue for later
        await persistRequest();
        throw error;
      }
    }

    // Queue for when online
    await persistRequest();
    console.log('Request queued for when online:', url);
    return null;
  }

  async clearPendingRequests() {
    const offlineStorage = getOfflineStorageClient();
    if (offlineStorage?.getPendingRequests) {
      const pendingRequests = await offlineStorage.getPendingRequests();
      
      await Promise.all(
        pendingRequests.map(request => 
          request.id && offlineStorage.removePendingRequest
            ? offlineStorage.removePendingRequest(request.id)
            : Promise.resolve()
        )
      );
    }

    this.inMemoryPendingRequests = [];
    this.retryAttempts.clear();
    console.log('Cleared all pending requests');
  }

  getStatus() {
    return {
      isOnline: this.isOnline,
      syncInProgress: this.syncInProgress,
      pendingRetries: this.retryAttempts.size,
      progressQueue: this.getProgressQueueStatus(),
      inMemoryQueue: this.inMemoryPendingRequests.length
    };
  }
}

// Create singleton instance
const syncManager = new SyncManager();
syncManagerInstance = syncManager;

// Enhanced fetch function that works offline
export const offlineFetch = async (url, options = {}) => {
  const offlineStorage = getOfflineStorageClient();
  
  try {
    if (navigator.onLine) {
      // Online: try normal fetch
      const response = await fetch(url, options);
      
      if (response.ok && options.method === 'GET') {
        // Cache successful GET responses
        const data = await response.json();
        if (offlineStorage?.cacheResponse) {
          await offlineStorage.cacheResponse(url, data);
        }
        return { data, fromCache: false };
      }
      
      return { data: await response.json(), fromCache: false };
    } else {
      throw new Error('Offline');
    }
  } catch (error) {
    // Offline or fetch failed: try cache for GET requests
    if ((options.method === 'GET' || !options.method) && offlineStorage?.getCachedResponse) {
      const cached = await offlineStorage.getCachedResponse(url);
      if (cached) {
        console.log('Serving from cache:', url);
        return { data: cached.data, fromCache: true };
      }
    }
    
    // For non-GET requests or when no cache available, queue for sync
    if (options.method && options.method !== 'GET') {
      await syncManager.queueRequest(url, options);
    }
    
    throw new Error(`Failed to fetch ${url}: ${error.message}`);
  }
};

// Hook to use sync manager in React components
export const useSyncManager = () => {
  const offlineStorage = useOfflineStorage();
  const [status, setStatus] = useState(syncManager.getStatus());
  
  useEffect(() => {
    registerOfflineStorageClient(offlineStorage);

    return () => {
      if (getOfflineStorageClient() === offlineStorage) {
        registerOfflineStorageClient(null);
      }
    };
  }, [offlineStorage]);

  useEffect(() => {
    const updateStatus = () => setStatus(syncManager.getStatus());
    
    const handleSyncCompleted = (event) => {
      updateStatus();
      // You can add UI notifications here
    };
    
    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);
    window.addEventListener('syncCompleted', handleSyncCompleted);
    
    return () => {
      window.removeEventListener('online', updateStatus);
      window.removeEventListener('offline', updateStatus);
      window.removeEventListener('syncCompleted', handleSyncCompleted);
    };
  }, []);
  
  return {
    ...status,
    syncNow: () => syncManager.syncPendingRequests(),
    clearQueue: () => syncManager.clearPendingRequests(),
    queueRequest: (url, options) => syncManager.queueRequest(url, options)
  };
};

export default syncManager;
