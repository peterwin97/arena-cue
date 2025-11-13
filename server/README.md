# Proxy Server for Resolume Connection

This Express server acts as a proxy to connect the Lovable sandbox to your local Resolume Arena instance, bypassing browser CORS restrictions.

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the server:**
   ```bash
   npm run dev
   ```

The server runs on `http://localhost:3000` by default.

## How It Works

When running in a browser (Lovable sandbox), direct connections to `http://localhost:8080` fail due to CORS. This proxy server:

1. Receives requests from the browser at `/api/resolume/proxy/*`
2. Forwards them to your Resolume Arena instance
3. Returns the response back to the browser

## Configuration

The Resolume target (host and port) is configured through the app's Connection Settings dialog. The proxy server dynamically updates its target when you click "Test & Save".

## Endpoints

- `POST /api/resolume/connection` - Update Resolume target host/port
- `/api/resolume/proxy/*` - Proxy all requests to Resolume Arena REST API

## Example

If your Resolume Arena is running on `192.168.0.32:7070`:

1. Open Connection Settings in the app
2. Enter Host: `192.168.0.32`, Port: `7070`
3. Click "Test & Save"
4. The proxy server will forward all requests to `http://192.168.0.32:7070/api/v1/...`
