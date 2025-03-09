import React from 'react';
import { Activity, CheckCircle2, XCircle } from 'lucide-react';
import { Pipeline } from '../types';
import { formatDistanceToNow } from 'date-fns';

interface PipelineStatusProps {
  pipeline: Pipeline;
}

export function PipelineStatus({ pipeline }: PipelineStatusProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <Activity className="w-5 h-5 text-blue-500" />;
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          {getStatusIcon(pipeline.status)}
          <h3 className="ml-2 text-lg font-semibold">{pipeline.name}</h3>
        </div>
        <span className="text-sm text-gray-500">
          Started {formatDistanceToNow(pipeline.startTime)} ago
        </span>
      </div>
      
      <div className="space-y-2">
        {pipeline.stages.map((stage, index) => (
          <div key={index} className="flex items-center">
            <div className="w-24 text-sm text-gray-600">{stage.name}</div>
            <div className="flex-1">
              <div className="h-2 bg-gray-200 rounded-full">
                <div
                  className={`h-2 rounded-full ${
                    stage.status === 'success'
                      ? 'bg-green-500'
                      : stage.status === 'running'
                      ? 'bg-blue-500'
                      : stage.status === 'failed'
                      ? 'bg-red-500'
                      : 'bg-gray-300'
                  }`}
                  style={{ width: `${(stage.duration / pipeline.duration) * 100}%` }}
                />
              </div>
            </div>
            <div className="ml-2 text-sm text-gray-600">{stage.duration}s</div>
          </div>
        ))}
      </div>
    </div>
  );
}