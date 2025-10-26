// Performance monitoring utilities for the institutional trading dashboard

interface PerformanceMetrics {
  renderTime: number;
  memoryUsage: number;
  apiLatency: number;
  chartRenderTime: number;
  dataProcessingTime: number;
  timestamp: number;
}

interface PerformanceConfig {
  enableMonitoring: boolean;
  sampleRate: number; // 0-1, percentage of events to monitor
  maxMetrics: number; // Maximum number of metrics to store
  alertThresholds: {
    renderTime: number; // ms
    memoryUsage: number; // MB
    apiLatency: number; // ms
  };
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private config: PerformanceConfig;
  private observers: Map<string, PerformanceObserver> = new Map();

  constructor(config: Partial<PerformanceConfig> = {}) {
    this.config = {
      enableMonitoring: true,
      sampleRate: 0.1, // Monitor 10% of events
      maxMetrics: 1000,
      alertThresholds: {
        renderTime: 16, // 60fps threshold
        memoryUsage: 100, // 100MB threshold
        apiLatency: 1000 // 1 second threshold
      },
      ...config
    };

    if (this.config.enableMonitoring) {
      this.initializeObservers();
    }
  }

  private initializeObservers() {
    // Monitor long tasks
    if ('PerformanceObserver' in window) {
      try {
        const longTaskObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.duration > 50) { // Tasks longer than 50ms
              console.warn('Long task detected:', entry.duration, 'ms');
            }
          }
        });
        longTaskObserver.observe({ entryTypes: ['longtask'] });
        this.observers.set('longtask', longTaskObserver);
      } catch (error) {
        console.warn('Long task observer not supported:', error);
      }

      // Monitor memory usage
      try {
        const memoryObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'measure') {
              this.recordMetric({
                renderTime: entry.duration,
                memoryUsage: this.getMemoryUsage(),
                apiLatency: 0,
                chartRenderTime: 0,
                dataProcessingTime: 0,
                timestamp: Date.now()
              });
            }
          }
        });
        memoryObserver.observe({ entryTypes: ['measure'] });
        this.observers.set('measure', memoryObserver);
      } catch (error) {
        console.warn('Measure observer not supported:', error);
      }
    }
  }

  private getMemoryUsage(): number {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return memory.usedJSHeapSize / 1024 / 1024; // Convert to MB
    }
    return 0;
  }

  private shouldSample(): boolean {
    return Math.random() < this.config.sampleRate;
  }

  recordMetric(metric: Partial<PerformanceMetrics>) {
    if (!this.config.enableMonitoring || !this.shouldSample()) {
      return;
    }

    const fullMetric: PerformanceMetrics = {
      renderTime: 0,
      memoryUsage: this.getMemoryUsage(),
      apiLatency: 0,
      chartRenderTime: 0,
      dataProcessingTime: 0,
      timestamp: Date.now(),
      ...metric
    };

    this.metrics.push(fullMetric);

    // Keep only the most recent metrics
    if (this.metrics.length > this.config.maxMetrics) {
      this.metrics = this.metrics.slice(-this.config.maxMetrics);
    }

    // Check for performance alerts
    this.checkAlerts(fullMetric);
  }

  private checkAlerts(metric: PerformanceMetrics) {
    const { alertThresholds } = this.config;

    if (metric.renderTime > alertThresholds.renderTime) {
      console.warn(`Slow render detected: ${metric.renderTime}ms`);
    }

    if (metric.memoryUsage > alertThresholds.memoryUsage) {
      console.warn(`High memory usage: ${metric.memoryUsage.toFixed(2)}MB`);
    }

    if (metric.apiLatency > alertThresholds.apiLatency) {
      console.warn(`Slow API response: ${metric.apiLatency}ms`);
    }
  }

  // Measure function execution time
  measureFunction<T>(name: string, fn: () => T): T {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    
    this.recordMetric({
      renderTime: end - start,
      dataProcessingTime: end - start
    });

    return result;
  }

  // Measure async function execution time
  async measureAsyncFunction<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const start = performance.now();
    const result = await fn();
    const end = performance.now();
    
    this.recordMetric({
      renderTime: end - start,
      dataProcessingTime: end - start
    });

    return result;
  }

  // Measure API call latency
  measureApiCall<T>(apiCall: () => Promise<T>): Promise<T> {
    const start = performance.now();
    return apiCall().then(result => {
      const end = performance.now();
      this.recordMetric({
        apiLatency: end - start
      });
      return result;
    });
  }

  // Get performance summary
  getPerformanceSummary(): {
    averageRenderTime: number;
    averageMemoryUsage: number;
    averageApiLatency: number;
    totalMetrics: number;
    performanceScore: number;
  } {
    if (this.metrics.length === 0) {
      return {
        averageRenderTime: 0,
        averageMemoryUsage: 0,
        averageApiLatency: 0,
        totalMetrics: 0,
        performanceScore: 100
      };
    }

    const avgRenderTime = this.metrics.reduce((sum, m) => sum + m.renderTime, 0) / this.metrics.length;
    const avgMemoryUsage = this.metrics.reduce((sum, m) => sum + m.memoryUsage, 0) / this.metrics.length;
    const avgApiLatency = this.metrics.reduce((sum, m) => sum + m.apiLatency, 0) / this.metrics.length;

    // Calculate performance score (0-100)
    const renderScore = Math.max(0, 100 - (avgRenderTime / 16) * 100); // 16ms = 60fps
    const memoryScore = Math.max(0, 100 - (avgMemoryUsage / 100) * 100); // 100MB threshold
    const apiScore = Math.max(0, 100 - (avgApiLatency / 1000) * 100); // 1s threshold
    
    const performanceScore = (renderScore + memoryScore + apiScore) / 3;

    return {
      averageRenderTime: avgRenderTime,
      averageMemoryUsage: avgMemoryUsage,
      averageApiLatency: avgApiLatency,
      totalMetrics: this.metrics.length,
      performanceScore: Math.round(performanceScore)
    };
  }

  // Get recent metrics
  getRecentMetrics(count: number = 100): PerformanceMetrics[] {
    return this.metrics.slice(-count);
  }

  // Clear metrics
  clearMetrics() {
    this.metrics = [];
  }

  // Update configuration
  updateConfig(newConfig: Partial<PerformanceConfig>) {
    this.config = { ...this.config, ...newConfig };
  }

  // Cleanup
  destroy() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
    this.metrics = [];
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor({
  enableMonitoring: process.env.NODE_ENV === 'development' || process.env.REACT_APP_ENABLE_PERFORMANCE_MONITORING === 'true',
  sampleRate: 0.1,
  maxMetrics: 1000
});

