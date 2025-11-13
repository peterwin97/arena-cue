# Resolume Companion

A professional cue management companion app for Resolume Arena, inspired by QLab's workflow. Control your Resolume compositions with precision through an intuitive desktop interface featuring cue lists, transport controls, and real-time inspector panels.

## What is Resolume Companion?

Resolume Companion bridges the gap between stage management and live visuals by providing:

- **Cue List Management**: Organize and trigger Resolume compositions in a structured, sequential manner
- **Transport Controls**: Professional playback controls for live performance environments
- **Real-time Inspector**: Monitor and adjust parameters on-the-fly
- **Desktop Integration**: Native Electron app for seamless workflow integration

Perfect for VJs, lighting designers, and technical directors who need precise control over Resolume Arena during live performances.

## Architecture

This is a multi-process Electron application with three main components:

```
┌─────────────────────────────────────────────────────┐
│                  Electron (Desktop)                  │
│  ┌───────────────────────────────────────────────┐  │
│  │         React Frontend (Vite)                 │  │
  │  │  • Cue List UI                                │  │
  │  │  • Transport Controls                         │  │
  │  │  • Inspector Panel                            │  │
  │  │  Port 8080 (dev)                              │  │
│  └───────────────────────────────────────────────┘  │
│                        ↕ IPC                         │
│  ┌───────────────────────────────────────────────┐  │
│  │         Express Server                        │  │
│  │  • Resolume OSC/API Communication             │  │
│  │  • Composition Management                     │  │
│  │  Port 3000                                    │  │
│  └───────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
                        ↕
              Resolume Arena (OSC/API)
```

## Installation

### Prerequisites

- **Node.js 18+** - [Download here](https://nodejs.org/) or install via [nvm](https://github.com/nvm-sh/nvm)
- **npm** (comes with Node.js)
- **Resolume Arena** - Running on the same machine or network

### Step 1: Clone the Repository

```bash
git clone <YOUR_GIT_URL>
cd resolume-companion
```

### Step 2: Install All Dependencies

```bash
# Install root dependencies (React/Vite frontend)
npm install

# Install server dependencies (Express API)
cd server
npm install
cd ..

# Install Electron dependencies (Desktop wrapper)
cd electron
npm install
cd ..
```

### Step 3: Configure Environment Variables

Create a `.env` file in the `server/` directory:

```bash
# server/.env
PORT=3000
RESOLUME_HOST=localhost
RESOLUME_PORT=7000
```

## Running the Application

### Option 1: Development Mode (Frontend Only)

Run just the React frontend for UI development:

```bash
npm run dev
```

Vite dev server starts at `http://localhost:8080`

> **Important**: This Electron app shares port 8080 with Resolume Arena's webserver. During development:
> - **For Lovable editing**: The preview works on port 8080 (stop Resolume if running)
> - **For Electron testing**: Stop Resolume Arena to avoid port conflicts, then run the Electron app
> - **Production**: The packaged Electron app loads from local files (no port conflict)

### Option 2: Full Stack Development (Manual)

Run all three components in separate terminals:

**Terminal 1 - Frontend:**
```bash
npm run dev
```

**Terminal 2 - Express Server:**
```bash
cd server
npm run dev
```

**Terminal 3 - Electron (optional):**
```bash
cd electron
npm start
```

### Option 3: Full Stack with Concurrently (Recommended)

*Note: This requires adding `concurrently` to package.json scripts (manual step)*

```bash
npm run dev:full
```

This runs both the frontend and server with colored output in a single terminal.

## Building for Production

### Build the Frontend

```bash
npm run build
```

This compiles the React app to `client/dist/` which Electron loads in production.

### Package the Electron App

```bash
cd electron
# Add electron-builder or similar for packaging
npm run package
```

## Project Structure

```
resolume-companion/
├── electron/              # Electron main process
│   ├── main.js           # Electron entry point
│   ├── preload.js        # IPC bridge (secure context)
│   └── package.json      # Electron configuration
│
├── server/               # Express backend
│   ├── index.js          # API server + Resolume communication
│   ├── package.json      # Server dependencies
│   └── .env             # Server configuration
│
├── src/                  # React frontend source
│   ├── components/       # UI components
│   │   └── workspace/    # Workspace-specific components
│   ├── pages/           # Page routes
│   ├── hooks/           # Custom React hooks
│   └── lib/             # Utilities and helpers
│
├── client/               # Production build output
│   └── dist/            # Generated by Vite
│
├── public/              # Static assets
├── index.html           # HTML entry point
├── vite.config.ts       # Vite bundler config
└── package.json         # Root dependencies
```

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Express, Node.js
- **Desktop**: Electron
- **Build Tool**: Vite
- **Routing**: React Router
- **State Management**: React Query

## Project info

**URL**: https://lovable.dev/projects/590abdfc-63f7-465b-8b86-d25414af7a25

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/590abdfc-63f7-465b-8b86-d25414af7a25) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/590abdfc-63f7-465b-8b86-d25414af7a25) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
