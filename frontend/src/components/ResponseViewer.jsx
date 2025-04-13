import React, { useState } from 'react';
import { FileText, AlertCircle, Copy, CheckCircle, MessageSquare, Download } from 'lucide-react';
import ResponseTiming from './ResponseTiming';

const ResponseViewer = ({ response, timing }) => {
  const [copied, setCopied] = useState(false);
  
  if (!response) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-slate-800/50 rounded-lg border border-dashed border-slate-700 text-gray-400">
        <FileText className="w-12 h-12 mb-4 text-gray-500 opacity-50" />
        <p className="text-sm">No response data yet</p>
        <p className="text-xs text-gray-500 mt-2">Send a request to see the response here</p>
      </div>
    );
  }
  
  const hasError = response.error !== undefined;
  const formattedResponse = JSON.stringify(response, null, 2);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(formattedResponse);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadResponse = () => {
    const blob = new Blob([formattedResponse], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `grpc-response-${new Date().getTime()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {hasError ? (
            <AlertCircle className="w-5 h-5 mr-2 text-red-500" />
          ) : (
            <FileText className="w-5 h-5 mr-2 text-green-500" />
          )}
          <h2 className="text-lg font-medium text-gray-200">
            {hasError ? 'Error Response' : 'gRPC Response'}
          </h2>
        </div>
        
        <div className="flex space-x-2">
          <button 
            onClick={copyToClipboard}
            className="flex items-center px-2 py-1 text-xs rounded-md bg-slate-700 hover:bg-slate-600 text-gray-300 transition-colors"
            title="Copy to clipboard"
          >
            {copied ? (
              <>
                <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                <span className="text-green-500">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 mr-1" />
                <span>Copy</span>
              </>
            )}
          </button>
          
          <button 
            onClick={downloadResponse}
            className="flex items-center px-2 py-1 text-xs rounded-md bg-slate-700 hover:bg-slate-600 text-gray-300 transition-colors"
            title="Download as JSON"
          >
            <Download className="w-3 h-3 mr-1" />
            <span>Download</span>
          </button>
        </div>
      </div>
      
      {/* Display timing information if available */}
      {timing && <ResponseTiming timing={timing} />}
      
      <div className={`relative rounded-lg overflow-hidden border ${
        hasError ? 'border-red-500/50 bg-red-500/10' : 'border-green-500/50 bg-green-500/10'
      }`}>
        <div className="absolute top-0 right-0 text-xs px-2 py-1 rounded-bl text-gray-300 bg-opacity-80 font-mono">
          {hasError ? 'ERROR' : 'SUCCESS'}
        </div>
        
        <pre className="p-4 overflow-auto max-h-96 text-sm font-mono text-gray-200">
          {formattedResponse}
        </pre>
      </div>
      
      {!hasError && response.message && (
        <div className="bg-blue-500/20 border border-blue-500/50 rounded-md p-3 flex items-start">
          <MessageSquare className="w-5 h-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-blue-300 text-sm font-medium mb-1">Message Response</h4>
            <p className="text-gray-200">{response.message}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResponseViewer;