import React from 'react';

const ResponseViewer = ({ response }) => {
  if (!response) {
    return <div className="response-viewer empty">No response yet</div>;
  }
  
  const hasError = response.error !== undefined;
  
  return (
    <div className={`response-viewer ${hasError ? 'error' : 'success'}`}>
      <h3>{hasError ? 'Error Response' : 'gRPC Response'}</h3>
      
      <pre>{JSON.stringify(response, null, 2)}</pre>
      
      {!hasError && response.message && (
        <div className="message-highlight">
          <strong>Message:</strong> {response.message}
        </div>
      )}
    </div>
  );
};

export default ResponseViewer;