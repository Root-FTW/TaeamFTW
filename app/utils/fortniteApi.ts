// Fortnite API utility with rate limiting (3 requests per second)
//
// DATOS DISPONIBLES EN EL API:
// ✅ Wins, K/D, Win Rate, Kills, Deaths, Matches, Score, Battle Pass Level
// ❌ Global Rankings, Team Rankings, Seasonal Rankings
//
// Nota: Los rankings globales NO están disponibles en este API
const API_KEY = '3bb03286-20da-4033-9bdc-b70bbdb3399e';
const BASE_URL = 'https://fortnite-api.com/v2';

// Cache configuration
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes in milliseconds
const CACHE_CLEANUP_INTERVAL = 30 * 60 * 1000; // 30 minutes

// In-memory cache store
interface CacheEntry {
  data: any;
  timestamp: number;
  expiresAt: number;
}

class MemoryCache {
  private cache = new Map<string, CacheEntry>();
  private cleanupTimer: NodeJS.Timeout | null = null;

  constructor() {
    this.startCleanupTimer();
  }

  set(key: string, data: any, duration: number = CACHE_DURATION): void {
    const now = Date.now();
    const entry: CacheEntry = {
      data,
      timestamp: now,
      expiresAt: now + duration
    };

    this.cache.set(key, entry);
  }

  get(key: string): any | null {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }

  private startCleanupTimer(): void {
    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, CACHE_CLEANUP_INTERVAL);
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  stopCleanup(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
  }
}

// Global cache instance
const cache = new MemoryCache();

// Rate limiting queue - Updated to support 3 requests per second
class RateLimiter {
  private queue: Array<() => void> = [];
  private isProcessing = false;
  private requestTimes: number[] = [];
  private readonly maxRequestsPerSecond = 3;
  private readonly timeWindow = 1000; // 1 second window

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await fn();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
      this.processQueue();
    });
  }

  private async processQueue() {
    if (this.isProcessing || this.queue.length === 0) return;

    this.isProcessing = true;

    while (this.queue.length > 0) {
      const now = Date.now();

      // Clean up old request times outside the current window
      this.requestTimes = this.requestTimes.filter(time => now - time < this.timeWindow);

      // Check if we can make a request
      if (this.requestTimes.length >= this.maxRequestsPerSecond) {
        // Wait until the oldest request is outside the window
        const oldestRequest = this.requestTimes[0];
        const waitTime = this.timeWindow - (now - oldestRequest);
        await new Promise(resolve => setTimeout(resolve, waitTime + 10)); // +10ms buffer
        continue;
      }

      const task = this.queue.shift();
      if (task) {
        this.requestTimes.push(now);
        await task();
      }
    }

    this.isProcessing = false;
  }
}

const rateLimiter = new RateLimiter();

// Types for Fortnite API responses
export interface FortniteStats {
  account: {
    id: string;
    name: string;
  };
  battlePass: {
    level: number;
    progress: number;
  };
  image: string;
  stats: {
    all: {
      overall: {
        score: number;
        scorePerMin: number;
        scorePerMatch: number;
        wins: number;
        top3: number;
        top5: number;
        top6: number;
        top10: number;
        top12: number;
        top25: number;
        kills: number;
        killsPerMin: number;
        killsPerMatch: number;
        deaths: number;
        kd: number;
        matches: number;
        winRate: number;
        minutesPlayed: number;
        playersOutlived: number;
        lastModified: string;
      };
    };
  };
}

export interface ApiResponse<T> {
  status: number;
  data: T;
}

// Team member usernames
export const TEAM_MEMBERS = [
  'RootByte',
  'neto-_FTW',
  'Intercêptor',
  'FTW_SAITAMA',
  'Rey Bjorn FTW',
  'ValkyFTW'
];

