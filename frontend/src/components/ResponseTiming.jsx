import React, { useState, useEffect } from 'react';
import { Clock, BarChart2 } from 'lucide-react';

const ResponseTiming = ({ timing }) => {
  const [showDetails, setShowDetails] = useState(false);

  if (!timing) {
    return null;
  }

  // Calculate timing metrics
  const totalTime = timing.total;
  const networkTime = timing.network || 0;
  const serverTime = timing.server || totalTime - networkTime;
  
  // Calculate percentages for the visualization
  const networkPercentage = Math.max(5, Math.min(95, (networkTime / totalTime) * 100));
  const serverPercentage = 100 - networkPercentage;

  return (
    <div className="mt-4 bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
      <div 
        className="p-3 flex items-center justify-between cursor-pointer"
        onClick={() => setShowDetails(!showDetails)}
      >
        <div className="flex items-center">
          <Clock className="w-4 h-4 text-blue-400 mr-2" />
          <span className="text-sm font-medium text-gray-300">
            Response Time: <span className="text-blue-400">{totalTime}ms</span>
          </span>
        </div>
        <BarChart2 className="w-4 h-4 text-gray-500" />
      </div>
      
      {showDetails && (
        <div className="p-4 border-t border-slate-700 bg-slate-800/50">
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                <span>Network</span>
                <span>{networkTime}ms</span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-purple-500" 
                  style={{ width: `${networkPercentage}%` }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                <span>Server Processing</span>
                <span>{serverTime}ms</span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500" 
                  style={{ width: `${serverPercentage}%` }}
                />
              </div>
            </div>
            
            <div className="flex justify-between text-xs text-gray-400 pt-1">
              <div>
                <span className="inline-block w-2 h-2 bg-purple-500 rounded-full mr-1"></span>
                Network
              </div>
              <div>
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                Server
              </div>
              <div className="font-semibold">Total: {totalTime}ms</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResponseTiming;