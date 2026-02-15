# LiftLog

A mobile workout tracking app built with React Native and Expo. Track exercises, log sets with weight and reps, and monitor your fitness progress over time.

## Features

- **Workout Tracking** — Create workouts, add exercises, and log sets with weight/reps. Built-in timer tracks session duration.
- **Exercise Library** — Browse, search, and filter exercises by category. Create custom exercises with tags.
- **Recent Workouts** — View your latest sessions with duration, set count, and date on the home screen.
- **Workout Calendar** — Week view showing workout activity at a glance.
- **User Profiles** — View your stats (total workouts, exercises, hours) and manage account settings.
- **Authentication** — Email/password and Google OAuth sign-in powered by Supabase.
- **Internationalization** — English and Spanish language support with automatic device locale detection.
- **Dark Theme** — Purpose-built dark UI with a purple accent color palette.

## Tech Stack

| Layer          | Technology                                    |
| -------------- | --------------------------------------------- |
| Framework      | React Native 0.81, Expo 54, React 19          |
| Routing        | Expo Router (file-based)                       |
| Backend        | Supabase (PostgreSQL, Auth, Realtime)          |
| Language       | TypeScript                                     |
| Icons          | lucide-react-native                            |
| i18n           | i18next + react-i18next + expo-localization     |
| Auth Storage   | expo-secure-store (encrypted on-device)        |
| Formatting     | Prettier                                       |

## Project Structure

```
app/
├── (auth)/             # Auth screens (landing, login, signup)
├── (tabs)/             # Main tab screens (home, workout, calendar, exercises, profile)
├── login-callback.tsx  # OAuth callback handler
└── _layout.tsx         # Root layout with auth routing

src/
├── components/         # Reusable UI components (SetRow, WorkoutExerciseCard, modals)
├── context/            # React Context (AuthContext)
├── lib/                # Supabase client, DB operations, auth helpers
├── hooks/              # Custom hooks (useLanguage)
├── constants/          # Colors, spacing, typography, common styles
├── i18n/               # i18n setup and locale files (en, es)
└── types/              # TypeScript interfaces
```

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm
- iOS Simulator, Android Emulator, or Expo Go on a physical device

### Installation

```bash
git clone <repo-url>
cd Liftlog
npm install
```

### Environment

The app connects to Supabase using credentials configured in `app.json` under `expo.extra`. Update `supabaseUrl` and `supabaseAnonKey` with your own Supabase project values if needed.

### Running

```bash
# Start the Expo dev server
npm start

# Run on a specific platform
npm run ios
npm run android
npm run web
```

### Scripts

| Command          | Description                    |
| ---------------- | ------------------------------ |
| `npm start`      | Start Expo development server  |
| `npm run ios`    | Launch on iOS Simulator        |
| `npm run android`| Launch on Android Emulator     |
| `npm run web`    | Launch in web browser          |
| `npm run format` | Format code with Prettier      |

## Database Schema

The app uses the following Supabase tables:

- **workouts** — Workout sessions tied to a user
- **workout_exercises** — Exercises added to a workout
- **exercises** — Exercise definitions (name, categories)
- **sets** — Individual sets with weight and reps

## License

This project is for personal use.
