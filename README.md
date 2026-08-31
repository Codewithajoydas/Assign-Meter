# Assign Meter Mobile

A cross-platform mobile application for the **Assign Meter** workforce and meter-management platform.

The application is built with **Expo, React Native, and Expo Router** and is designed to provide field users with a mobile interface for operational meter-management workflows.

The mobile application communicates with the Assign Meter backend and provides native device capabilities such as camera access, location services, secure local storage, file handling, image selection, sharing, and map-based interfaces.

---

## Table of Contents

* [Overview](#overview)
* [Key Features](#key-features)
* [Technology Stack](#technology-stack)
* [Application Architecture](#application-architecture)
* [Project Structure](#project-structure)
* [Navigation](#navigation)
* [Authentication](#authentication)
* [Backend Integration](#backend-integration)
* [Local Storage](#local-storage)
* [Camera and Image Handling](#camera-and-image-handling)
* [Location and Maps](#location-and-maps)
* [File Handling and Sharing](#file-handling-and-sharing)
* [UI and Styling](#ui-and-styling)
* [Device Capabilities](#device-capabilities)
* [Environment Configuration](#environment-configuration)
* [Getting Started](#getting-started)
* [Running the Application](#running-the-application)
* [Android Development](#android-development)
* [iOS Development](#ios-development)
* [Web Development](#web-development)
* [Linting](#linting)
* [Production Builds](#production-builds)
* [Security](#security)
* [Development Guidelines](#development-guidelines)
* [Troubleshooting](#troubleshooting)
* [Future Improvements](#future-improvements)
* [Related Projects](#related-projects)
* [Project Status](#project-status)
* [Author](#author)
* [License](#license)

---

# Overview

Assign Meter Mobile is the mobile client of the Assign Meter platform.

The application is intended to provide field-oriented workflows through Android and iOS devices while sharing the same backend infrastructure as the Assign Meter web application.

The application provides the mobile layer for:

* Authentication
* Meter-related workflows
* Field operations
* Location-aware workflows
* Camera and image capture
* File handling
* Map-based interfaces
* Operational data
* Mobile navigation
* Secure local storage
* Device-specific functionality

The application is built using the Expo ecosystem and uses Expo Router for file-based navigation.

---

# Key Features

## Authentication

The application includes a dedicated authentication route:

```text
app/
└── (auth)/
    └── login.jsx
```

The authentication flow is separated from the main application navigation.

The application can maintain authentication information locally and use it when communicating with the backend.

Authentication should ultimately be validated by the backend for every protected operation.

---

## Field Operations

The mobile application is intended for users who need to perform operational workflows from a mobile device.

Typical workflows can include:

* Viewing assigned work
* Viewing meter information
* Updating operational information
* Working with field data
* Capturing supporting images
* Using the device's location
* Accessing meter-related information while in the field

---

## Meter Management

The application is part of the Assign Meter platform and provides a mobile interface for meter-related workflows.

The mobile application can be used alongside the Assign Meter web application.

The web application is primarily intended for broader management and administrative workflows, while the mobile application provides a device-oriented interface for field operations.

---

## Category-Based Navigation

The project contains a dedicated categories route:

```text
app/
└── categories/
```

This provides a dedicated navigation area for category-based application functionality.

---

# Technology Stack

## Core

| Technology   | Purpose                               |
| ------------ | ------------------------------------- |
| Expo         | React Native development platform     |
| React Native | Cross-platform mobile UI              |
| React        | Component-based UI                    |
| Expo Router  | File-based navigation                 |
| TypeScript   | Type checking and development support |

The current project uses Expo `~54.0.33`, React Native `0.81.5`, React `19.1.0`, and Expo Router `~6.0.23`.

---

## Navigation

| Package                      | Purpose               |
| ---------------------------- | --------------------- |
| Expo Router                  | File-based routing    |
| React Navigation             | Navigation primitives |
| React Navigation Bottom Tabs | Tab navigation        |
| React Navigation Elements    | Navigation UI         |

The project contains both authentication and tab-based route groups.

---

## UI

| Technology                   | Purpose                             |
| ---------------------------- | ----------------------------------- |
| NativeWind                   | Tailwind-style React Native styling |
| React Native Paper           | UI components                       |
| Expo Vector Icons            | Icons                               |
| Expo Symbols                 | Platform symbols                    |
| Expo Linear Gradient         | Gradient UI                         |
| Expo Image                   | Optimized image rendering           |
| React Native Gesture Handler | Gesture interactions                |
| React Native Reanimated      | Animations                          |

---

## Device APIs

The application uses several Expo modules for native device functionality:

| Package             | Purpose              |
| ------------------- | -------------------- |
| `expo-camera`       | Camera access        |
| `expo-image-picker` | Image selection      |
| `expo-location`     | Device location      |
| `expo-device`       | Device information   |
| `expo-haptics`      | Haptic feedback      |
| `expo-file-system`  | File operations      |
| `expo-sharing`      | Native file sharing  |
| `expo-secure-store` | Secure local storage |
| `expo-web-browser`  | Opening web content  |
| `expo-linking`      | Deep links and URLs  |

These dependencies are defined in the project's package manifest.

---

## Maps

The application uses:

```text
react-native-maps
```

for native map interfaces.

Maps can be used for location-aware workflows and displaying geographic information related to field operations.

---

# Application Architecture

At a high level:

```text
                         ┌─────────────────────┐
                         │   Mobile Device     │
                         │                     │
                         │ Android / iOS       │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │   Expo / React      │
                         │      Native         │
                         └──────────┬──────────┘
                                    │
                ┌───────────────────┼───────────────────┐
                │                   │                   │
                ▼                   ▼                   ▼
        ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
        │ Navigation   │    │ Device APIs  │    │ Local State  │
        │              │    │              │    │              │
        │ Expo Router  │    │ Camera       │    │ Secure Store │
        │ Tabs         │    │ Location     │    │ AsyncStorage │
        │ Auth         │    │ Files        │    │              │
        └──────────────┘    └──────────────┘    └──────────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │    Backend API      │
                         │                     │
                         │ Node.js / Express   │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │     Database        │
                         │      MongoDB        │
                         └─────────────────────┘
```

The mobile application is a client. Business-critical authorization and data validation must remain on the backend.

---

# Project Structure

The repository currently follows an Expo Router structure:

```text
Assign-Meter/
│
├── app/
│   ├── (auth)/
│   │   └── login.jsx
│   │
│   ├── (tabs)/
│   │   └── ...
│   │
│   ├── categories/
│   │   └── ...
│   │
│   ├── _layout.jsx
│   └── index.jsx
│
├── assets/
│   └── ...
│
├── components/
│   ├── Table.jsx
│   └── Text.jsx
│
├── .vscode/
│
├── app.json
├── babel.config.js
├── eas.json
├── eslint.config.js
├── index.js
├── metro.config.js
├── package.json
├── package-lock.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

The repository currently contains `app`, `assets`, `components`, Expo configuration, EAS configuration, Metro configuration, Tailwind configuration, and TypeScript configuration.

---

# Application Directory

The `app/` directory is the main application routing layer.

Expo Router uses the filesystem to determine application routes.

Current route groups include:

```text
app/
├── (auth)/
├── (tabs)/
├── categories/
├── _layout.jsx
└── index.jsx
```

---

# Authentication Routes

Authentication routes are grouped under:

```text
app/
└── (auth)/
    └── login.jsx
```

The `(auth)` directory is a route group and does not need to appear as part of the public URL/path structure.

This keeps authentication screens logically separated from authenticated application screens.

---

# Tab Navigation

The project contains:

```text
app/
└── (tabs)/
```

The tab group provides the primary navigation structure for authenticated application functionality.

Tab navigation should be used for high-level sections that users frequently switch between.

---

# Components

Reusable React Native components are stored under:

```text
components/
```

Current shared components include:

```text
components/
├── Table.jsx
└── Text.jsx
```

Reusable components should remain independent from page-specific business logic whenever possible.

---

# Authentication Architecture

A typical authentication flow is:

```text
User
  │
  ▼
Login Screen
  │
  │ credentials
  ▼
Backend API
  │
  │ authentication
  ▼
Access Token / Session
  │
  ▼
Secure Local Storage
  │
  ▼
Authenticated Application
```

For protected API requests:

```text
Mobile App
    │
    │ authenticated request
    ▼
Backend
    │
    ├── Verify token
    ├── Verify user
    ├── Verify permissions
    └── Process request
```

The mobile application must never be treated as the security boundary.

---

# Local Storage

The project includes:

```text
@react-native-async-storage/async-storage
expo-secure-store
```

Use the appropriate storage mechanism based on the sensitivity of the data.

## Secure Store

Use `expo-secure-store` for sensitive information such as authentication credentials or tokens where appropriate.

```text
Sensitive authentication data
        ↓
Secure Store
```

## AsyncStorage

Use AsyncStorage for non-sensitive persistent application state.

Examples:

```text
Preferences
Cached UI state
Non-sensitive configuration
```

Do not use AsyncStorage as a substitute for secure credential storage.

---

# Camera and Image Handling

The application includes:

```text
expo-camera
expo-image-picker
expo-image
```

This provides the foundation for workflows requiring:

* Camera capture
* Image selection
* Image preview
* Field evidence
* Meter-related photographs

A typical workflow is:

```text
User
  │
  ▼
Camera / Gallery
  │
  ▼
Image Selection
  │
  ▼
Preview
  │
  ▼
Validation
  │
  ▼
Upload
  │
  ▼
Backend / Object Storage
```

Large image files should be compressed or resized where appropriate before upload.

---

# Location and Maps

The application includes:

```text
expo-location
react-native-maps
```

These can be used to provide location-aware functionality.

Typical flow:

```text
Device
  │
  ▼
Location Permission
  │
  ▼
GPS Coordinates
  │
  ▼
Application
  │
  ▼
Map / Backend
```

## Location Permissions

The application should:

1. Request permission only when needed.
2. Explain why location access is required.
3. Handle permission denial.
4. Handle location services being disabled.
5. Avoid continuously tracking location unless required.

---

# File Handling and Sharing

The application includes:

```text
expo-file-system
expo-sharing
```

These modules can be used for:

* Creating files
* Reading files
* Temporary file storage
* Exporting application data
* Sharing files through native operating-system interfaces

For large uploads, prefer direct object-storage upload where supported rather than unnecessarily transferring large files through the application server.

---

# UI and Styling

The project uses NativeWind:

```text
nativewind
```

and React Native Paper:

```text
react-native-paper
```

This provides two complementary UI approaches.

## NativeWind

Useful for utility-based styling:

```jsx
<View className="flex-1 p-4">
```

## React Native Paper

Useful for reusable UI components such as:

* Buttons
* Inputs
* Dialogs
* Cards
* Menus
* Navigation components

Avoid mixing styling systems unnecessarily inside the same component.

---

# Device Capabilities

The application has access to several native capabilities.

```text
┌──────────────────────────────┐
│       Mobile Application     │
├──────────────────────────────┤
│ Camera                       │
│ Location                     │
│ Files                        │
│ Images                       │
│ Secure Storage               │
│ Device Information           │
│ Haptics                      │
│ Sharing                      │
│ Web Browser                  │
│ Maps                         │
└──────────────────────────────┘
```

All permissions should be requested only when required.

---

# Environment Configuration

The backend URL and other runtime configuration should not be hard-coded throughout components.

Use a centralized configuration strategy.

For example:

```text
config/
└── environment.js
```

or an equivalent application configuration module.

Example:

```js
const API_URL = "...";
```

The actual production backend URL should be provided through the application's environment/configuration system rather than duplicated throughout the codebase.

---

# Getting Started

## Prerequisites

Install:

* Node.js
* npm
* Expo tooling
* Android Studio for Android development
* Xcode for iOS development on macOS
* A physical device or emulator/simulator

For Expo development, Expo Go can also be used where the application's native dependencies are supported.

---

# Installation

Clone the repository:

```bash
git clone https://github.com/Codewithajoydas/Assign-Meter.git
```

Move into the project:

```bash
cd Assign-Meter
```

Install dependencies:

```bash
npm install
```

The project uses Expo Router as its application entry point:

```json
"main": "expo-router/entry"
```

---

# Running the Application

Start the Expo development server:

```bash
npm start
```

This executes:

```bash
expo start
```

After starting the development server, Expo provides options for running the application on supported platforms.

---

# Android Development

Run:

```bash
npm run android
```

This executes:

```bash
expo run:android
```

Android development requires a configured Android development environment.

---

# iOS Development

Run:

```bash
npm run ios
```

This executes:

```bash
expo run:ios
```

iOS native development requires macOS and Xcode.

---

# Web Development

The project also supports Expo web:

```bash
npm run web
```

This executes:

```bash
expo start --web
```

The primary target of this repository is mobile, so web support should be treated according to the actual compatibility of individual native modules.

---

# Linting

Run:

```bash
npm run lint
```

The project currently uses:

```text
ESLint 9
eslint-config-expo
TypeScript
```

Before committing changes:

```bash
npm run lint
```

---

# Production Builds

The repository includes:

```text
eas.json
```

and:

```text
expo-dev-client
expo-updates
```

indicating that the project is configured for the broader Expo/EAS development and deployment ecosystem.

Production builds should be generated using the project's EAS configuration after verifying:

```text
[ ] Production API URL
[ ] App identifier
[ ] Android configuration
[ ] iOS configuration
[ ] App permissions
[ ] Environment variables
[ ] Backend availability
[ ] Authentication
[ ] File uploads
[ ] Location functionality
[ ] Camera functionality
```

---

# Security

## Authentication Tokens

Authentication tokens must not be logged.

Avoid:

```js
console.log(token);
```

Tokens should be stored using an appropriate secure mechanism.

---

## API Security

Never assume that a user is authorized because the mobile application displays a particular screen.

The backend must verify:

```text
Token
  ↓
User
  ↓
Role
  ↓
Permission
  ↓
Resource
  ↓
Action
```

---

## Sensitive Data

Do not hard-code:

* API secrets
* JWT secrets
* Database credentials
* AWS secret keys
* Private cryptographic keys
* Internal service credentials

inside the mobile application.

Anything bundled into a mobile application should be considered potentially recoverable by a determined user.

---

# Permissions

The application uses device capabilities that require runtime permissions.

Relevant capabilities include:

```text
Camera
Location
File access
Image selection
```

Permissions should be:

* Requested at the correct time.
* Explained clearly.
* Gracefully handled when denied.
* Tested on real devices.

---

# Performance Guidelines

Mobile performance is more sensitive than ordinary web performance.

## Avoid unnecessary re-renders

Be careful with:

* Large lists
* Maps
* Images
* Context providers
* Animation state
* Global state

## Optimize images

Large photographs can consume significant memory.

Prefer:

```text
Capture
  ↓
Resize / Compress
  ↓
Upload
```

rather than uploading unnecessarily large images.

## Optimize lists

For large datasets, use virtualized list components and avoid rendering thousands of records simultaneously.

---

# Development Guidelines

## Keep Screens Focused

Avoid putting all logic inside one screen.

Prefer:

```text
Screen
 ├── UI Component
 ├── Custom Hook
 ├── API Service
 ├── Utility
 └── State
```

rather than:

```text
HugeScreen.jsx
 ├── API
 ├── Validation
 ├── Navigation
 ├── Storage
 ├── Camera
 ├── UI
 └── Business Logic
```

---

## Centralize API Requests

Avoid scattering backend URLs and request logic throughout screens.

Prefer:

```text
services/
└── api/
    ├── auth.js
    ├── meters.js
    ├── assignments.js
    └── users.js
```

This makes backend changes easier to manage.

---

## Keep Device Logic Separate

Camera, location, file-system, and secure-storage operations should preferably be isolated behind reusable utilities or hooks.

For example:

```text
hooks/
├── useLocation.js
├── useCamera.js
└── useAuth.js
```

This prevents device-specific logic from being duplicated across screens.

---

# Troubleshooting

## Expo server does not start

Try:

```bash
npm install
npm start
```

Then clear the Metro cache if necessary:

```bash
npx expo start -c
```

---

## Android build fails

Check:

```text
Android SDK
Java version
Android Studio
Gradle
Expo SDK compatibility
Native dependencies
```

Then try:

```bash
npx expo doctor
```

---

## iOS build fails

Check:

```text
macOS
Xcode
CocoaPods
iOS deployment target
Expo SDK compatibility
```

---

## Camera does not work

Check:

```text
Camera permission
Physical device
App configuration
Native build
```

Camera functionality may not behave identically inside every development environment.

---

## Location does not work

Check:

```text
Location permission
Device GPS
Location services
Physical device
Application configuration
```

---

## API requests fail

Check:

```text
1. Backend is running
2. API URL is correct
3. Device can reach backend
4. Authentication is valid
5. Backend CORS/network configuration
6. HTTP/HTTPS configuration
7. Firewall/network restrictions
```

Remember that:

```text
localhost
```

from an Android/iOS device does not necessarily refer to the development computer.

---

# Recommended Production Checklist

## Application

* [ ] Authentication tested
* [ ] Navigation tested
* [ ] All critical workflows tested
* [ ] No debug logs
* [ ] No hard-coded secrets
* [ ] No unnecessary dependencies

## Authentication

* [ ] Secure token storage
* [ ] Logout clears credentials
* [ ] Expired token handled
* [ ] Backend authorization verified

## Device

* [ ] Camera permissions tested
* [ ] Location permissions tested
* [ ] File operations tested
* [ ] Image selection tested
* [ ] Sharing tested
* [ ] Physical-device testing completed

## Performance

* [ ] Large lists optimized
* [ ] Images compressed
* [ ] Maps optimized
* [ ] Unnecessary renders removed
* [ ] Network requests minimized

## Deployment

* [ ] Production backend configured
* [ ] Android build tested
* [ ] iOS build tested
* [ ] EAS configuration verified
* [ ] App permissions reviewed
* [ ] Production authentication tested

---

# Future Improvements

## Architecture

* Centralized API client
* Dedicated authentication service
* Custom authentication hook
* Centralized application configuration
* Shared API error handling
* Better state management boundaries

## Offline Support

For field users, offline support can significantly improve reliability.

Potential architecture:

```text
             ┌───────────────┐
             │ Mobile Device │
             └───────┬───────┘
                     │
              ┌──────▼──────┐
              │ Local Store │
              └──────┬──────┘
                     │
              ┌──────▼──────┐
              │ Sync Queue  │
              └──────┬──────┘
                     │
                  Network
                     │
              ┌──────▼──────┐
              │   Backend   │
              └─────────────┘
```

This would be particularly valuable for field operations where network connectivity may be unreliable.

## Additional Improvements

* Push notifications
* Offline-first workflows
* Background synchronization
* Upload retry mechanisms
* Upload progress indicators
* Better error reporting
* Crash reporting
* Automated mobile testing
* CI/CD with EAS
* Role-based navigation
* Better accessibility
* Localization

---

# Related Projects

## Assign Meter Web

The web application provides the browser-based interface for the Assign Meter platform.

Repository:

https://github.com/Codewithajoydas/Assign-Meter-Web

---

## Assign Meter Backend

The backend provides the central API and business logic used by the mobile and web applications.

Repository:

https://github.com/Codewithajoydas/Assign-Meter-Backend

---

# Overall Platform Architecture

The Assign Meter platform consists of multiple clients connected to a common backend:

```text
                    ┌──────────────────────┐
                    │       Users          │
                    └──────────┬───────────┘
                               │
               ┌───────────────┼────────────────┐
               │               │                │
               ▼               ▼                ▼
       ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
       │ Assign Meter │ │ Assign Meter │ │ Other Client │
       │     Web      │ │    Mobile    │ │              │
       │   Next.js    │ │ Expo/RN      │ │              │
       └──────┬───────┘ └──────┬───────┘ └──────┬───────┘
              │                │                │
              └────────────────┼────────────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   Assign Meter API   │
                    │   Node.js / Express  │
                    └──────────┬───────────┘
                               │
                 ┌─────────────┼─────────────┐
                 │             │             │
                 ▼             ▼             ▼
             MongoDB        AWS S3       Notifications
```

This separation allows the mobile and web applications to share backend business logic while providing platform-specific user experiences.

---

# Project Status

Assign Meter Mobile is an actively developed application.

The current repository is structured as an Expo application using Expo Router and contains authentication, tab navigation, category routes, reusable components, native device integrations, maps, secure storage, file handling, and other mobile capabilities.

The project should be treated as part of the broader Assign Meter platform rather than as an isolated mobile application.

---

# Repository

GitHub:

https://github.com/Codewithajoydas/Assign-Meter

The repository is currently public and contains the Expo application source code.

---

# Author

**Ajoy Das**

GitHub:

https://github.com/Codewithajoydas

---

# License

No explicit open-source license is currently declared in the repository.

If this project is intended to be publicly distributed, add an appropriate `LICENSE` file and update this section accordingly.
