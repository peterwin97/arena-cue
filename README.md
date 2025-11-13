# Resolume Companion

Professional cue management companion app for Resolume Arena with QLab-inspired interface.

## Project Structure

```
root/
├── electron/           # Electron main process
│   ├── main.js        # Main Electron process
│   ├── preload.js     # Preload script for IPC
│   └── package.json   # Electron config
├── server/            # Express API for Resolume communication
│   ├── index.js       # Express server
│   ├── package.json   # Server dependencies
│   └── .env          # Server environment variables
├── client/            # Built client files (production build output)
│   └── dist/         # Vite build output (created on build)
├── src/              # React/Vite source code
│   ├── components/   # React components
│   ├── pages/        # Page components
│   ├── hooks/        # Custom React hooks
│   └── lib/          # Utility functions
├── public/           # Static assets
├── index.html        # Entry HTML file
├── vite.config.ts    # Vite configuration (builds to client/dist)
└── package.json      # Root package.json
```

## Development

The project uses:
- **Vite + React** for the frontend (port 5173)
- **Express** for the backend API (port 3000)  
- **Electron** for desktop app wrapper

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Setup

Install dependencies at root:
```sh
npm install
```

Install server dependencies:
```sh
cd server && npm install && cd ..
```

Install Electron dependencies:
```sh
cd electron && npm install && cd ..
```

### Running in Development

Start Vite dev server:
```sh
npm run dev
```

This runs the React app on port 5173. To run the full Electron stack with Express API, you'll need to run the server and Electron separately (or use concurrently - see scripts below).

### Building for Production

Build the client:
```sh
npm run build
```

This builds the React app to `client/dist/` which Electron loads in production mode.

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
