Got it ✅ — here’s a complete **README.md** you can copy-paste directly into your project.
It’s tailored for your **Capital Distance Finder** app, includes sections about running locally, features, tests, design notes, dataset, AI usage, and license.

---

````markdown
# 🌍 Capital Distance Finder

A full-stack web application to calculate and visualize distances between country capitals using the **Haversine formula**.  
Built with **Next.js, TypeScript, TailwindCSS, and Leaflet**.

---

## 🎯 Challenge Overview

This project is my submission for the **Zifala Full Stack Challenge**.  
The goal was to build an end-to-end application that:

- Given a list of countries, returns all unique country pairs sorted by shortest distance between their capitals.  
- Example: `["SO", "KE", "ET", "DJ"]` → `["DJ", "SO"] -> 1165.4 km`.  
- Deliver API, Frontend, Deployment, Tests, and Realtime streaming.

---

## 🚀 Live Deployment

- **App:** [Deployed on Vercel](https://your-vercel-url.vercel.app)  
- **API Base:** `https://your-vercel-url.vercel.app/api`

---

## 📊 Project Status

✅ **Challenge Complete** – all requirements implemented and deployed.

- ✅ API with endpoints (`/api/countries`, `/api/distances`, `/api/distances/stream`)  
- ✅ Frontend with real-time updates  
- ✅ Deployment on Vercel  
- ✅ Unit tests for Haversine + API  
- ✅ Live progress via **Server-Sent Events (SSE)**  
- ✅ Bonus: **Map view**, **CSV upload**, **CSV download**  

---

## 🚀 Features

- **Multi-Country Selection**: Choose from up to 250 countries  
- **Real-Time Streaming**: Distances stream progressively using SSE  
- **Interactive Map View**: Visualize top 20 shortest capital-to-capital distances  
- **CSV Export**: Download results for analysis  
- **CSV Upload**: Provide your own custom list of countries + coordinates  
- **Progress Bar**: See computation progress live  
- **Performance Optimized**: Efficient handling of 31,125 pairs (250 countries)

---

## 📋 Prerequisites

- Node.js **18+**  
- npm or yarn  
- Modern browser (Chrome, Firefox, Edge, Safari)

---

## 🛠️ How to Run Locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/salmamokhtaar/zifala-fullstack-challenge.git
   cd zifala-fullstack-challenge
````

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

   App available at: `http://localhost:3000`

4. **Build for production**

   ```bash
   npm run build
   npm start
   ```

---

## 🧪 How to Run Tests

Run unit + API tests:

```bash
npm test
```

* **Unit Tests**: Haversine formula, pair generation
* **API Tests**: Validation, sorting
* **Integration Test**: Example with 4 countries

---

## 🎨 Design Notes

### Architecture Choices

* **Next.js (App Router)** – for API routes and frontend in one project
* **TypeScript** – type safety and reliability
* **TailwindCSS** – fast, consistent styling
* **Leaflet (via React-Leaflet)** – interactive map visualization
* **SSE (Server-Sent Events)** – lightweight realtime streaming

### Data Source

* **Custom JSON dataset** of \~250 countries
* Contains: ISO2 code, country name, capital, latitude, longitude
* Distance calculated between capitals using **Haversine formula**
* **Limitations**: Only capital cities, not subdivisions or regions

### Performance

* Complexity: **O(n²)** (31,125 pairs for 250 countries)
* Optimized with:

  * Streaming results in batches
  * Progress bar to avoid UI blocking
  * Map limited to **top 20 shortest pairs** for clarity

---

## 🤖 AI Usage

I used **AI (ChatGPT)** during development for:

* 🚀 **Project setup help** (Next.js + TypeScript best practices)
* 📝 **Generating starter code** (API routes, SSE streaming boilerplate)
* 🎨 **UI refinements** (Tailwind styling, button layouts, table improvements)
* 🧪 **Test cases** (unit + integration test scaffolding)
* 🐞 **Debugging** (hydration errors, TypeScript type fixes)

**Why AI was helpful:**
It accelerated repetitive setup, suggested optimizations, and let me focus on core logic & design decisions.

---

## ⏱️ Time Complexity

* **Pairs generation**: `O(n²)`
* **Total pairs**: `n * (n - 1) / 2`

  * Example: 250 countries → 31,125 pairs

Performance metrics:

| Countries | Pairs  | Time   | Memory |
| --------- | ------ | ------ | ------ |
| 10        | 45     | <1s    | \~1MB  |
| 100       | 4,950  | 3–5s   | \~15MB |
| 250       | 31,125 | 15–25s | \~75MB |

---

## 📂 Folder Structure

```
/app
  /api
    /countries
    /distances
    /distances/stream
  /components
    CountrySelector.tsx
    ProgressBar.tsx
    ResultsTable.tsx
    DownloadCSV.tsx
    UploadCSV.tsx
    MapView.tsx
/lib
  dataset.ts
  geo.ts
  util.ts
/public
  sample-capitals.csv
```

---

## 📄 License

MIT © 2025 — Salma Mokhtaar

This project is open source under the **MIT License**, meaning:

* ✅ Free to use, copy, modify, share (even commercially)
* ✅ Must include credit (license + copyright)
* ❌ No liability if it breaks or causes issues

---

## ✅ Challenge Complete

All requirements of the **Zifala Full Stack Challenge** were implemented:

* API
* Frontend
* Deployment
* Tests
* Live streaming
* Bonus features (Map View, CSV Upload/Download)