// Cached version of getPlayerStats
export async function getPlayerStats(playerName: string): Promise<FortniteStats | null> {
  const cacheKey = `player_stats_${playerName}`;

  // Try to get from cache first
  const cachedData = cache.get(cacheKey);
  if (cachedData !== null) {
    console.log(`🎯 Cache HIT for ${playerName}`);
    return cachedData;
  }

  console.log(`⚡ Cache MISS for ${playerName} - fetching from API`);

  // If not in cache, fetch from API
  try {
    const response = await rateLimiter.execute(async () => {
      const url = `${BASE_URL}/stats/br/v2?name=${encodeURIComponent(playerName)}`;
      const response = await fetch(url, {
        headers: {
          'Authorization': API_KEY,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    });

    const apiResponse = response as ApiResponse<FortniteStats>;
    let result: FortniteStats | null = null;

    if (apiResponse.status === 200 && apiResponse.data) {
      result = apiResponse.data;
    }

    // Cache the result (even if null, to avoid repeated failed requests)
    cache.set(cacheKey, result);
    console.log(`💾 Cached result for ${playerName}`);

    return result;
  } catch (error) {
    console.error(`Error fetching stats for ${playerName}:`, error);

    // Cache null result for failed requests (shorter duration)
    cache.set(cacheKey, null, 2 * 60 * 1000); // 2 minutes for failed requests

    return null;
  }
}

// Cached version of getAllTeamStats - Optimized for 3 requests per second
export async function getAllTeamStats(): Promise<Record<string, FortniteStats | null>> {
  const cacheKey = 'all_team_stats';

  // Try to get from cache first
  const cachedData = cache.get(cacheKey);
  if (cachedData !== null) {
    console.log(`🎯 Cache HIT for all team stats`);
    return cachedData;
  }

  console.log(`⚡ Cache MISS for all team stats - fetching from API`);

  const stats: Record<string, FortniteStats | null> = {};

  // Process team members in batches of 3 to utilize full API capacity
  const promises = TEAM_MEMBERS.map(member =>
    getPlayerStats(member).then(result => ({ member, result }))
  );

  // Wait for all requests to complete
  const results = await Promise.all(promises);

  // Map results back to the stats object
  results.forEach(({ member, result }) => {
    stats[member] = result;
  });

  // Cache the complete team stats
  cache.set(cacheKey, stats);
  console.log(`💾 Cached all team stats`);

  return stats;
}

// Calculate team totals
export function calculateTeamTotals(teamStats: Record<string, FortniteStats | null>) {
  const totals = {
    totalWins: 0,
    totalKills: 0,
    totalMatches: 0,
    averageKD: 0,
    averageWinRate: 0,
    totalScore: 0,
    validPlayers: 0,
  };

  let kdSum = 0;
  let winRateSum = 0;

  Object.values(teamStats).forEach(stats => {
    if (stats?.stats?.all?.overall) {
      const overall = stats.stats.all.overall;
      totals.totalWins += overall.wins || 0;
      totals.totalKills += overall.kills || 0;
      totals.totalMatches += overall.matches || 0;
      totals.totalScore += overall.score || 0;

      if (overall.kd > 0) {
        kdSum += overall.kd;
        totals.validPlayers++;
      }

      if (overall.winRate > 0) {
        winRateSum += overall.winRate;
      }
    }
  });

  if (totals.validPlayers > 0) {
    totals.averageKD = kdSum / totals.validPlayers;
    totals.averageWinRate = winRateSum / totals.validPlayers;
  }

  return totals;
}

// Format numbers for display
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

// Format K/D ratio
export function formatKD(kd: number): string {
  return kd.toFixed(2);
}

// Format win rate as percentage
export function formatWinRate(winRate: number): string {
  return winRate.toFixed(1) + '%';
}

// Get estimated loading time with improved API rate
export function getEstimatedLoadTime(): string {
  const teamSize = TEAM_MEMBERS.length;
  const requestsPerSecond = 3;
  const estimatedSeconds = Math.ceil(teamSize / requestsPerSecond);
  return `~${estimatedSeconds}s`;
}

// Create a loading progress tracker
export class LoadingTracker {
  private totalItems: number;
  private loadedItems: number = 0;
  private onProgress?: (progress: number) => void;

  constructor(totalItems: number, onProgress?: (progress: number) => void) {
    this.totalItems = totalItems;
    this.onProgress = onProgress;
  }

  increment() {
    this.loadedItems++;
    const progress = (this.loadedItems / this.totalItems) * 100;
    this.onProgress?.(progress);
  }

  getProgress(): number {
    return (this.loadedItems / this.totalItems) * 100;
  }

  isComplete(): boolean {
    return this.loadedItems >= this.totalItems;
  }
}

// Get available data types from the API
export function getAvailableDataTypes() {
  return {
    available: [
      'Total Wins',
      'K/D Ratio',
      'Win Rate (%)',
      'Total Kills',
      'Total Deaths',
      'Matches Played',
      'Total Score',
      'Score per Match',
      'Score per Minute',
      'Battle Pass Level',
      'Top 3/5/10/25 Placements',
      'Minutes Played',
      'Players Outlived'
    ],
    notAvailable: [
      'Global Rankings',
      'Regional Rankings',
      'Seasonal Rankings',
      'Tournament Placements',
      'Clan/Team Rankings',
      'Skill Rating/MMR',
      'Recent Match History',
      'Live Match Status'
    ]
  };
}

// Cache management functions
export function getCacheStats() {
  return {
    size: cache.size(),
    duration: `${CACHE_DURATION / 1000 / 60} minutes`,
    cleanupInterval: `${CACHE_CLEANUP_INTERVAL / 1000 / 60} minutes`
  };
}

export function clearCache() {
  cache.clear();
  console.log('🧹 Cache cleared manually');
}

export function getCacheInfo() {
  const stats = getCacheStats();
  console.log('📊 Cache Info:', stats);
  return stats;
}

// Force refresh a specific player's stats
export async function refreshPlayerStats(playerName: string): Promise<FortniteStats | null> {
  const cacheKey = `player_stats_${playerName}`;

  // Remove from cache first
  cache.clear(); // Clear specific key would be better, but this works

  console.log(`🔄 Force refreshing stats for ${playerName}`);

  // Fetch fresh data
  return await getPlayerStats(playerName);
}

// Preload all team stats (useful for warming up cache)
export async function preloadTeamStats(): Promise<void> {
  console.log('🚀 Preloading team stats...');
  await getAllTeamStats();
  console.log('✅ Team stats preloaded');
}
