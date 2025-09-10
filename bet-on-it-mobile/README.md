# Bet On It - Mobile App

A React Native mobile application for social betting on events like weddings, parties, and sports gatherings.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for iOS development)
- Android Studio/Emulator (for Android development)
- Expo Go app on your physical device

### Installation

1. Navigate to the mobile app directory:
```bash
cd bet-on-it-mobile
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Run on your preferred platform:
```bash
# iOS Simulator
npm run ios

# Android Emulator
npm run android

# Web browser
npm run web
```

### Testing on Physical Device

1. Install Expo Go from the App Store (iOS) or Google Play Store (Android)
2. Scan the QR code displayed in your terminal or browser
3. The app will load on your device

## 📱 Features

- **Native Navigation**: Bottom tabs with stack navigation
- **Responsive Design**: Optimized for both iOS and Android
- **Real-time Updates**: Live betting pools and odds
- **Social Sharing**: Share events with native share functionality
- **Offline Support**: Core functionality works offline
- **Push Notifications**: Event reminders and results (coming soon)

## 🏗️ Architecture

- **React Navigation**: Native navigation patterns
- **Context API**: State management for authentication
- **Expo Vector Icons**: Consistent iconography
- **Linear Gradients**: Beautiful visual effects
- **Safe Area Context**: Proper handling of device safe areas

## 🎨 Design System

- **Colors**: Consistent with web app (primary blue, accent purple)
- **Typography**: Native font scaling and accessibility
- **Components**: Reusable UI components
- **Animations**: Smooth transitions and micro-interactions

## 📦 Build & Deploy

### Development Build
```bash
expo build:android
expo build:ios
```

### Production Build
```bash
# Android APK
expo build:android -t apk

# iOS IPA
expo build:ios -t archive
```

### App Store Deployment
```bash
# Submit to App Store
expo submit:ios

# Submit to Google Play
expo submit:android
```

## 🔧 Configuration

Update `app.json` for:
- App name and description
- Bundle identifiers
- App icons and splash screens
- Permissions and capabilities

## 🚨 Important Notes

- This app does NOT process payments
- All bet settlements happen outside the app
- Users must be 18+ to participate
- Complies with app store gambling policies

## 📄 License

MIT License - see LICENSE file for details