// React hook for performance monitoring
export const usePerformanceMonitor = () => {
  const measureRender = (componentName: string, renderFn: () => void) => {
    performance.mark(`${componentName}-render-start`);
    renderFn();
    performance.mark(`${componentName}-render-end`);
    performance.measure(
      `${componentName}-render`,
      `${componentName}-render-start`,
      `${componentName}-render-end`
    );
  };

  const measureAsync = async (name: string, asyncFn: () => Promise<any>) => {
    return performanceMonitor.measureAsyncFunction(name, asyncFn);
  };

  const measureSync = (name: string, syncFn: () => any) => {
    return performanceMonitor.measureFunction(name, syncFn);
  };

  return {
    measureRender,
    measureAsync,
    measureSync,
    getSummary: () => performanceMonitor.getPerformanceSummary(),
    getMetrics: (count?: number) => performanceMonitor.getRecentMetrics(count)
  };
};

// Chart performance utilities
export const chartPerformanceUtils = {
  measureChartRender: (chartName: string, renderFn: () => void) => {
    const start = performance.now();
    renderFn();
    const end = performance.now();
    
    performanceMonitor.recordMetric({
      chartRenderTime: end - start
    });
  },

  measureDataProcessing: (dataName: string, processFn: () => void) => {
    const start = performance.now();
    processFn();
    const end = performance.now();
    
    performanceMonitor.recordMetric({
      dataProcessingTime: end - start
    });
  }
};

// API performance utilities
export const apiPerformanceUtils = {
  measureApiCall: <T>(apiCall: () => Promise<T>): Promise<T> => {
    return performanceMonitor.measureApiCall(apiCall);
  },

  measureBatchApiCalls: async <T>(apiCalls: (() => Promise<T>)[]): Promise<T[]> => {
    const start = performance.now();
    const results = await Promise.all(apiCalls.map(call => performanceMonitor.measureApiCall(call)));
    const end = performance.now();
    
    performanceMonitor.recordMetric({
      apiLatency: end - start
    });
    
    return results;
  }
};

// Memory management utilities
export const memoryUtils = {
  getMemoryUsage: () => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return {
        used: memory.usedJSHeapSize / 1024 / 1024, // MB
        total: memory.totalJSHeapSize / 1024 / 1024, // MB
        limit: memory.jsHeapSizeLimit / 1024 / 1024 // MB
      };
    }
    return null;
  },

  checkMemoryPressure: () => {
    const memory = memoryUtils.getMemoryUsage();
    if (memory) {
      const usagePercent = (memory.used / memory.limit) * 100;
      if (usagePercent > 80) {
        console.warn('High memory usage detected:', usagePercent.toFixed(2) + '%');
        return true;
      }
    }
    return false;
  },

  forceGarbageCollection: () => {
    if ('gc' in window) {
      (window as any).gc();
    }
  }
};

export default performanceMonitor;
