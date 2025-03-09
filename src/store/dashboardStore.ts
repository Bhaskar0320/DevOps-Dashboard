import { create } from 'zustand';
import { Pipeline, Metric, DeploymentStatus } from '../types';
import { mockWebSocket } from '../services/mockWebSocket';

interface DashboardState {
  pipeline: Pipeline | null;
  metrics: Metric[];
  deployments: DeploymentStatus[];
  isLoading: boolean;
  error: string | null;
  setPipeline: (pipeline: Pipeline) => void;
  addMetric: (metric: Metric) => void;
  setDeployments: (deployments: DeploymentStatus[]) => void;
  setError: (error: string | null) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  pipeline: null,
  metrics: [],
  deployments: [],
  isLoading: true,
  error: null,
  setPipeline: (pipeline) => set({ pipeline, isLoading: false }),
  addMetric: (metric) =>
    set((state) => ({
      metrics: [...state.metrics.slice(-23), metric],
      isLoading: false,
    })),
  setDeployments: (deployments) => set({ deployments, isLoading: false }),
  setError: (error) => set({ error, isLoading: false }),
}));

// Setup WebSocket subscriptions
mockWebSocket.subscribe<Pipeline>('pipeline', (pipeline) => {
  useDashboardStore.getState().setPipeline(pipeline);
});

mockWebSocket.subscribe<Metric>('metrics', (metric) => {
  useDashboardStore.getState().addMetric(metric);
});

mockWebSocket.subscribe<DeploymentStatus[]>('deployment', (deployments) => {
  useDashboardStore.getState().setDeployments(deployments);
});