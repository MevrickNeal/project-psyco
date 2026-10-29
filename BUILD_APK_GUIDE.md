# 📱 DEDICATED ANDROID APK & OFFLINE EXPERIENCE GUIDE

This guide provides two easy ways to experience **Project Psyco: Momo & Lian** offline on your mobile phone.

---

## ⚡ METHOD 1: 1-Tap Native Android Install (Instant & Zero Setup)
*No Android SDK or Android Studio required!*

Modern Android (Chrome, Samsung Internet, Edge) includes **WebAPK technology** which automatically converts the offline PWA into a real native Android application installed directly into your app drawer:

1. Connect your Android phone to the same Wi-Fi as your laptop (or turn on your laptop's Mobile Hotspot).
2. Double-click `start_game.bat` on your laptop.
3. Note the yellow URL shown in the console (e.g. `http://192.168.1.5:8080`).
4. On your phone, open Chrome and navigate to that address.
5. Tap the three dots menu (⋮) in Chrome and select **"Install App"** (or **"Add to Home Screen"**).
6. **Done!** The game is now installed as a dedicated offline app on your phone with:
   - Dedicated icon on your home screen & app drawer
   - Fullscreen immersive mode (no browser address bar)
   - Real-time touch virtual D-Pad & Action buttons
   - 100% offline cache (works on airplane mode without internet!)

---

## 🛠️ METHOD 2: Compile Standalone `.apk` File via Android Studio
A pre-configured native Android project is provided in:
`android-apk-project/`

### Steps:
1. Open **Android Studio**.
2. Select **Open** and select the `android-apk-project` directory.
3. Wait for Gradle sync to complete (all web assets are pre-synced in `app/src/main/assets/`).
4. In the top menu, click **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
5. Once compiled, click **locate** to find:
   `android-apk-project/app/build/outputs/apk/debug/app-debug.apk`
6. Transfer `app-debug.apk` to your phone via USB cable, Google Drive, or Bluetooth and install it!

---

## 🚀 PUSHING TO GITHUB PAGES FOR GLOBAL 1-CLICK ACCESS
Since your repository is at `https://github.com/MevrickNeal/project-psyco`:
1. Push these updated files to your repo's `main` branch.
2. In your GitHub repo settings, go to **Pages** > Select `Branch: main` > Save.
3. Your game will be live globally at:
   `https://mevrickneal.github.io/project-psyco/`
4. Anyone on Android can visit that URL, tap **"Install App"**, and enjoy the dedicated offline app anywhere!
