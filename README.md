# 🎮 Project Psyco: Momo & Lian (Dhaka Retro Edition)

[![Release](https://img.shields.io/badge/Release-v2.0.0-00ff41?style=for-the-badge)](https://github.com/MevrickNeal/project-psyco/releases)
[![Engine](https://img.shields.io/badge/Engine-Phaser%203.55%20(Offline)-ff007f?style=for-the-badge)](https://phaser.io)
[![Audio](https://img.shields.io/badge/Audio-Web%20Audio%208--Bit%20Synth-ffcc00?style=for-the-badge)](audio.js)
[![Platform](https://img.shields.io/badge/Platform-Web%20%7C%20Android%20APK%20%7C%20PWA-00bfff?style=for-the-badge)](BUILD_APK_GUIDE.md)

A comedy retro 2D narrative adventure game set across the real streets of **Dhaka, Bangladesh**. Journey **14.2 km** from Mirpur-10 to Gulshan-2 in under 5 minutes to apologize to Momo before she blocks you forever!

---

## 📖 The Storyline

**3:00 AM — Mirpur 10, Dhaka.**  
Lian (the boyfriend / "Good Dad") is startled by a sudden notification:

> 📱 **MOMO:** *"I HATE YOU. DO NOT CALL ME."*

Realizing the relationship is in critical danger, Lian has exactly **5 minutes (300 seconds)** to escape his home, navigate Dhaka's night rush hour, collect gifts, bargain with a Pathao rider, dodge crazy traffic on Hatirjheel Expressway, reach Momo's balcony in Gulshan 2, neutralize her rage, and propose!

---

## 🗺️ Real-World Dhaka Landmarks & Route (14.2 KM)

| Checkpoint | Distance | Landmark | Objective & Dhaka Scenario |
|:---|:---:|:---|:---|
| **1. Mirpur 10** | `0.0 km` | Benarasi Palli & Stadium | Sneak past Baba's flashlight patrol in the living room, find the front door keys, and escape into the night. |
| **2. Rokeya Sarani** | `2.5 km` | Agargaon Metro Station (MRT Line 6) | Sprint under the elevated metrorail viaduct. Jump over sleeping street dogs and solve engineering paperwork thrown by the boss. |
| **3. Crescent Lake** | `5.1 km` | Jatiya Sangsad Bhaban (National Parliament) | Free-movement collection round. Collect 10 fresh roses/flowers & chocolates for Momo by Crescent Lake, then board the Poristhan Bus. |
| **4. Farmgate** | `7.8 km` | Farmgate & Bijoy Sarani Intersection | Top-down highway driving in the legendary Poristhan Bus. Steer through traffic. Bus stalls in Farmgate jam -> **Momo blocks you!** |
| **5. Mohakhali Flyover** | `9.5 km` | Amtoli & Flyover Entrance | Urgent street negotiation! Bargain with a Pathao motorcycle rider in authentic Banglish (*"Mama 130 taka dibo!"*). |
| **6. Hatirjheel Expressway** | `12.0 km` | Hatirjheel Lake Loop & Police Plaza | High-speed night motorcycle rush! Weave between CNG auto-rickshaws and potholes (*"Bhanga Rasta"*). Real GPS distance counter ticks to 0. |
| **7. Gulshan 2** | `14.2 km` | Momo's Residence & Lake Park | **The Boss Battle:** Angry Momo attacks with fireballs and laser beams. Shoot love hearts to lower her anger and answer tricky relationship traps! |
| **Finale** | `14.2 km` | Proposal & Victory Celebration | Momo turns happy! Answer the ultimate question: *"Will you be my forever?"* with celebratory chiptune fanfare & fireworks. |

---

## 🕹️ Controls

The game features automatic detection for both **Desktop Keyboard** and **Mobile Touchscreens**:

### 💻 Desktop Keyboard
- **Move / Steer**: `Arrow Keys` or `W`, `A`, `S`, `D`
- **Jump / Action A**: `Spacebar` / `Up Arrow` / `W` (Fires Love Hearts in Boss Battle)
- **Duck / Action B / Nitro Boost**: `Down Arrow` / `S` / `Shift`
- **Skip Protocol**: Press `O` on keyboard during evaluation quiz to jump straight to the 3:00 AM rush.

### 📱 Mobile Touch Controls
- **Virtual D-Pad (Left)**: Smooth responsive 4-direction directional pad with visual touch glow and haptic vibration (`navigator.vibrate`).
- **Action A Button (Right)**: Jump / Collect / Shoot Love Hearts.
- **Action B Button (Right)**: Slide / Duck / Nitro Turbo Boost.
- **Top Toolbar**: 🔊 Mute/Unmute audio and ⛶ Fullscreen toggle.

---

## 🚀 How to Play

### Option 1: 1-Click Play on Laptop (Recommended)
1. Double-click [`start_game.bat`](start_game.bat).
2. The game starts instantly at `http://localhost:8080` in your default browser.

### Option 2: 1-Tap Offline App on Android Phone (Dedicated App)
1. Run `start_game.bat` on your laptop.
2. Note the yellow local IP address shown (e.g., `http://192.168.1.5:8080`).
3. Connect your Android phone to the same Wi-Fi (or your laptop's Mobile Hotspot).
4. Open Chrome on your phone and navigate to `http://<laptop-ip>:8080`.
5. Tap Chrome's menu (`⋮`) and tap **"Install App"** (or **"Add to Home Screen"**).
6. **Done!** The game installs directly as a fullscreen offline app on your phone with custom launcher icon, 0 latency, and no address bar!

### Option 3: GitHub Pages (Instant Global Play)
1. Go to your repository settings on GitHub: [github.com/MevrickNeal/project-psyco](https://github.com/MevrickNeal/project-psyco)
2. Click **Pages** in the left sidebar.
3. Under **Branch**, select `main` and save.
4. Your game is immediately live at:  
   👉 **`https://mevrickneal.github.io/project-psyco/`**

---

## 📦 Dedicated Android Studio APK Project

A complete, pre-configured native Android application is included in:
[`android-apk-project/`](android-apk-project/)

- Pre-synced offline assets in `app/src/main/assets/`
- Fullscreen immersive `MainActivity.java` with hardware acceleration enabled
- Android 5.0 (API 21) to Android 14 (API 34) support
- Open `android-apk-project/` in Android Studio and click **Build > Build APK(s)** to generate `app-debug.apk` anytime. Full instructions in [`BUILD_APK_GUIDE.md`](BUILD_APK_GUIDE.md).

---

## ⚙️ Architecture & Technical Highlights

- **100% Offline Capability**: Built-in [`phaser.min.js`](phaser.min.js), Service Worker cache ([`sw.js`](sw.js)), and Web App Manifest ([`manifest.json`](manifest.json)).
- **Synthesized Retro Audio Engine ([`audio.js`](audio.js))**: Zero external MP3 downloads. A pure Web Audio API oscillator synthesizer generating square, sawtooth, and triangle retro sound effects and melodic chiptunes.
- **Cyberpunk Dialog Modals**: Completely removed blocking browser `alert()` and `prompt()` dialogs, replacing them with animated in-canvas terminal dialogs that never break mobile fullscreen.
- **Smooth 60 FPS Viewport**: Scaled at `960x540` 16:9 widescreen with `Phaser.Scale.FIT`, fitting modern high-refresh rate mobile screens without distortion or letterbox clipping.

---

## 📜 Credits

- **Story & Code**: Lian Mollick ([@MevrickNeal](https://github.com/MevrickNeal))
- **Dedicated to**: Momo 💖
- **Built with**: 💚 in Dhaka, Bangladesh
