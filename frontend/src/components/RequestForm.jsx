import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Send, ChevronDown, Terminal, Loader2, AlertCircle, Code } from 'lucide-react';
import MethodDocumentation from './MethodDocumentation';

const RequestForm = ({ setResponse, onSuccess, setTiming }) => {
  const [method, setMethod] = useState('sayHello');
  const [payload, setPayload] = useState('{"name": "World"}');
  const [availableMethods, setAvailableMethods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isMethodDropdownOpen, setIsMethodDropdownOpen] = useState(false);
  
  // Fetch available methods on component mount
  useEffect(() => {
    const fetchMethods = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/methods');
        setAvailableMethods(res.data.methods);
      } catch (err) {
        setError('Failed to fetch methods: ' + err.message);
      }
    };
    
    fetchMethods();
  }, []);
  
  // Update payload template when method changes
  const handleMethodChange = (methodName) => {
    setMethod(methodName);
    setIsMethodDropdownOpen(false);
    
    // Set default payload based on method
    if (methodName === 'sayHello') {
      setPayload('{"name": "World"}');
    } else if (methodName === 'getUserInfo') {
      setPayload('{"userId": 1}');
    } else if (methodName === 'sendMessage') {
      setPayload('{"recipient": "user123", "content": "Hello there!"}');
    }
  };
  
  const handleSend = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Record timing
      const startTime = performance.now();
      
      // Validate JSON before sending
      const parsedPayload = JSON.parse(payload);
      
      // Network request start time
      const networkStartTime = performance.now();
      
      const res = await axios.post('http://localhost:3000/api/grpc-request', {
        method,
        payload: parsedPayload,
      });
      
      // Calculate timing information
      const endTime = performance.now();
      const totalTime = Math.round(endTime - startTime);
      const networkTime = Math.round(endTime - networkStartTime);
      
      // For estimating server processing time, we assume it's the total time minus network time
      // This is not 100% accurate but gives a reasonable approximation
      const serverTime = Math.max(0, totalTime - networkTime);
      
      setTiming({
        total: totalTime,
        network: networkTime,
        server: serverTime,
        startTime: new Date().toISOString()
      });
      
      setResponse(res.data);
      
      // Call onSuccess to switch to response tab
      if (onSuccess) onSuccess();
      
    } catch (err) {
      if (err.name === 'SyntaxError') {
        setError('Invalid JSON payload: ' + err.message);
      } else {
        setError('Request failed: ' + (err.response?.data?.error || err.message));
      }
      setResponse({ error: err.message });
      setTiming(null);
    } finally {
      setLoading(false);
    }
  };

  // Format JSON with syntax highlighting
  const formatJsonPayload = () => {
    try {
      const parsed = JSON.parse(payload);
      const formatted = JSON.stringify(parsed, null, 2);
      setPayload(formatted);
    } catch (err) {
      // Don't do anything if JSON is invalid
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Terminal className="w-5 h-5 mr-2 text-blue-400" />
        <h2 className="text-lg font-medium text-gray-200">Send gRPC Request</h2>
      </div>
      
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-md p-3 flex items-center">
          <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" />
          <p className="text-sm text-red-200">{error}</p>
        </div>
      )}
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">Method</label>
        <div className="relative">
          <button
            type="button"
            className="w-full bg-slate-800 border border-slate-700 rounded-md px-4 py-2 text-left flex items-center justify-between text-gray-200 hover:bg-slate-700 transition-colors"
            onClick={() => setIsMethodDropdownOpen(!isMethodDropdownOpen)}
            disabled={loading}
          >
            <span>{method}</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${isMethodDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isMethodDropdownOpen && (
            <div className="absolute z-10 w-full mt-1 bg-slate-800 border border-slate-700 rounded-md shadow-lg max-h-56 overflow-auto">
              {availableMethods.map((m) => (
                <button
                  key={m.name}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-slate-700 transition-colors"
                  onClick={() => handleMethodChange(m.name)}
                >
                  {m.name}
                </button>
              ))}
              
              {/* Show placeholder if no methods are available */}
              {availableMethods.length === 0 && (
                <div className="px-4 py-2 text-sm text-gray-500 italic">
                  No methods available
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Method Documentation */}
      <MethodDocumentation 
        selectedMethod={method}
        availableMethods={availableMethods}
      />
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-300">Payload (JSON)</label>
          <button
            type="button"
            className="text-xs text-blue-400 hover:text-blue-300 flex items-center"
            onClick={formatJsonPayload}
            disabled={loading}
          >
            <Code className="w-3 h-3 mr-1" />
            Format JSON
          </button>
        </div>
        <div className="relative">
          <textarea
            rows="10"
            value={payload}
            onChange={(e) => setPayload(e.target.value)}
            placeholder="Enter request payload as JSON"
            disabled={loading}
            className="w-full bg-slate-900 border border-slate-700 rounded-md px-4 py-3 text-gray-200 placeholder-gray-500 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
      
      <div className="flex justify-end">
        <button 
          onClick={handleSend} 
          disabled={loading}
          className={`flex items-center px-4 py-2 rounded-md font-medium ${
            loading 
              ? 'bg-blue-700/50 text-blue-300 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          } transition-colors`}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Send Request
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default RequestForm;