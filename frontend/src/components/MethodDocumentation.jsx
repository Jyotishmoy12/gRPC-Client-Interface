import React from 'react';
import { Info, ChevronDown, ChevronUp, Code, AlertCircle } from 'lucide-react';

const MethodDocumentation = ({ selectedMethod, availableMethods }) => {
  const [expanded, setExpanded] = React.useState(true);
  
  // Find the currently selected method from available methods
  const methodDetails = React.useMemo(() => {
    // Default documentation for methods if not found in availableMethods
    const methodDocs = {
      'sayHello': {
        description: 'Sends a greeting to the server and receives a response.',
        params: [
          { name: 'name', type: 'string', description: 'The name to greet', required: true }
        ],
        returns: {
          type: 'HelloResponse',
          description: 'Response containing a greeting message',
          fields: [
            { name: 'message', type: 'string', description: 'The greeting message returned from the server' }
          ]
        }
      },
      'getUserInfo': {
        description: 'Fetches user information based on the provided user ID.',
        params: [
          { name: 'userId', type: 'int32', description: 'The ID of the user to fetch', required: true }
        ],
        returns: {
          type: 'UserResponse',
          description: 'Response containing user details',
          fields: [
            { name: 'userId', type: 'int32', description: 'The user ID' },
            { name: 'username', type: 'string', description: 'The username' },
            { name: 'email', type: 'string', description: 'The user\'s email address' },
            { name: 'role', type: 'string', description: 'The user\'s role (e.g., admin, user)' }
          ]
        }
      },
      'sendMessage': {
        description: 'Sends a message to the specified recipient.',
        params: [
          { name: 'recipient', type: 'string', description: 'The recipient of the message', required: true },
          { name: 'content', type: 'string', description: 'The content of the message', required: true }
        ],
        returns: {
          type: 'MessageResponse',
          description: 'Response containing the status of the message delivery',
          fields: [
            { name: 'success', type: 'bool', description: 'Whether the message was sent successfully' },
            { name: 'messageId', type: 'string', description: 'Unique identifier for the sent message' },
            { name: 'timestamp', type: 'string', description: 'The time when the message was sent' }
          ]
        }
      }
    };
    
    // Find the method in availableMethods if it exists
    const foundMethod = availableMethods?.find(m => m.name === selectedMethod);
    
    // Return either the found method with enhanced documentation or the default docs
    return {
      ...(foundMethod || { name: selectedMethod, params: [] }),
      ...methodDocs[selectedMethod]
    };
  }, [selectedMethod, availableMethods]);

  // Example code template for the selected method
  const getExampleCode = () => {
    if (selectedMethod === 'sayHello') {
      return '{\n  "name": "World"\n}';
    } else if (selectedMethod === 'getUserInfo') {
      return '{\n  "userId": 1\n}';
    } else if (selectedMethod === 'sendMessage') {
      return '{\n  "recipient": "user123",\n  "content": "Hello there!"\n}';
    }
    return '{\n  // Add parameters here\n}';
  };

  if (!methodDetails) {
    return (
      <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-md p-3 mt-4">
        <div className="flex items-center">
          <AlertCircle className="w-5 h-5 text-yellow-500 mr-2" />
          <p className="text-sm text-yellow-200">No documentation available for this method.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg mt-4 overflow-hidden">
      <div 
        className="flex items-center justify-between p-3 bg-slate-700/50 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center">
          <Info className="w-4 h-4 text-blue-400 mr-2" />
          <h3 className="font-medium text-gray-200">Method Documentation</h3>
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        )}
      </div>
      
      {expanded && (
        <div className="p-4 space-y-4">
          <div>
            <h4 className="text-blue-400 font-medium mb-1">{methodDetails.name}</h4>
            <p className="text-gray-300 text-sm">{methodDetails.description}</p>
          </div>
          
          <div>
            <h5 className="text-sm font-medium text-gray-400 mb-2">Parameters</h5>
            <div className="bg-slate-900 rounded-md p-3">
              {methodDetails.params && methodDetails.params.length > 0 ? (
                <div className="space-y-2">
                  {methodDetails.params.map((param, index) => (
                    <div key={index} className="grid grid-cols-5 gap-2 text-sm">
                      <div className="col-span-1 font-mono text-purple-400">{param.name}</div>
                      <div className="col-span-1 text-blue-300">{param.type}</div>
                      <div className="col-span-3 text-gray-400">{param.description}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm italic">No parameters</p>
              )}
            </div>
          </div>
          
          <div>
            <h5 className="text-sm font-medium text-gray-400 mb-2">Returns</h5>
            <div className="bg-slate-900 rounded-md p-3">
              <div className="mb-2">
                <span className="text-green-400 font-mono text-sm">{methodDetails.returns?.type}</span>
                <span className="text-gray-400 text-sm ml-2">{methodDetails.returns?.description}</span>
              </div>
              
              {methodDetails.returns?.fields && (
                <div className="border-t border-slate-800 pt-2 mt-2">
                  <h6 className="text-xs font-medium text-gray-500 mb-2">Response Fields</h6>
                  <div className="space-y-1">
                    {methodDetails.returns.fields.map((field, index) => (
                      <div key={index} className="grid grid-cols-5 gap-2 text-sm">
                        <div className="col-span-1 font-mono text-purple-400">{field.name}</div>
                        <div className="col-span-1 text-blue-300">{field.type}</div>
                        <div className="col-span-3 text-gray-400">{field.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <h5 className="text-sm font-medium text-gray-400 mb-2">Example</h5>
            <div className="bg-slate-900 rounded-md p-3 relative">
              <div className="absolute top-2 right-2">
                <Code className="w-4 h-4 text-gray-500" />
              </div>
              <pre className="text-sm text-gray-300 font-mono">{getExampleCode()}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MethodDocumentation;