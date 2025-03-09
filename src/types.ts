export interface Pipeline {
  id: string;
  name: string;
  status: 'running' | 'success' | 'failed';
  stages: Stage[];
  startTime: Date;
  duration: number;
}

export interface Stage {
  name: string;
  status: 'pending' | 'running' | 'success' | 'failed';
  duration: number;
}

export interface Metric {
  timestamp: Date;
  value: number;
  label: string;
}

export interface DeploymentStatus {
  environment: string;
  status: 'healthy' | 'degraded' | 'failed';
  lastDeployment: Date;
  version: string;
}