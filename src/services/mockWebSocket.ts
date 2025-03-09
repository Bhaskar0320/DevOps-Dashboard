import { Pipeline, Metric, DeploymentStatus } from '../types';

type Listener<T> = (data: T) => void;
type MessageType = 'pipeline' | 'metrics' | 'deployment';

class MockWebSocket {
  private listeners: Map<MessageType, Listener<any>[]> = new Map();
  private intervals: Map<MessageType, NodeJS.Timeout> = new Map();

  constructor() {
    this.setupMockConnections();
  }

  private setupMockConnections() {
    // Pipeline updates every 5 seconds
    this.createMockInterval('pipeline', 5000, () => ({
      id: '1',
      name: 'Main Pipeline',
      status: ['running', 'success', 'failed'][Math.floor(Math.random() * 3)] as const,
      startTime: new Date(Date.now() - 1000 * 60 * Math.floor(Math.random() * 30)),
      duration: 600,
      stages: [
        { name: 'Build', status: 'success' as const, duration: 120 },
        { name: 'Test', status: Math.random() > 0.5 ? 'success' : 'running' as const, duration: 180 },
        { name: 'Deploy', status: Math.random() > 0.7 ? 'success' : 'running' as const, duration: 300 },
      ],
    }));

    // Metrics updates every second
    this.createMockInterval('metrics', 1000, () => ({
      timestamp: new Date(),
      value: Math.floor(Math.random() * 100),
      label: 'CPU Usage',
    }));

    // Deployment status updates every 10 seconds
    this.createMockInterval('deployment', 10000, () => [
      {
        environment: 'Production',
        status: Math.random() > 0.9 ? 'degraded' : 'healthy' as const,
        lastDeployment: new Date(Date.now() - 1000 * 60 * 60 * 2),
        version: 'v1.2.3',
      },
      {
        environment: 'Staging',
        status: Math.random() > 0.7 ? 'degraded' : 'healthy' as const,
        lastDeployment: new Date(Date.now() - 1000 * 60 * 30),
        version: 'v1.2.4-rc1',
      },
    ]);
  }

  private createMockInterval(type: MessageType, interval: number, generateData: () => any) {
    const timer = setInterval(() => {
      this.emit(type, generateData());
    }, interval);
    this.intervals.set(type, timer);
  }

  subscribe<T>(type: MessageType, callback: Listener<T>) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, []);
    }
    this.listeners.get(type)!.push(callback);

    return () => {
      const typeListeners = this.listeners.get(type)!;
      const index = typeListeners.indexOf(callback);
      if (index > -1) {
        typeListeners.splice(index, 1);
      }
    };
  }

  private emit(type: MessageType, data: any) {
    const typeListeners = this.listeners.get(type);
    if (typeListeners) {
      typeListeners.forEach(listener => listener(data));
    }
  }

  cleanup() {
    this.intervals.forEach(interval => clearInterval(interval));
    this.intervals.clear();
    this.listeners.clear();
  }
}

export const mockWebSocket = new MockWebSocket();