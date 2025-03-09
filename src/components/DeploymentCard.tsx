import React from 'react';
import { Server, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { DeploymentStatus } from '../types';
import { formatDistanceToNow } from 'date-fns';

interface DeploymentCardProps {
  deployment: DeploymentStatus;
}

export function DeploymentCard({ deployment }: DeploymentCardProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'degraded':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <Server className="w-5 h-5 text-gray-500 mr-2" />
          <h3 className="text-lg font-semibold">{deployment.environment}</h3>
        </div>
        {getStatusIcon(deployment.status)}
      </div>
      <div className="text-sm text-gray-600">
        <p>Version: {deployment.version}</p>
        <p>Last deployed: {formatDistanceToNow(deployment.lastDeployment)} ago</p>
      </div>
    </div>
  );
}