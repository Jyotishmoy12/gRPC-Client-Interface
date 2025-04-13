const express = require('express');
const cors = require('cors');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Load the .proto file
const PROTO_PATH = './service.proto';
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const proto = grpc.loadPackageDefinition(packageDefinition);

// Create the client correctly
const client = new proto.Greeter('127.0.0.1:50051', grpc.credentials.createInsecure());

// Get available methods


app.post('/api/grpc-request', (req, res) => {
    const { method, payload } = req.body;
    
    console.log("Received request:", method, payload);
    
    if (client[method]) {
        client[method](payload, (error, response) => {
            if (error) {
                console.error("gRPC error:", error);
                res.status(500).send({ error: error.message || error });
            } else {
                console.log("gRPC response:", response);
                res.send(response);
            }
        });
    } else {
        res.status(400).send({ error: `Unknown method: ${method}` });
    }
});


// Get available methods with enhanced documentation
app.get('/api/methods', (req, res) => {
    res.json({
        methods: [
            { 
                name: 'sayHello', 
                params: [
                    { name: 'name', type: 'string', description: 'The name to greet', required: true }
                ],
                returns: {
                    type: 'HelloResponse',
                    description: 'Response containing a greeting message',
                    fields: [
                        { name: 'message', type: 'string', description: 'The greeting message returned from the server' }
                    ]
                },
                description: 'Sends a greeting to the server and receives a response.'
            },
            { 
                name: 'getUserInfo', 
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
                },
                description: 'Fetches user information based on the provided user ID.'
            },
            { 
                name: 'sendMessage', 
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
                },
                description: 'Sends a message to the specified recipient.'
            }
        ]
    });
});

app.listen(port, () => {
    console.log(`Express server running at http://localhost:${port}`);
});