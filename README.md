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

# Images
![Screenshot 2025-04-13 130017](https://github.com/user-attachments/assets/8e4f0522-cbba-4b18-ba4e-fb78ad9a3a84)

![Screenshot 2025-04-13 125957](https://github.com/user-attachments/assets/b38d5874-f886-4dd6-885c-963227806d69)

![Screenshot 2025-04-13 130006](https://github.com/user-attachments/assets/52efa910-77b0-4927-afe9-07b2ec64b5b3)






