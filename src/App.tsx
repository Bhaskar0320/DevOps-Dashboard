import React from 'react';
import { PipelineStatus } from './components/PipelineStatus';
import { MetricsChart } from './components/MetricsChart';
import { DeploymentCard } from './components/DeploymentCard';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { useDashboardStore } from './store/dashboardStore';

function App() {
  const { pipeline, metrics, deployments, isLoading, error } = useDashboardStore();

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <ErrorMessage message={error} />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">DevOps Dashboard</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-4">Pipeline Status</h2>
              {pipeline && <PipelineStatus pipeline={pipeline} />}
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-4">System Metrics</h2>
              <MetricsChart metrics={metrics} title="CPU Usage Over Time" />
            </section>
          </div>
          
          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-4">Deployment Status</h2>
              <div className="grid gap-4">
                {deployments.map((deployment, index) => (
                  <DeploymentCard key={index} deployment={deployment} />
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;