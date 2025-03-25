# Project Setup Guide

## 📥 Clone the Project

First, clone the project repository to your local machine.

```bash
git clone <repository_url>
cd <project_folder>
```

## 📦 Install Dependencies

Install the required Node.js packages using `npm`.

```bash
npm install
```

## 🔧 Environment Variables

Create a `.env` file in the project root directory and add your MongoDB connection URL.

```plaintext
MONGO_URI=<your_mongodb_connection_url>
```

## 🚀 Start the Server

Run the server locally.

```bash
nodemon app.js
```

The server will be available at:

```
http://localhost:3000
```

✅ You’re all set! 🎯
