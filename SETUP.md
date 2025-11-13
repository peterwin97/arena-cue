# Setup Guide

This document explains how to set up and run the Electron + React + Express architecture.

## Architecture Overview

- **electron/** - Electron main process that wraps the app as a desktop application
- **server/** - Express API backend for communicating with Resolume via OSC
- **src/** - React frontend source code (Vite)
- **client/dist/** - Production build output (created by `npm run build`)

## Installation

### 1. Install Root Dependencies
```bash
npm install
```

### 2. Install Server Dependencies
```bash
cd server
npm install
cd ..
```

### 3. Install Electron Dependencies  
```bash
cd electron
npm install
cd ..
```

## Development Workflow

### Option 1: Run Frontend Only (Current Default)
```bash
npm run dev
```
This starts the Vite dev server on port 5173. Good for frontend development.

### Option 2: Run Full Stack (Recommended for Future)

You'll need to run three processes. In separate terminals:

**Terminal 1 - Express Server:**
```bash
cd server
npm run dev
```

**Terminal 2 - Vite Dev Server:**
```bash
npm run dev
```

**Terminal 3 - Electron:**
```bash
cd electron
NODE_ENV=development npm start
```

### Option 3: Use Concurrently (Recommended - To Be Implemented)

To be added to root `package.json`:
```json
"scripts": {
  "dev:full": "concurrently \"npm run dev:server\" \"npm run dev:client\" \"npm run dev:electron\"",
  "dev:server": "cd server && npm run dev",
  "dev:client": "npm run dev",
  "dev:electron": "wait-on http://localhost:5173 http://localhost:3000 && cross-env NODE_ENV=development electron electron/main.js"
}
```

Then install: `npm install -D concurrently wait-on cross-env electron electron-builder`

## Production Build

### Build the React app:
```bash
npm run build
```
This creates `client/dist/` with the production build.

### Package Electron app (To Be Implemented):
```bash
npm run package
```

## Environment Variables

- **Root .env**: `VITE_API_URL=http://localhost:3000`
- **Server .env**: `PORT=3000`

## API Endpoints (Server)

- `GET /api/health` - Health check
- `GET /api/projects` - List projects
- `POST /api/projects` - Create project
- `GET /api/cues` - List cues
- `POST /api/cues` - Create cue
- `PUT /api/cues/:id` - Update cue
- `DELETE /api/cues/:id` - Delete cue
- `POST /api/resolume/osc` - Send OSC to Resolume

## Electron IPC API

Available via `window.electronAPI`:
- `selectFile()` - Open file dialog
- `saveProject(data)` - Save project to file
- `loadProject(filePath)` - Load project from file

## Next Steps

1. Add `concurrently`, `wait-on`, `cross-env`, `electron`, `electron-builder` to dependencies
2. Implement Express API endpoints in `server/index.js`
3. Create API client in React app (`src/lib/api.ts`)
4. Implement OSC communication using `node-osc` in server
5. Configure electron-builder for packaging
6. Add proper TypeScript support to server/
