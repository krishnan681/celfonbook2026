// src/core/services/cacheService.js

const CACHE_PREFIX = "celfon_cache_";
const DEFAULT_TTL_MS = 1000 * 60 * 15; // 15 minutes default

export const cacheService = {
  /**
   * Save item to local storage cache with TTL
   */
  set(key, data, ttlMs = DEFAULT_TTL_MS) {
    try {
      const record = {
        data,
        expiry: Date.now() + ttlMs,
        timestamp: Date.now(),
      };
      localStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify(record));
    } catch (err) {
      console.warn("Cache storage failed:", err);
    }
  },

  /**
   * Retrieve item from cache if not expired
   */
  get(key) {
    try {
      const item = localStorage.getItem(`${CACHE_PREFIX}${key}`);
      if (!item) return null;

      const record = JSON.parse(item);
      if (Date.now() > record.expiry) {
        localStorage.removeItem(`${CACHE_PREFIX}${key}`);
        return null;
      }
      return record.data;
    } catch (err) {
      console.warn("Cache retrieval failed:", err);
      return null;
    }
  },

  /**
   * Remove specific item from cache
   */
  remove(key) {
    try {
      localStorage.removeItem(`${CACHE_PREFIX}${key}`);
    } catch (err) {
      console.warn("Cache remove failed:", err);
    }
  },

  /**
   * Clear all items with prefix
   */
  clearPrefix(prefix = "") {
    try {
      const targetPrefix = `${CACHE_PREFIX}${prefix}`;
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(targetPrefix)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
    } catch (err) {
      console.warn("Cache clearPrefix failed:", err);
    }
  },
};
