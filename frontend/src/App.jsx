import React, { useState, useEffect } from 'react';
import { Upload, Send, FileText, ArrowRight, CheckCircle, Server, Code, Terminal } from 'lucide-react';
import ProtoUploader from './components/ProtoUploader';
import RequestForm from './components/RequestForm';
import ResponseViewer from './components/ResponseViewer';

const App = () => {
  const [protoContent, setProtoContent] = useState('');
  const [response, setResponse] = useState(null);
  const [activeTab, setActiveTab] = useState('request');
  const [isLoaded, setIsLoaded] = useState(false);
  const [timing, setTiming] = useState(null);

  useEffect(() => {
    // Animation for initial load
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-gray-100 p-4 md:p-8 transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <header className="max-w-5xl mx-auto mb-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Server className="w-8 h-8 text-blue-400" />
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">gRPC Client Interface</h1>
        </div>
        <p className="text-gray-400 max-w-lg mx-auto">Connect to your gRPC services using this interactive client</p>
      </header>
      
      <div className="max-w-5xl mx-auto rounded-lg bg-slate-800/50 backdrop-blur-sm border border-slate-700 shadow-xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Sidebar */}
          <div className="md:col-span-2 p-6 bg-slate-800 border-r border-slate-700">
            <div className="flex items-center gap-2 mb-4 text-blue-400">
              <Upload className="w-5 h-5" />
              <h2 className="font-semibold">Proto Definition</h2>
            </div>
            
            <div className="mb-6">
              <ProtoUploader setProtoContent={setProtoContent} />
            </div>
            
            {protoContent && (
              <div className="proto-preview mt-4 animate-fade-in">
                <div className="flex items-center gap-2 mb-2 text-green-400">
                  <CheckCircle className="w-4 h-4" />
                  <h3 className="font-medium">Loaded Proto Definition</h3>
                </div>
                <div className="bg-slate-900/70 rounded-md p-3 max-h-64 overflow-auto text-xs text-gray-300">
                  <pre>{protoContent}</pre>
                </div>
              </div>
            )}
          </div>
          
          {/* Main Content */}
          <div className="md:col-span-3 p-6">
            <div className="flex items-center space-x-6 border-b border-slate-700 mb-6">
              <button 
                className={`flex items-center gap-2 pb-3 px-1 transition-all ${activeTab === 'request' 
                  ? 'text-blue-400 border-b-2 border-blue-400' 
                  : 'text-gray-400 hover:text-gray-200'}`}
                onClick={() => setActiveTab('request')}
              >
                <Send className="w-4 h-4" />
                <span>Request</span>
              </button>
              <button 
                className={`flex items-center gap-2 pb-3 px-1 transition-all ${activeTab === 'response' 
                  ? 'text-blue-400 border-b-2 border-blue-400' 
                  : 'text-gray-400 hover:text-gray-200'}`}
                onClick={() => setActiveTab('response')}
              >
                <FileText className="w-4 h-4" />
                <span>Response</span>
              </button>
            </div>
            
            <div className="tab-content">
              {activeTab === 'request' ? (
                <div className="animate-slide-in">
                  <RequestForm 
                    protoContent={protoContent}
                    setResponse={setResponse}
                    setTiming={setTiming}
                    onSuccess={() => setActiveTab('response')}
                  />
                </div>
              ) : (
                <div className="animate-slide-in">
                  <ResponseViewer 
                    response={response} 
                    timing={timing}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <footer className="max-w-5xl mx-auto mt-8 text-center text-gray-500 text-sm">
        <div className="flex items-center justify-center gap-2">
          <Code className="w-4 h-4" />
          <span>Built with React • {new Date().getFullYear()}</span>
        </div>
      </footer>
      
      {/* Global CSS */}
      <style jsx global>{`
        /* Add these classes to your CSS file */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideIn {
          from { transform: translateY(10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
        
        .animate-slide-in {
          animation: slideIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;