# 🏎️ BayFlow — Enterprise Multi-Tenant Auto Repair Operating System

<div align="center">

![BayFlow Banner](https://img.shields.io/badge/BayFlow-Enterprise%20Auto%20OS-10B981?style=for-the-badge&logo=speedtest&logoColor=white)
![Next.js 14](https://img.shields.io/badge/Next.js%2014-App%20Router-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-20%20Slim-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-PostgreSQL-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![Redis](https://img.shields.io/badge/Upstash-Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![WebRTC](https://img.shields.io/badge/WebRTC-In--App%20Voice-FF6B6B?style=for-the-badge&logo=webrtc&logoColor=white)

**A Next-Generation Automotive Workshop Management & Customer Portal Platform**  
*Seamless 15-State Repair Lifecycle • In-App WebRTC Voice Calling • Cloud WhatsApp Engine • Multi-Tenant RBAC POS*

[🌐 Live Customer & POS Portal](https://bay-flow-loop-lab.vercel.app) • [📡 Live Backend API & Health](https://bayflow-looplab-1.onrender.com/health) • [📑 Interactive Swagger Docs](https://bayflow-looplab-1.onrender.com/api/docs)

</div>

---

## 📑 Table of Contents

1. [Platform Overview](#-platform-overview)
2. [Live Production Deployments](#-live-production-deployments)
3. [4 Premium Workshops & Staff Credentials](#-4-premium-workshops--staff-credentials)
4. [Deep-Dive Feature Breakdown](#-deep-dive-feature-breakdown)
   - [1. 15-State Repair Lifecycle Engine](#1-15-state-repair-lifecycle-engine)
   - [2. In-App WebRTC Voice Calling Engine](#2-in-app-webrtc-voice-calling-engine)
   - [3. WhatsApp Engine (Pure WebSocket Baileys + Redis Cloud Auth)](#3-whatsapp-engine-pure-websocket-baileys--redis-cloud-auth)
   - [4. Customer Portal & Self-Service Booking](#4-customer-portal--self-service-booking)
   - [5. Role-Based POS Workshop Dashboard](#5-role-based-pos-workshop-dashboard)
   - [6. Inventory Management & Automated Purchase Orders](#6-inventory-management--automated-purchase-orders)
   - [7. Concurrency Control & Double-Booking Prevention](#7-concurrency-control--double-booking-prevention)
   - [8. Multi-Channel Notification Hub (Email & WhatsApp)](#8-multi-channel-notification-hub-email--whatsapp)
5. [System Architecture & Data Flow](#-system-architecture--data-flow)
6. [API Specification & Endpoints](#-api-specification--endpoints)
7. [Local Development & Setup](#-local-development--setup)
8. [Environment Variables](#-environment-variables)
9. [Enterprise Production Guarantees](#-enterprise-production-guarantees)

---

## 🌟 Platform Overview

**BayFlow** is a comprehensive multi-tenant Operating System designed for modern automotive repair centers, service advisors, master technicians, and vehicle owners. It bridges the gap between chaotic workshop floors and transparent customer experiences by digitizing every step of vehicle care into a strictly verified state machine.

* **Multi-Tenant Architecture**: Complete logical data separation per workshop with dynamic slot scheduling, team management, inventory catalogs, and customized pricing.
* **Zero-Latency In-App Voice Calls**: Real-time WebRTC audio connect between customers and service advisors right inside the browser without third-party telecom fees.
* **Cloud-Synced WhatsApp Automation**: Powered by `@whiskeysockets/baileys` directly over WebSockets (no bulky Chrome/Puppeteer), persisting session keys to Upstash Redis for 24/7 durability.
* **Strict Concurrency Protection**: Redis distributed locks preventing double-bookings, simultaneous QC inspections, and inventory race conditions.

---

## 🌐 Live Production Deployments

| Component | Provider | Live URL | Description |
|---|---|---|---|
| **Frontend Portal** | Vercel | [bay-flow-loop-lab.vercel.app](https://bay-flow-loop-lab.vercel.app) | Next.js 14 Responsive UI (Customer, POS, Admin) |
| **Backend API Engine** | Render | [bayflow-looplab-1.onrender.com](https://bayflow-looplab-1.onrender.com) | Express + Prisma + Baileys Engine |
| **API Health Check** | Render | [bayflow-looplab-1.onrender.com/health](https://bayflow-looplab-1.onrender.com/health) | Uptime & Self-Ping Keep-Alive Endpoint |
| **Interactive API Docs**| Render | [bayflow-looplab-1.onrender.com/api/docs](https://bayflow-looplab-1.onrender.com/api/docs) | Swagger OpenAPI 3.0 Interactive Testbench |
| **Database** | Supabase | AWS ap-northeast-1 | PostgreSQL Transaction Pooler (Port 6543) |
| **Redis Cache / Locks**| Upstash | Global Serverless | Distributed Locks, OTPs & Baileys Session Sync |

---

## 🔑 4 Premium Workshops & Staff Credentials

The database is seeded with **4 Luxury Automotive Workshops**, each equipped with a complete 5-member operational team. All demo accounts are pre-verified.

### Universal Password for All Demo Accounts:
```
BayFlow@2026
```

---

### 1. Apex Performance & AutoLab (Lahore)
> *Specialization: German & Luxury Sports tuning, ECU diagnostics, and express maintenance.*  
> **Location:** Main Boulevard, Gulberg III, Lahore • **Phone:** `+92 300 8472911`

| Role | Email Address | Password | Permissions & Dashboard Scope |
|---|---|---|---|
| **Workshop Owner** | `owner@apex.bayflow.io` | `BayFlow@2026` | Full shop governance, staff management, revenue analytics, WhatsApp pairing |
| **Service Advisor** | `advisor@apex.bayflow.io` | `BayFlow@2026` | Intake POS, estimate submission to customer, job assignment, phone calls |
| **Technician** | `tech@apex.bayflow.io` | `BayFlow@2026` | Job bay view, inspection checklists, estimate drafting, parts requests |
| **Parts Specialist** | `parts@apex.bayflow.io` | `BayFlow@2026` | Inventory catalog, parts allocation, PO creation & receiving |
| **QC Inspector** | `qc@apex.bayflow.io` | `BayFlow@2026` | Multi-point quality inspection, pass to pickup, defect re-routing |

---

### 2. Velocity Motorsports & Precision Care (Karachi)
> *Specialization: Exotic Supercars, Hybrid/EV powertrains, track alignments, and detailing.*  
> **Location:** Marine Promenade, Clifton Block 4, Karachi • **Phone:** `+92 321 9924810`

| Role | Email Address | Password | Permissions & Dashboard Scope |
|---|---|---|---|
| **Workshop Owner** | `owner@velocity.bayflow.io` | `BayFlow@2026` | Full shop governance, staff management, revenue analytics, WhatsApp pairing |
| **Service Advisor** | `advisor@velocity.bayflow.io` | `BayFlow@2026` | Intake POS, estimate submission to customer, job assignment, phone calls |
| **Technician** | `tech@velocity.bayflow.io` | `BayFlow@2026` | Job bay view, inspection checklists, estimate drafting, parts requests |
| **Parts Specialist** | `parts@velocity.bayflow.io` | `BayFlow@2026` | Inventory catalog, parts allocation, PO creation & receiving |
| **QC Inspector** | `qc@velocity.bayflow.io` | `BayFlow@2026` | Multi-point quality inspection, pass to pickup, defect re-routing |

---

### 3. Prestige AutoCraft & Works (Islamabad)
> *Specialization: Executive Sedans, Diplomatic Fleet care, AC refrigeration, and transmission overhauls.*  
> **Location:** Executive Sector, Blue Area, Islamabad • **Phone:** `+92 333 5183920`

| Role | Email Address | Password | Permissions & Dashboard Scope |
|---|---|---|---|
| **Workshop Owner** | `owner@prestige.bayflow.io` | `BayFlow@2026` | Full shop governance, staff management, revenue analytics, WhatsApp pairing |
| **Service Advisor** | `advisor@prestige.bayflow.io` | `BayFlow@2026` | Intake POS, estimate submission to customer, job assignment, phone calls |
| **Technician** | `tech@prestige.bayflow.io` | `BayFlow@2026` | Job bay view, inspection checklists, estimate drafting, parts requests |
| **Parts Specialist** | `parts@prestige.bayflow.io` | `BayFlow@2026` | Inventory catalog, parts allocation, PO creation & receiving |
| **QC Inspector** | `qc@prestige.bayflow.io` | `BayFlow@2026` | Multi-point quality inspection, pass to pickup, defect re-routing |

---

### 4. Bavarian Auto Haus & Garage (Lahore)
> *Specialization: European Masters (BMW, Porsche, Mercedes-Benz, Audi) & OEM Genuine Spares.*  
> **Location:** Commercial Avenue, DHA Phase 6, Lahore • **Phone:** `+92 301 4455667`

| Role | Email Address | Password | Permissions & Dashboard Scope |
|---|---|---|---|
| **Workshop Owner** | `owner@bavarian.bayflow.io` | `BayFlow@2026` | Full shop governance, staff management, revenue analytics, WhatsApp pairing |
| **Service Advisor** | `advisor@bavarian.bayflow.io` | `BayFlow@2026` | Intake POS, estimate submission to customer, job assignment, phone calls |
| **Technician** | `tech@bavarian.bayflow.io` | `BayFlow@2026` | Job bay view, inspection checklists, estimate drafting, parts requests |
| **Parts Specialist** | `parts@bavarian.bayflow.io` | `BayFlow@2026` | Inventory catalog, parts allocation, PO creation & receiving |
| **QC Inspector** | `qc@bavarian.bayflow.io` | `BayFlow@2026` | Multi-point quality inspection, pass to pickup, defect re-routing |

---

### 👤 Demo Customer Account (All Workshops)
| Role | Email Address | Password | Phone Number |
|---|---|---|---|
| **Customer** | `customer@bayflow.demo` | `BayFlow@2026` | `+92 300 1234567` |

---

## 🛠️ Deep-Dive Feature Breakdown

### 1. 15-State Repair Lifecycle Engine

BayFlow enforces a strict, mathematical state machine. No job can jump states without fulfilling prerequisite data (estimates, parts, QC checklists, approvals). Every transition records an immutable audit log entry in `BookingHistory`.

```mermaid
stateDiagram-v2
    [*] --> PENDING: Customer books slot
    PENDING --> CONFIRMED: Service Advisor confirms
    CONFIRMED --> ASSIGNED: Tech assigned by SA
    ASSIGNED --> INSPECTING: Tech begins bay inspection
    INSPECTING --> ESTIMATE_REVIEW: Tech drafts parts & labour estimate
    ESTIMATE_REVIEW --> AWAITING_CUSTOMER: SA sends estimate to customer
    AWAITING_CUSTOMER --> ESTIMATE_APPROVED: Customer approves estimate
    AWAITING_CUSTOMER --> ESTIMATE_REJECTED: Customer rejects estimate
    ESTIMATE_REJECTED --> ESTIMATE_REVIEW: SA renegotiates / modifies estimate
    ESTIMATE_APPROVED --> PARTS_PENDING: Estimate requires replacement parts
    ESTIMATE_APPROVED --> IN_REPAIR: No parts needed (labour only)
    PARTS_PENDING --> PARTS_ORDERED: Parts Person generates PO
    PARTS_ORDERED --> PARTS_READY: Parts Person receives & allocates parts
    PARTS_READY --> IN_REPAIR: Tech resumes repair with allocated parts
    IN_REPAIR --> QC_PENDING: Tech marks repairs complete
    QC_PENDING --> QC_IN_PROGRESS: QC Inspector locks job for audit
    QC_IN_PROGRESS --> READY_FOR_PICKUP: QC checklist passed 100%
    QC_IN_PROGRESS --> IN_REPAIR: QC defect found (routed back with notes)
    READY_FOR_PICKUP --> COMPLETED: Customer settles invoice & vehicle released
    PENDING --> CANCELLED: Job cancelled (allocated parts returned)
    CONFIRMED --> CANCELLED: Job cancelled (allocated parts returned)
```

#### Detailed Transition Rules:
1. **PENDING ➔ CONFIRMED**: Service Advisor reviews the customer's reported vehicle issues and validates bay availability.
2. **CONFIRMED ➔ ASSIGNED**: SA selects an active shop technician; updates `assignedTechId` and notifies the technician via in-app banner and WhatsApp.
3. **ASSIGNED ➔ INSPECTING**: Technician clocks onto the job in the bay, triggers the inspection clock, and enters diagnostic findings.
4. **INSPECTING ➔ ESTIMATE_REVIEW**: Technician selects necessary inventory SKUs, sets required quantities, and calculates estimated labour hours.
5. **ESTIMATE_REVIEW ➔ AWAITING_CUSTOMER**: SA audits pricing margins and dispatches the formal quote to the customer's portal and phone.
6. **AWAITING_CUSTOMER ➔ ESTIMATE_APPROVED / ESTIMATE_REJECTED**: Customer has one-click Approve/Reject controls with interactive itemized cost transparency.
7. **PARTS_PENDING ➔ PARTS_ORDERED ➔ PARTS_READY**: Parts specialist monitors shortage alerts, creates Purchase Orders with vendor details, receives stock, and allocates locked-price inventory directly to the booking.
8. **IN_REPAIR ➔ QC_PENDING ➔ QC_IN_PROGRESS**: Atomic state locking ensures only one QC inspector can evaluate a vehicle at any time, avoiding duplicate inspections.
9. **QC Pass vs Fail**:
   * **Passed**: Moves to `READY_FOR_PICKUP`; customer receives pickup WhatsApp notification.
   * **Failed**: Generates a `QCIssue` record with defect descriptions and routes the vehicle back to `IN_REPAIR`.
10. **Cancellation Rollback**: If a job is cancelled after parts allocation, all reserved stock is atomically incremented back into active inventory.

---

### 2. In-App WebRTC Voice Calling Engine

BayFlow features an enterprise **peer-to-peer WebRTC voice calling system** built directly into the web application. Customers and Service Advisors can talk in real time with crystal-clear audio:

* **No Third-Party Telecom APIs Required**: Zero Twilio or Agora charges. Pure browser-native WebRTC peer negotiation.
* **Dual-Engine Audio Output Architecture**:
  1. **Active DOM Media Element**: Native `<audio autoPlay playsInline />` element rendered off-screen (never `display: none`) to comply with Chromium and Safari background media decoding policies.
  2. **Direct WebAudio API Hardware Sink**: Connects `AudioContext.destination` straight to the operating system's audio mixer (`createMediaStreamSource`), bypassing browser autoplay restrictions.
* **Global STUN & Free OpenRelay TURN Servers**: Includes Google STUN and Metered OpenRelay TURN servers (`turn:openrelay.metered.ca:443?transport=tcp`) to punch through strict Carrier-Grade NAT (CGNAT) and mobile 4G/5G data connections in Pakistan and worldwide.
* **ICE Candidate Queuing Engine**: Buffers incoming network candidates until `setRemoteDescription` completes, eliminating handshaking race conditions.
* **Unified Room Signaling Key**: Guarantees that whether caller or receiver addresses the call by `bookingId` or `callLog.id`, both parties always rendezvous in the exact same in-memory signaling room.
* **Realistic Telephone Ringtones**: Built-in dual-frequency telephone ringback generator (440Hz + 480Hz synthesized via WebAudio API) for outgoing callers and incoming call banners.

---

### 3. WhatsApp Engine (Pure WebSocket Baileys + Redis Cloud Auth)

Say goodbye to fragile Puppeteer and heavy Chromium Docker containers! BayFlow integrates `@whiskeysockets/baileys`:

* **100% Browserless & Pure WebSocket**: Connects directly to WhatsApp's multi-device WebSocket servers. Reduces Docker RAM usage from **350MB down to ~55MB**!
* **Upstash Redis Session Cloud Backup**:
  * On Render or serverless containers, container filesystems are wiped on restart.
  * BayFlow automatically serializes and synchronizes Baileys `.wa_session` credential keys to Upstash Redis (`bayflow:wa_session`).
  * On container boot, the session is restored from Redis in milliseconds — **you never have to scan the QR code again**!
* **International & Pakistani Phone Normalization**: Automatically converts local Pakistani formats (`03XXXXXXXXX`, `0328...`, `0300...`) into standard international JID format (`923XXXXXXXXX@s.whatsapp.net`).
* **Interactive Owner QR & Test Suite**: The Owner dashboard (`/owner/whatsapp`) displays real-time connection status, live QR refresh, and an instant test dispatch form.

---

### 4. Customer Portal & Self-Service Booking

Vehicle owners enjoy a modern, transparent booking experience:

* **Interactive Workshop Discovery**: Browse shops by city, address, working hours, and rating.
* **Smart Real-Time Slot Picker**: Fetches active shop slots, automatically graying out booked or past timeslots.
* **Instant Estimate Approval / Rejection**: Complete visibility into breakdown costs (Labour, OEM Parts, Taxes) with one-click decision buttons.
* **Vehicle Service Tracker**: Live status stepper showing whether their car is in inspection, waiting for parts, undergoing repair, or in QC.
* **One-Click Voice Call Advisor**: Direct voice connect button that dials the workshop front desk.

---

### 5. Role-Based POS Workshop Dashboard

A single responsive unified dashboard that tailors its tools dynamically based on the logged-in user's role:

* **Service Advisor (POS Mode)**:
  * Fast vehicle intake counter with customer auto-fill.
  * Active repair board with quick technician assignment.
  * Estimate review dialog with price adjustments.
* **Technician (Bay Mode)**:
  * Filtered view displaying only jobs assigned to the logged-in technician.
  * Bay Inspection tool to document vehicle diagnostics.
  * Estimate creator: Add inventory parts and labour minutes with live subtotal calculation.
* **Parts Specialist (Inventory & PO Mode)**:
  * Live stock levels with color-coded reorder warning badges.
  * Quick stock adjustments and unit pricing.
  * Automated Purchase Order creation for depleted parts.
* **QC Inspector (Audit Mode)**:
  * Dedicated inspection queue with concurrency lock.
  * Multi-point pass/fail checklist with defect logging.
* **Shop Owner (Executive Mode)**:
  * Workshop revenue metrics, active repairs overview, and staff roster.
  * WhatsApp pairing controls and test dispatching tools.

---

### 6. Inventory Management & Automated Purchase Orders

* **Parts Tracking with Reorder Thresholds**: Every SKU has a minimum reorder level. When stock hits the threshold, warning alerts are flagged across the POS.
* **Price Locking on Estimate Approval**: When a customer approves an estimate, the part price is locked in `priceLocked` to protect against mid-repair market fluctuations.
* **Automated Purchase Order (PO) Lifecycle**:
  `ORDERED` ➔ `PARTIALLY_RECEIVED` ➔ `RECEIVED`
* **Zero-Stock Demonstration Ready**: Each shop is seeded with **Bosch Ignition Coils at 0 quantity**, allowing immediate testing of the purchase order flow!

---

### 7. Concurrency Control & Double-Booking Prevention

1. **Redis Distributed Slot Locks**:
   * When a customer requests a slot, the server acquires a Redis lock: `lock:slot:{shopId}:{date}:{slotTime}`.
   * Concurrent duplicate requests within the same millisecond are rejected with HTTP 409.
2. **Database Unique Constraints**:
   * Backed by PostgreSQL composite unique key: `@@unique([shopId, slotTime])`.
3. **QC Concurrent Pick Protection**:
   * When a QC inspector picks a job in `QC_PENDING`, an atomic status transition lock moves it to `QC_IN_PROGRESS`.
   * Other inspectors attempting to pick the same car simultaneously are safely blocked.
4. **Inventory Race Protection**:
   * Stock allocation queries run inside atomic database transactions (`prisma.$transaction`).

---

### 8. Multi-Channel Notification Hub (Email & WhatsApp)

* **Brevo REST API Email Dispatch**:
  * Sends branded HTML templates for OTP verification, welcome onboarding, and password resets.
  * Bypasses port 587/465 SMTP blocking on cloud platforms like Render by using HTTPS REST API.
* **WhatsApp Real-Time Alerts**:
  * **Job Confirmation**: Dispatched to customer on booking acceptance.
  * **Estimate Ready**: Alerts customer when quote is ready for approval.
  * **Technician Assigned**: Dispatched to technician when assigned a bay job.
  * **Parts Ready**: Dispatched to technician when parts have arrived.
  * **Ready for Pickup**: Dispatched to customer when car passes QC inspection.

---

## 🏗️ System Architecture & Data Flow

```mermaid
graph TD
    subgraph Clients
        C[Vehicle Customer Portal]
        S[Workshop Staff & Owner POS]
    end

    subgraph "API Gateway & Application Server (Render Node.js 20)"
        GW[Express API Router]
        AuthG[AuthGuard & RBAC Middleware]
        TenantG[Multi-Tenant Isolation Guard]
        KeepAlive[Keep-Alive Ping Engine]
        
        subgraph Modules
            SM[15-State Repair Engine]
            RTC[WebRTC Signaling Hub]
            WA[Baileys WhatsApp Client]
            INV[Inventory & PO Engine]
        end
    end

    subgraph "Persistent Storage & Cloud Services"
        PG[(PostgreSQL Supabase - Port 6543)]
        REDIS[(Upstash Redis - Locks & Session Backup)]
        BREVO[Brevo REST API - Email Relay]
        TURN[Metered OpenRelay TURN Network]
    end

    C -->|HTTP / REST| GW
    S -->|HTTP / REST| GW
    GW --> AuthG --> TenantG
    TenantG --> SM
    TenantG --> INV
    
    C <-->|P2P Voice Stream| TURN
    S <-->|P2P Voice Stream| TURN
    C <-->|WebRTC Signals| RTC
    S <-->|WebRTC Signals| RTC

    SM -->|Distributed Slot Locks| REDIS
    SM -->|Audit Log & Booking Data| PG
    WA -->|Backup/Restore .wa_session| REDIS
    WA -->|Dispatches Messages| Clients
    GW -->|Send Emails| BREVO
    KeepAlive -->|Ping /health every 10m| GW
```

---

## 📑 API Specification & Endpoints

All endpoints are documented via Swagger at `/api/docs`.

### Authentication (`/api/auth`)
* `POST /api/auth/register` — Register a customer or workshop owner
* `POST /api/auth/verify-otp` — Verify 6-digit registration OTP
* `POST /api/auth/login` — Authenticate and receive JWT access/refresh tokens
* `POST /api/auth/resend-otp` — Request new verification OTP
* `POST /api/auth/forgot-password` — Request password reset OTP
* `POST /api/auth/reset-password` — Reset password using verified OTP
* `GET /api/auth/profile` — Get authenticated user details & active tenant

### Bookings & Repair Engine (`/api/bookings`)
* `POST /api/bookings` — Create a new customer booking (protected by Redis slot lock)
* `GET /api/bookings/available-slots` — Retrieve open time slots for a shop on a date
* `GET /api/bookings` — List bookings (scoped by role: customer, technician, shop)
* `GET /api/bookings/:id` — Retrieve booking details, vehicle info, parts & history
* `PATCH /api/bookings/:id/status` — Execute lifecycle state transition
* `PATCH /api/bookings/:id/assign` — Assign a master technician to the booking
* `POST /api/bookings/:id/estimate` — Draft parts and labour quote
* `PATCH /api/bookings/:id/estimate` — Customer approve or reject estimate
* `POST /api/bookings/:id/parts` — Allocate required inventory items to repair
* `POST /api/bookings/:id/qc` — Submit quality inspection (Pass / Fail defect report)
* `POST /api/bookings/:id/cancel` — Cancel booking and rollback allocated inventory

### In-App Voice Calling (`/api/calls`)
* `POST /api/calls/initiate` — Initiate voice call session for a booking
* `GET /api/calls/incoming` — Fast poll (<50ms) for incoming ringing calls
* `GET /api/calls/:callId` — Get call status (RINGING, CONNECTED, ENDED, MISSED)
* `PATCH /api/calls/:callId/status` — Update call state & duration
* `POST /api/calls/:callId/signal` — Post WebRTC signal (offer, answer, candidate)
* `GET /api/calls/:callId/signals` — Fetch opposing WebRTC peer signals
* `GET /api/calls/booking/:bookingId` — Retrieve voice call history logs

### WhatsApp Integration (`/api/whatsapp`)
* `GET /api/whatsapp/qr` — Get current WhatsApp engine state (`INITIALIZING`, `QR_READY`, `CONNECTED`) and QR data URL
* `GET /api/whatsapp/test` — Dispatch live test WhatsApp message to specified phone

### Workshops & Inventory (`/api/shops`)
* `GET /api/shops` — List all registered workshops
* `GET /api/shops/:id` — Get workshop services, team members, and catalog
* `POST /api/shops` — Create new workshop (Owner only)
* `POST /api/shops/:id/staff` — Add new team member to shop

### Health & Monitoring (`/health`)
* `GET /health` & `GET /api/health` — Returns system uptime, timestamp, and status 200 OK (bypass rate limiter)

---

## 💻 Local Development & Setup

### Prerequisites
* Node.js `20.x` or higher
* npm or pnpm
* PostgreSQL instance (or free Supabase project)
* Upstash Redis instance (free tier)

### 1. Clone & Install
```bash
git clone https://github.com/suleman2028nust/BayFlow-LoopLab.git
cd BayFlow-LoopLab

# Install Backend packages
cd Backend
npm install

# Install Frontend packages
cd ../Frontend
npm install
```

### 2. Environment Configuration
Create `Backend/.env` using the template below:
```env
PORT=4000
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# Database (Supabase PostgreSQL Connection Pooler)
DATABASE_URL="postgresql://postgres.[REF]:[PASSWORD]@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Auth Secrets
JWT_SECRET="your-ultra-secure-jwt-secret-key"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_SECRET="your-ultra-secure-refresh-secret-key"
JWT_REFRESH_EXPIRES_IN="7d"

# Upstash Redis
UPSTASH_REDIS_REST_URL="https://[YOUR-UPSTASH-INSTANCE].upstash.io"
UPSTASH_REDIS_REST_TOKEN="[YOUR-UPSTASH-TOKEN]"

# Brevo REST API Email
BREVO_API_KEY="xkeysib-[YOUR-BREVO-API-KEY]"
EMAIL_USER="your-verified-brevo-sender@gmail.com"
```

And create `Frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### 3. Database Push & Seed
```bash
cd Backend
npx prisma db push
npm run seed
```
*This seeds the 4 luxury automotive shops, all 20 team accounts, catalog services, and inventory items with universal password `BayFlow@2026`.*

### 4. Run Both Servers
```bash
# Terminal 1: Backend Server (Port 4000)
cd Backend
npm run dev

# Terminal 2: Frontend Next.js Server (Port 3000)
cd Frontend
npm run dev
```

Open your browser to:
* **Web App**: [http://localhost:3000](http://localhost:3000)
* **Swagger API Docs**: [http://localhost:4000/api/docs](http://localhost:4000/api/docs)
* **Health Check**: [http://localhost:4000/health](http://localhost:4000/health)

---

## 🛡️ Enterprise Production Guarantees

1. **Ephemeral Cloud Durability**: Full container reboots on Render do not affect Baileys WhatsApp authentication because sessions are backed up to Upstash Redis.
2. **Double-Booking Free Guarantee**: Guaranteed by dual-layer locks (Redis distributed key + Postgres unique constraint).
3. **No Muted Voice Calls**: Dual-channel output via DOM `<audio>` and low-level WebAudio API destination ensures crystal-clear speech on Chrome, Firefox, Edge, and iOS Safari.
4. **Audit Trail Completeness**: Every change to an estimate, status, or assignment is logged with actor ID, timestamp, and transition notes.
5. **Auto Sleep Prevention**: Keep-alive self-ping pinging `/health` every 10 minutes ensures the Render free tier never sleeps during active workshop hours.

---

<div align="center">

**Built with precision for automotive excellence by the BayFlow Engineering Team.**  
*© 2026 BayFlow Technologies. All rights reserved.*

</div>
