Below is a starter README.md you can paste into the repo and tweak as the project grows.

TravelMatch
TravelMatch is a Tinder-style matching app for travellers, with a single backend that serves both the web app and the mobile app. The goal is to connect people based on upcoming trips, locations, and travel preferences.

Project structure
text
TravelMatch/
  apps/
    backend/   # Node + TypeScript + Express/NestJS API
    web/       # Next.js web client
    mobile/    # Expo React Native mobile app

Backend exposes REST endpoints (e.g. /health) and will eventually handle auth, profiles, trips, swipes, matches and chat.

Web is a Next.js app that consumes the backend APIs.

Mobile is an Expo React Native app that consumes the same backend APIs.

Tech stack
Backend

Node.js + TypeScript

Express (or NestJS)

CORS, JSON body parsing

Web

Next.js (React + TypeScript)

Uses NEXT_PUBLIC_API_URL to talk to the backend

Mobile

Expo (React Native)

Uses a shared API_URL constant to talk to the backend

Getting started
Prerequisites
Node.js (LTS 20+ recommended)

npm (or yarn/pnpm)

Git

From each app directory:

Backend

npm run dev – start backend in watch mode

npm run build – build TypeScript to dist

npm start – run built server

Web

npm run dev – start Next.js dev server

npm run build – production build

npm start – start Next.js in production mode

Mobile

npm start – start Expo dev tools

npm run ios – start on iOS simulator (if available)

npm run android – start on Android emulator (if available)    
