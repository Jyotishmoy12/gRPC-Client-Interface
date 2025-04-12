import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RequestForm = ({ setResponse }) => {
  const [method, setMethod] = useState('sayHello');
  const [payload, setPayload] = useState('{"name": "World"}');
  const [availableMethods, setAvailableMethods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
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
      
      // Validate JSON before sending
      const parsedPayload = JSON.parse(payload);
      
      const res = await axios.post('http://localhost:3000/api/grpc-request', {
        method,
        payload: parsedPayload,
      });
      
      setResponse(res.data);
    } catch (err) {
      if (err.name === 'SyntaxError') {
        setError('Invalid JSON payload: ' + err.message);
      } else {
        setError('Request failed: ' + (err.response?.data?.error || err.message));
      }
      setResponse({ error: err.message });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="request-form">
      <h3>Send gRPC Request</h3>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      <div className="form-group">
        <label>Method:</label>
        <select
          value={method}
          onChange={(e) => handleMethodChange(e.target.value)}
          disabled={loading}
        >
          {availableMethods.map((m) => (
            <option key={m.name} value={m.name}>
              {m.name}
            </option>
          ))}
        </select>
      </div>
      
      <div className="form-group">
        <label>Payload (JSON):</label>
        <textarea
          rows="8"
          value={payload}
          onChange={(e) => setPayload(e.target.value)}
          placeholder="Enter request payload as JSON"
          disabled={loading}
        />
      </div>
      
      <button 
        onClick={handleSend} 
        disabled={loading}
      >
        {loading ? 'Sending...' : 'Send Request'}
      </button>
    </div>
  );
};

export default RequestForm;