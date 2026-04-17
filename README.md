# አገኘሁ (Agenehu) - Lost & Found Addis Ababa

A simple, local-first lost and found marketplace for Addis Ababa built with React Native (Expo) and Supabase.

## Features
- **Home Feed**: Browse lost and found items in separate tabs.
- **Create Post**: Quickly post a lost or found item with title, description, category, location, and photos.
- **Search & Filter**: Find items by keyword, location (Addis areas), or category.
- **Post Details**: View full details and contact the poster directly via Phone or WhatsApp.
- **Digital Concierge Design**: Premium editorial UI with tonal depth and asymmetric sophistication.

## Tech Stack
- React Native (Expo SDK 54+)
- Supabase (Postgres Database + Storage)
- TypeScript
- Lucide React Native (Icons)
- Date-fns (Date formatting)

## Setup Instructions

### 1. Supabase Backend
- Create a new project on [Supabase](https://supabase.com).
- Run the SQL in `supabase_schema.sql` (found in the root) in the Supabase SQL Editor.
- Create a storage bucket named `post-images` and make it public.

### 2. Local Environment
- Install dependencies:
  ```bash
  npm install
  ```
- Copy `.env.example` to `.env` and fill in your Supabase credentials:
  ```
  EXPO_PUBLIC_SUPABASE_URL=your-supabase-url
  EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
  ```

### 3. Run the App
- Start the development server:
  ```bash
  npm run android # for Android
  npm run ios     # for iOS
  npm run start   # for Expo Go
  ```

## Project Structure
- `src/components`: Reusable UI components (Button, Input, Card, Text, StatusHalo).
- `src/screens`: Main screen implementations (Home, Search, Create, Details).
- `src/hooks`: Custom hooks for data fetching (`usePosts`, `usePost`) and storage (`useStorage`).
- `src/theme`: Design system configuration (colors, typography).
- `src/types`: TypeScript definitions.
- `src/utils`: Supabase client configuration.
