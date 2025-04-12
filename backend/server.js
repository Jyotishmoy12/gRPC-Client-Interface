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
app.get('/api/methods', (req, res) => {
    res.json({
        methods: [
            { name: 'sayHello', params: ['name'] },
            { name: 'getUserInfo', params: ['userId'] },
            { name: 'sendMessage', params: ['recipient', 'content'] }
        ]
    });
});

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

app.listen(port, () => {
    console.log(`Express server running at http://localhost:${port}`);
});