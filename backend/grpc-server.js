const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// Load the .proto file
const PROTO_PATH = './service.proto';
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const proto = grpc.loadPackageDefinition(packageDefinition).Greeter;

// Implement service methods
const sayHello = (call, callback) => {
    console.log('SayHello called with:', call.request);
    callback(null, { message: `Hello, ${call.request.name}!` });
};

const getUserInfo = (call, callback) => {
    console.log('GetUserInfo called with:', call.request);
    // Simulate database lookup
    const users = {
        1: { userId: 1, username: 'john_doe', email: 'john@example.com', role: 'admin' },
        2: { userId: 2, username: 'jane_smith', email: 'jane@example.com', role: 'user' },
        3: { userId: 3, username: 'bob_jones', email: 'bob@example.com', role: 'user' }
    };
    
    const userId = call.request.userId;
    const user = users[userId];
    
    if (user) {
        callback(null, user);
    } else {
        callback({
            code: grpc.status.NOT_FOUND,
            message: `User with ID ${userId} not found`
        });
    }
};

const sendMessage = (call, callback) => {
    console.log('SendMessage called with:', call.request);
    // Generate a unique message ID
    const messageId = 'msg_' + Date.now();
    const timestamp = new Date().toISOString();
    
    callback(null, {
        success: true,
        messageId: messageId,
        timestamp: timestamp
    });
};

// Start the server
const server = new grpc.Server();
server.addService(proto.service, { 
    sayHello: sayHello,
    getUserInfo: getUserInfo,
    sendMessage: sendMessage
});

server.bindAsync('127.0.0.1:50051', grpc.ServerCredentials.createInsecure(), (error, port) => {
    if (error) {
        console.error('Failed to bind server:', error);
        return;
    }
    console.log(`gRPC Server running at http://127.0.0.1:${port}`);
    server.start();
});