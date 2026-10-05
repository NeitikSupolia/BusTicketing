# 🚌 NexaBus Express - Luxury Bus Ticket Web Application

An ultra-modern, high-performance web application for booking luxury intercity coach buses, featuring interactive 2-deck seat selection, real-time fare calculation, promo coupon engine, live GPS telemetry radar, and printable official boarding passes.

---

## 🛠️ System Requirements & What Was Installed

To build and run this application, the following requirements were installed and configured on your Windows system:

1. **Node.js (LTS Version 24.19.0)**
   - Installed using Windows Package Manager (`winget install OpenJS.NodeJS.LTS`).
   - Automatically added to your Machine System PATH (`C:\Program Files\nodejs\`).
2. **npm (Version 11.17.0)**
   - Node Package Manager configured and ready.
3. **PowerShell Execution Policy**
   - Configured `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser` to allow seamless script and dev tool execution.
4. **Python 3.11.9** (Already available on your system as an alternative local web server).
5. **Modern Web Browser** (Microsoft Edge, Google Chrome, Opera, etc.).

---

## 🚀 How to Run the Application

The dev server is currently running at:
👉 **[http://localhost:3000](http://localhost:3000)**

If you ever want to restart or launch the application manually in the future:

### Option 1: Using Node.js (Recommended)
Open a terminal in this folder (`c:\Users\Neitik Supolia\OneDrive\Desktop\Vibecoding`) and run:
```powershell
npm start
```
*or directly:*
```powershell
node server.js
```

### Option 2: Using Python
```powershell
python -m http.server 3000
```

---

## ✨ Features & Architecture

### 1. 🌍 Global Country & Region Picker (Worldwide Support)
- **Automatic / Interactive Country Selection**: When visitors open the website, they are presented with a selection of 10 global regions or can click the country selector in the navigation bar anytime.
- **Supported Countries**:
  - 🇺🇸 **United States**: New York, Boston, Washington DC, Philadelphia, Chicago, San Francisco, Los Angeles, Las Vegas, Detroit (USD $)
  - 🇮🇳 **India**: Mumbai, Pune, Goa, Delhi, Jaipur, Bengaluru, Chennai, Hyderabad, Ahmedabad (INR ₹)
  - 🇬🇧 **United Kingdom**: London, Manchester, Edinburgh, Birmingham, Bristol, Glasgow, Liverpool, Oxford (GBP £)
  - 🇩🇪 **Germany**: Berlin, Munich, Frankfurt, Hamburg, Cologne, Stuttgart, Hannover (EUR €)
  - 🇫🇷 **France**: Paris, Lyon, Marseille, Bordeaux, Nice, Lille, Toulouse (EUR €)
  - 🇨🇦 **Canada**: Toronto, Montreal, Ottawa, Quebec City, Vancouver, Calgary, Edmonton (CAD C$)
  - 🇦🇺 **Australia**: Sydney, Melbourne, Canberra, Brisbane, Gold Coast, Adelaide (AUD A$)
  - 🇯🇵 **Japan**: Tokyo, Osaka, Kyoto, Nagoya, Hiroshima, Fukuoka (JPY ¥)
  - 🇦🇪 **United Arab Emirates**: Dubai, Abu Dhabi, Sharjah, Al Ain, Ras Al Khaimah, Fujairah (AED د.إ)
  - 🇧🇷 **Brazil**: São Paulo, Rio de Janeiro, Curitiba, Belo Horizonte, Florianópolis, Brasília (BRL R$)
- **Instant Country Adaptability**:
  - Automatically switches city dropdowns to that country's major transport hubs and bus terminals.
  - Updates native currency symbol and pricing structure.
  - Loads real regional operators (e.g. Zingbus & VRL in India, National Express & Megabus in the UK, FlixBus & Pinkbus in Germany, Willer Express & JamJam Liner in Japan, RTA & Emirates Coach in UAE, 1001 & Cometa in Brazil).
  - Updates local phone number dialing prefix (e.g. +91, +44, +81, +49, +971).
  - Remembers user's preference in `localStorage`.
  - Built-in live search bar inside the modal to find countries instantly.

### 2. 🎮 Interactive 3D Luxury Highway Coach Experience
- **Real-Time Three.js Simulation**: A procedurally rendered, multi-axle luxury coach (Volvo 9600 format) driving continuously on a 3-lane illuminated expressway.
- **Dynamic Elements**:
  - Rotating wheels (6-wheel multi-axle configuration) synchronizing with road speed.
  - Animated road lane dashes and shoulder lines moving backward.
  - Roadside streetlamp posts and authentic Indian highway milestones (e.g., *NH 48 • Mumbai 120 km*, *NH 44 • Delhi 85 km*, *NH 75 • Bengaluru 45 km*) passing by.
  - Realistic Xenon projector headlights projecting forward light cones onto the highway asphalt.
  - Vertical rear LED tail lightbars with trailing red luminescence.
- **Interactive Cockpit Dashboard**:
  - **Live Digital Speedometer**: Toggle between Cruising (60 km/h), Express (90 km/h), and Turbo (120 km/h).
  - **Camera View Presets**: 360° Cinematic Orbit (click and drag to rotate), Side Chase Cam, Low Front Angle, and Aerial Top-Down.
  - **Headlight Switch**: Toggle projector high-beam lights ON/OFF.
  - **Luxury Dual Air Horn**: Synthesizes a real harmonic twin-tone air horn using Web Audio API on click!

### 3. 🇮🇳 Comprehensive All 28 States & 8 Union Territories of India Directory
- **Complete Pan-India Coverage**:
  - **Western Zone**: Maharashtra, Gujarat, Goa, Rajasthan
  - **Northern Zone**: Delhi NCR, Uttar Pradesh, Himachal Pradesh, Uttarakhand, Punjab, Haryana, Jammu & Kashmir, Ladakh, Chandigarh
  - **Southern Zone**: Karnataka, Tamil Nadu, Telangana, Andhra Pradesh, Kerala, Puducherry
  - **Central Zone**: Madhya Pradesh, Chhattisgarh
  - **Eastern Zone**: West Bengal, Bihar, Jharkhand, Odisha
  - **North-Eastern Zone**: Assam, Meghalaya, Sikkim, Arunachal Pradesh, Manipur, Mizoram, Nagaland, Tripura
  - **Island UTs**: Andaman & Nicobar, Lakshadweep, Dadra & Nagar Haveli and Daman & Diu
- **Interactive State Cards**:
  - State capitals, major bus hubs, regional travel taglines, and featured express routes.
  - Zone filtering tabs (North, South, West, East, Central, North-East, UTs) and instant state search.
  - One-click **"Book [State] Buses"** button that automatically selects India, loads the corridor, and brings up available coaches and seats.

### 4. 💺 Interactive 2-Deck Coach Visual Seat Selection
- **Lower Deck**: 2+2 layout with pushback executive reclining seats and aisle spacing.
- **Upper Deck**: 2+1 luxury sleeper berths (single sleeper left, double sleeper right).
- **Seat Statuses**: Available, Selected, Booked, and **Ladies-Only Reserved** safety seats.
- Dynamic pricing for window vs aisle vs luxury sleeper berths.
- Real-time selection summary tray with max 6 seats constraint.

### 3. 🏷️ Promo Code Engine
Test the coupon codes during checkout:
- `VIBE25`: 25% OFF Vibecoding special discount
- `FIRSTBUS`: 30% OFF Welcome bonus
- `NEXA10`: $10 Flat discount
- `WEEKEND`: 15% OFF Weekend getaway

### 4. 💳 Simulated Checkout & Payment
- **3D Card Visualizer**: Live card simulation with auto-formatting and security badges.
- **Instant QR / UPI Scanner**: Dynamic countdown timer for instant mobile payment.
- 256-bit SSL encrypted checkout simulation.

### 5. 🎫 Official Boarding Pass & E-Ticket
- Instant PNR generation (e.g. `NX-849204`).
- Scannable barcode and QR code.
- Passenger details and assigned seat numbers.
- **Print / Save as PDF** support (`@media print` optimized CSS for clean physical boarding passes).

### 6. 📂 "My Tickets" History & Cancellation
- Locally persisted in `localStorage`.
- Search tickets by PNR.
- Cancel ticket feature with automated 90% instant refund calculation.

### 7. 🛰️ Live Fleet Telemetry Radar
- Interactive simulated GPS radar tracking coach speed (64 mph), route progress, and ETA milestones.

### 8. 🌓 Visual Theme & Currencies
- Dark Midnight Luxury mode (default) and Light mode.
- Real-time currency conversion: USD ($), INR (₹), EUR (€), GBP (£).
