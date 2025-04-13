# 🛰️ gRPC Client Interface

An interactive tool to explore and test **gRPC services from the browser** — no gRPC-Web, no Envoy, just plain HTTP via an Express proxy.

This project was built for learning, experimenting, and showcasing how gRPC can be made accessible in a web environment using a custom bridge between frontend and backend.

---

## ✨ Features

- 🚀 Full-featured **React frontend** with JSON payload editor
- 🔌 **Express server** acting as a REST-to-gRPC bridge
- 🧠 **gRPC server** implementing example services like:
  - `sayHello(name)`
  - `getUserInfo(userId)`
  - `sendMessage(recipient, content)`
- ⏱️ Visual response timing breakdown (network vs server)
- 📜 Method documentation loaded dynamically from the backend

---

## 🧠 Why This Exists

gRPC is an efficient and powerful alternative to REST APIs — but it can't be used directly in the browser due to HTTP/2 limitations and protocol constraints.

> This tool bridges that gap by allowing you to call gRPC services from the browser using a simple HTTP interface.

It's great for:
- 📚 Learning how gRPC works
- 🧪 Testing gRPC services without CLI tools
- 🔍 Debugging and visualizing request/response timings


