# EntryPoint App

A React Native mobile application for smart building management and access control.

## 🚀 Technologies

### Core
- React Native v19.0.0
- TypeScript v5.0.4
- React Navigation v7.x
  - Drawer Navigation
  - Stack Navigation
  - Native Navigation

### State Management & Data Persistence
- Redux Toolkit
- Redux Persist
- MMKV Storage

### UI/UX
- React Native Paper
- React Native Vector Icons
- React Native Reanimated
- React Native Gesture Handler
- React Native Toast Message
- React Native Safe Area Context

### Features & Integrations
- QR Code Scanner
- Maps Integration
- Camera Support
- File System Operations
- Date Picker
- Async Storage

## 📱 Features

- User Authentication (Login/Register)
- Building Management
- QR Code Based Access Control
- Profile Management
- Plan Management
- Real-time Notifications
- Offline Data Support
- Google Sign-in Integration
- Location Services

## 🛠 Prerequisites

- Node.js >= 18
- Ruby >= 2.6.10 (for iOS development)
- CocoaPods (for iOS development)
- Android Studio (for Android development)
- Xcode (for iOS development)
- React Native CLI

## 🚀 Getting Started

1. **Clone the repository**
```bash
git clone [repository-url]
cd EntryPoint-App
```

2. **Install dependencies**
```bash
# Install JavaScript dependencies
npm install
# or
yarn install

# Install iOS dependencies (iOS development only)
cd ios
bundle install
bundle exec pod install
cd ..
```

3. **Start the development server**
```bash
npm start
# or
yarn start
```

4. **Run the application**

For Android:
```bash
npm run android
# or
yarn android
```

For iOS:
```bash
npm run ios
# or
yarn ios
```

## 📁 Project Structure

```

## 🔧 Configuration

- Environment variables can be configured in `src/config/api.ts`
- Theme colors can be modified in `src/theme/colors.ts`
- Storage configuration in `src/config/storage.ts`

## 🔒 Security Features

- Encrypted storage using MMKV
- Secure token management
- API endpoint security
- Input validation and sanitization

## 🧪 Testing

```bash
npm test
# or
yarn test
```

## 📦 Building for Production

### Android
```bash
cd android
./gradlew assembleRelease
```

### iOS
Build through Xcode with Release configuration

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details

## 👥 Support

For support, email [support@entrypoint-app.com](mailto:support@entrypoint-app.com)