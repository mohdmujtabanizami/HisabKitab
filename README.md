<div align="center">

# 📓 HisabKitab — Ultimate Financial Pro Tracker

**Your all-in-one, offline-ready personal finance companion.**

Track budgets, log expenses by voice, scan bills with OCR, and sync everything across every device — instantly.

[![Live Demo](https://img.shields.io/badge/🟢%20Live-hisab--kitab--iota--one.vercel.app-brightgreen?style=for-the-badge)](https://hisab-kitab-iota-one.vercel.app)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![React](https://img.shields.io/badge/React-Vite-61DAFB?logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript&logoColor=black)
![Firebase](https://img.shields.io/badge/Firebase-Auth%20%26%20Realtime%20DB-FFCA28?logo=firebase&logoColor=black)
![Tesseract.js](https://img.shields.io/badge/OCR-Tesseract.js-4B8BBE)
![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8?logo=pwa&logoColor=white)
![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?logo=vercel&logoColor=white)

**[🚀 Try it Live →](https://hisab-kitab-iota-one.vercel.app)** · [🐛 Report a Bug](https://github.com/mohdmujtabanizami/HisabKitab/issues) · [✨ Request a Feature](https://github.com/mohdmujtabanizami/HisabKitab/issues)

</div>

---

## 📌 About the Project

**HisabKitab** is a comprehensive financial tracking application designed to help users seamlessly manage monthly budgets, daily expenditures, recurring subscriptions, and savings targets — all in a single, responsive interface.

It goes beyond a typical expense tracker with **real-time cross-device cloud sync**, **voice-powered expense logging**, **itemized OCR bill scanning**, and an **offline-ready persistent storage** mechanism — so your data is always available, online or off.

The project is split into a **React (Vite) frontend** and a **Node.js backend** that exposes the ledger data model, with **Firebase** handling authentication and real-time sync on the client side.

> 🟢 **Live now:** [hisab-kitab-iota-one.vercel.app](https://hisab-kitab-iota-one.vercel.app) — no install needed, just open it in your browser.

---

## ✨ Features

### 🔥 Real-Time Cross-Device Cloud Sync
Sign in with your Google/Gmail account via Firebase to sync your financial ledger, budgets, and notes instantly across every phone and computer you use.

### 🎙️ Voice-Powered Expense Logging
Dictate expenses naturally using native speech recognition — e.g. *"40 ka dudh aur 20 ki shakkar"* — and let the smart parser automatically extract valid amounts and formats.

### 📷 Itemized OCR Bill Scanner
Powered by **Tesseract.js**, scan physical receipts or invoices to automatically isolate item descriptions and prices, mapping them directly into your daily logs with intelligent fallback handling.

### 💼 Monthly Fixed Budget & Payment Tagging
Manage recurring overhead with auto-assigned emojis based on category names, plus granular payment-mode tagging:
- 💵 Cash
- 📲 UPI / GPay
- 💳 Credit Card

### 📝 Next 2 Months Notepad
Jot down upcoming financial strategies, anticipated bills, or reminders for the following two months, with automatic local caching and cloud backup.

### 🎯 Goal-Based Savings Planner
Define custom savings goals (a new laptop, a trip, etc.) and track real-time progress as a percentage against your remaining balance.

### 🌐 Multilingual & RTL Support
Fully localized with dynamic Right-to-Left layout switching:
- 🇬🇧 English
- 🇮🇳 Hindi (हिंदी)
- 🇵🇰 Urdu (اردو)

### 🔒 Extra Touches
- 4-digit PIN app lock
- Dark UI theme via CSS custom properties
- Fully responsive design (Flexbox & Grid)
- Installable as a Progressive Web App (PWA)

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React (Vite) · JavaScript (ES6+/JSX) · CSS3 (Variables, Flexbox/Grid) |
| **Backend** | Node.js · Express-style server (`index.js`) · Ledger data model |
| **Cloud & Auth** | Firebase Auth (Google Sign-In) · Firebase Realtime Database |
| **AI & OCR** | Tesseract.js (OCR) · Web Speech API (voice input) |
| **Persistence** | `db.js` (local/offline data layer) + Firebase for cloud redundancy |
| **PWA** | Service worker (`sw.js`) · Web app manifest |
| **Deployment** | [Vercel](https://vercel.com) |

---

## 🎯 Project Highlights

| Feature | Technology / Implementation |
|---|---|
| 🔒 App Security | 4-Digit PIN Lock |
| ☁️ Cloud Sync | Firebase Realtime Database (`firebase.js`) |
| 🎙️ Voice Logging | Web Speech API |
| 📷 OCR Scanning | Tesseract.js |
| 🌐 Localization | Multi-language & RTL support |
| 📱 Responsive Design | CSS Flexbox & Grid |
| 🌙 Dark UI Theme | CSS Custom Properties |

---

## 📂 Project Structure

```
HisabKitab/
│
├── backend/
│   ├── models/
│   │   └── Ledger.js         # Mongoose/data model for ledger entries
│   ├── node_modules/
│   ├── .env                  # Backend environment variables (not committed)
│   ├── index.js               # Server entry point / API routes
│   ├── package.json
│   └── package-lock.json
│
└── frontend/
    ├── node_modules/
    ├── public/
    │   ├── favicon.svg
    │   ├── icon-192.png
    │   ├── icon-512.png
    │   ├── icons.svg
    │   ├── manifest.json      # PWA manifest
    │   └── sw.js               # Service worker
    ├── src/
    │   ├── assets/
    │   │   ├── hero.png
    │   │   ├── react.svg
    │   │   └── vite.svg
    │   ├── App.jsx             # Root React component
    │   ├── db.js                # Local/offline data layer
    │   ├── firebase.js          # Firebase config & init
    │   ├── index.css
    │   └── main.jsx             # React entry point
    ├── .gitignore
    ├── eslint.config.js
    ├── index.html
    ├── package.json
    ├── package-lock.json
    ├── README.md
    └── vite.config.js
```

---

## 🚀 Live Demo & Repository

| | |
|---|---|
| 🌐 **Live App** | [hisab-kitab-iota-one.vercel.app](https://hisab-kitab-iota-one.vercel.app) |
| 🔗 **GitHub Repository** | [github.com/mohdmujtabanizami/HisabKitab](https://github.com/mohdmujtabanizami/HisabKitab) |
| ☁️ **Hosting** | Vercel (frontend, auto-deployed) |

---

## 💻 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/mohdmujtabanizami/HisabKitab.git
cd HisabKitab
```

### 2. Set up the backend
```bash
cd backend
npm install
```

Create a `.env` file inside `backend/` with your server configuration, e.g.:
```env
PORT=5000
DATABASE_URL=your_database_connection_string
```

Start the backend server:
```bash
node index.js
```

### 3. Set up the frontend
```bash
cd ../frontend
npm install
```

Open `src/firebase.js` and replace the placeholder config with your own keys from the [Firebase Console](https://console.firebase.google.com):

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    databaseURL: "YOUR_DATABASE_URL",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

Start the frontend dev server:
```bash
npm run dev
```

Your app will now be running locally with full sync, OCR, and voice-logging capability (given valid Firebase credentials, a running backend, and browser permissions for mic/camera).

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 👨‍💻 Author

**Mohd Mujtaba Nizami (MJ)**
Computer Science Engineering Student | Full Stack Developer

- 📧 Email: [nizamimujtaba391@gmail.com](mailto:nizamimujtaba391@gmail.com)
- 🔗 GitHub: [@mohdmujtabanizami](https://github.com/mohdmujtabanizami)
- 📍 New Delhi, India


---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
<div align="center">

If you found this project useful, consider giving it a ⭐ on GitHub!

</div>
