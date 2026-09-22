# BhuNirnay — National Land Intelligence Platform
### Smart India Hackathon (SIH 26019) · Interactive Frontend Prototype

> **Problem Statement:** SIH 26019  
> **Organization:** Ministry of Rural Development, Department of Land Resources (DoLR), Government of India  
> **Status:** Frontend-Only Interactive Demonstration / Public Infrastructure Prototype

---

## 🏛️ Project Overview

**BhuNirnay** is an interactive, sovereign digital land governance prototype inspired by India's Digital Public Infrastructure (DPI) initiatives such as DILRMP, ULPIN (Bhu-Aadhaar), and ISRO Bhuvan.

This prototype provides an end-to-end interactive journey across 14 pages without requiring a backend server or external database. All GIS geometries, remote-sensing statistics, AI dialogs, and regulatory records are simulated locally.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18 or higher recommended)
- npm

### Installation & Launch
```bash
# 1. Navigate to project directory
cd land-intelligence-platform

# 2. Install dependencies
npm install

# 3. Launch local development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser to view the platform.

To create a production build:
```bash
npm run build
npm run preview
```

---

## 🧭 Complete Demonstration Flows

### Flow 1: Sovereign Land Intelligence & GIS Cadastre
1. **Homepage** (`/`):
   - Review hero statistics, India/Maharashtra cadastral visual, and live ULPIN badge.
   - Enter `MH-PN-4091`, `142/3-A`, or `Khadakwasla` in the **Unified Cadastral Lookup**.
   - Click **Open Parcel 360 →**.
2. **GIS Land Map** (`/gis`):
   - Fullscreen Leaflet map displaying 12 distinct cadastral polygons in Pune / Haveli Taluka.
   - Toggle layers (Cadastral boundaries, Land use, Roads, Flood hazards).
   - Click any parcel to inspect real-time attributes (ULPIN, Soil, 12m Groundwater, Flood risk, Title status).
   - Click **Development Suggestions** or **View Full Parcel 360**.
3. **Parcel 360** (`/parcel360/MH-PN-4091`):
   - Comprehensive identity dossier, cadastral map, and 4 tabbed panels: *Overview*, *Environment*, *Infrastructure*, and *Historical Timeline (2019–2026)*.
4. **AI Development Suggestions** (`/dev-suggestions`):
   - AI-driven multi-criteria land suitability analysis (Logistics Hub, Commercial Center, Community Agriculture).

### Flow 2: AI Land Research Assistant
1. Navigate to **AI Research** (`/research`).
2. Click any of the predefined research prompts on the left panel:
   - *"How has agricultural land changed in Pune since 2015?"*
   - *"Which districts have highest urban expansion?"*
   - *"What is the flood risk around this parcel?"*
   - *"Explain land conversion requirements in Maharashtra."*
   - *"Compare Pune and Nashik land-use trends."*
3. Watch the simulated AI synthesis with embedded **Recharts** visualizations and authoritative **Sources Checklist** (ISRO Bhuvan, State Land Records, CGWB).

### Flow 3: Regional Policy Simulator & Brief Generation
1. Switch role to **Government Officer** via the top-right Login modal (`Vikramaditya Singh, IAS`).
2. Visit **Regional Dashboard** (`/officer`):
   - Inspect the 3-part Land-Use Breakdown progress bar (Agri 62%, Forest 24%, Urban 14%).
   - Review Cadastral Digitisation (94.2%), Pending Applications queue, and Mutation Trends.
   - Toggle **Officer Personal Holdings** (Rule 16(2) compliance view).
3. Open **Policy Simulator** (`/policy`):
   - Adjust the **Agricultural Land Conversion slider** (5%–75%).
   - Select Time Horizons (5Y, 10Y, 25Y).
   - Observe live recalculations of Economic Yield (+24%), Employment (+18%), Food Security (-16%), and Water Stress (+28%).
   - Review the automatic **Moderate-High Risk warning** triggered when conversion exceeds 20%.
4. Click **Generate Policy Brief** (`/policy-brief`):
   - Select topic, region, and scenario to generate an institutional statutory document with print and PDF export capabilities.

### Flow 4: Citizen Portal, Document Vault & Scheme Matching
1. Switch role to **Citizen** (`Rajesh Sharma`).
2. Open **My Land** (`/my-land`):
   - Review registered parcels with interactive mini-maps.
   - View tax renewal alerts and matched welfare schemes.
3. Open **Document Vault** (`/documents`):
   - View digitally sealed documents: 7/12 Extract, Mutation/Ferfar, Property Card, Tax Receipt, Survey Map, Encumbrance Certificate.
   - Click **AI Read** on any document to trigger automated text extraction and field identification.
   - Click **Upload Document** to test simulated multi-step cryptographic verification.
4. Open **Scheme Finder** (`/schemes`):
   - Complete the 4-step wizard (*State → District → Holding Size → Purpose*) to unlock matched central and state welfare programs (PMKSY, PMFBY, KCC).
5. Open **Audit Trail** (`/audit`):
   - Inspect the immutable ledger of all administrative queries, citizen disclosures, and system certifications.
   - Click **Verify Cryptographic Seal** to simulate SHA-256 Merkle chain verification.

---

## 🛠️ Technology Stack
- **Framework:** React 19 + Vite
- **Routing:** React Router v7
- **Styling:** Tailwind CSS v4 (Government Institutional Design System)
- **Mapping & GIS:** Leaflet.js + React-Leaflet + OpenStreetMap
- **Data Visualization:** Recharts (Line, Bar, and Pie Charts)
- **Icons:** Lucide React
- **Architecture:** Zero-Backend Client Prototype with Local GeoJSON & State Simulation
