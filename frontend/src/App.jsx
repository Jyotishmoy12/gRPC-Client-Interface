import React, { useState } from 'react';
import ProtoUploader from './components/ProtoUploader';
import RequestForm from './components/RequestForm';
import ResponseViewer from './components/ResponseViewer';
import './App.css';

const App = () => {
  const [protoContent, setProtoContent] = useState('');
  const [response, setResponse] = useState(null);
  const [activeTab, setActiveTab] = useState('request');
  
  return (
    <div className="grpc-client-app">
      <header>
        <h1>gRPC Client Interface</h1>
        <p>Connect to your gRPC services using this interactive client</p>
      </header>
      
      <div className="proto-section">
        <ProtoUploader setProtoContent={setProtoContent} />
        {protoContent && (
          <div className="proto-preview">
            <h3>Loaded Proto Definition</h3>
            <pre>{protoContent}</pre>
          </div>
        )}
      </div>
      
      <div className="tabs">
        <button 
          className={activeTab === 'request' ? 'active' : ''}
          onClick={() => setActiveTab('request')}
        >
          Request
        </button>
        <button 
          className={activeTab === 'response' ? 'active' : ''}
          onClick={() => setActiveTab('response')}
        >
          Response
        </button>
      </div>
      
      <div className="tab-content">
        {activeTab === 'request' ? (
          <RequestForm 
            protoContent={protoContent}
            setResponse={setResponse} 
          />
        ) : (
          <ResponseViewer response={response} />
        )}
      </div>
    </div>
  );
};

export default App;