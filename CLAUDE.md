# Boulder Notebook

A React Native / Expo mobile app for tracking bouldering sessions and climbs.

## Stack

- **Framework**: Expo (SDK 54) with Expo Router v6 (file-based routing)
- **Language**: TypeScript (strict mode)
- **UI**: React Native 0.81, React 19
- **Navigation**: Expo Router tabs + stack, React Navigation
- **Animation**: React Native Reanimated 4, React Native Gesture Handler
- **Architecture**: Expo New Architecture enabled, React Compiler enabled

## Project Structure

```
app/                    # Expo Router pages
  (tabs)/               # Tab-based screens
    index.tsx           # Home tab
    explore.tsx         # Explore tab
    _layout.tsx         # Tab navigator config
  _layout.tsx           # Root layout (ThemeProvider, Stack)
  modal.tsx             # Modal screen
components/             # Shared UI components
  ui/                   # Low-level primitives (IconSymbol, Collapsible)
  themed-text.tsx       # Theme-aware Text
  themed-view.tsx       # Theme-aware View
  haptic-tab.tsx        # Tab button with haptic feedback
  parallax-scroll-view.tsx
constants/
  theme.ts              # Colors (light/dark) and platform Fonts
hooks/
  use-color-scheme.ts   # Color scheme hook (native + web variants)
  use-theme-color.ts    # Per-component theme color resolution
```

## Commands

```bash
npx expo start          # Start dev server (Expo Go or dev client)
npx expo start --ios    # iOS simulator
npx expo start --android # Android emulator
npx expo start --web    # Web browser
npm run lint            # ESLint
```

## Conventions

- **Path alias**: `@/` maps to the repo root (e.g., `import { Colors } from '@/constants/theme'`)
- **File naming**: kebab-case for all files (e.g., `haptic-tab.tsx`, `use-color-scheme.ts`)
- **Platform splits**: `.ios.tsx` / `.web.ts` suffixes for platform-specific implementations
- **Theming**: Use `useColorScheme()` + `Colors` from `constants/theme.ts`; use `ThemedText`/`ThemedView` components rather than hardcoding colors
- **Icons**: `IconSymbol` wraps SF Symbols (iOS) and MaterialIcons (Android/web)
- **Tabs**: Add new tabs in `app/(tabs)/` and register them in `app/(tabs)/_layout.tsx`
