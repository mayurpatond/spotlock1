# SpotLock - Local Stores & Daily Deals Marketplace

SpotLock is a mobile-first hyper-local marketplace application connecting shoppers with nearby store discounts and coupons, featuring an interactive map and a Tata Play-style prepaid subscription portal for store owners.

---

## 🚀 How to Run in VS Code (Step-by-Step)

You do **NOT** need Expo or Android Studio to run and test this code. It runs with standard **Node.js** and **npm**.

### Prerequisites
Make sure you have **Node.js** (v18 or higher) installed on your laptop:
- Check by opening your terminal and running: `node -v`
- If not installed, download it from [nodejs.org](https://nodejs.org).

---

### Step 1: Open the Project in VS Code
1. Open **VS Code**.
2. Click **File** > **Open Folder...** and select this downloaded folder.

### Step 2: Open the Integrated Terminal
Press ``Ctrl + ` `` (Windows/Linux) or ``Cmd + ` `` (Mac), or go to **Terminal** > **New Terminal** in the top menu.

### Step 3: Install Packages
In the terminal, run:
```bash
npm install
```
This automatically downloads and installs all necessary packages (React, Vite, Express, Tailwind CSS, Drizzle ORM, Lucide icons, Motion, etc.) into `node_modules`.

> **Note if you see an `ERESOLVE` peer dependency error on Windows:** Run:
> ```bash
> npm install --legacy-peer-deps
> ```

### Step 4: Configure Environment Variables
Create a file named `.env` in the root folder (or copy `.env.example`):
```bash
cp .env.example .env
```
*(Note: SpotLock has built-in mock fallback data, so the app will run immediately even before you connect your PostgreSQL database!)*

### Step 5: Start the Development Server
In the terminal, run:
```bash
npm run dev
```

### Step 6: View the App
Open your browser and navigate to:
```text
http://localhost:3000
```
- Click the **"Mobile Frame"** toggle button in the header to view it inside an iPhone/Android chassis, or view in full-width responsive mode.
- Click **"Open on Phone"** to test mobile responsive view.

---

## ❓ Do I Need Expo?

**No, you do NOT need Expo to run this code in VS Code.**

### Why?
This codebase is architected as a **Mobile-First React Full-Stack Web App (PWA)**:
- It runs natively in your browser using Vite + Express.
- It is completely touch-optimized for mobile screens (iOS & Android) with bottom navigation tabs, pull drawers, and responsive cards.

### How to Turn It into an Android APK / iOS App (.apk / .ipa):
If you want to package this exact code into a native mobile app for Google Play Store or Apple App Store, the easiest and standard industry path is **Capacitor** (by Ionic):

```bash
# 1. Build the production web bundle
npm run build

# 2. Install Capacitor
npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios

# 3. Initialize Capacitor
npx cap init SpotLock com.spotlock.app --web-dir=dist

# 4. Add Android platform
npx cap add android

# 5. Open in Android Studio to build your APK
npx cap open android
```

If you strictly want to rewrite it into Expo's native components (`<View>`, `<Text>`, `<TouchableOpacity>` from `react-native`), you can create a new Expo project with `npx create-expo-app SpotLock` and copy over the state logic from `src/context/AppContext.tsx` and types from `src/types/index.ts`. However, for running, viewing, and developing this project on your laptop right now, **no Expo is required**.

---

## 🗄️ Database Setup (Optional)

When you're ready to connect your production PostgreSQL database:
1. Open `.env`
2. Set your `DATABASE_URL`:
   ```bash
   DATABASE_URL="postgres://username:password@host:port/database_name?sslmode=require"
   ```
SpotLock automatically creates all required tables (`users`, `stores`, `subscriptions`, `daily_discounts`, `coupons`, `transactions`, `otp_codes`) upon connecting! See `POSTGRES_SETUP.md` for full details.
