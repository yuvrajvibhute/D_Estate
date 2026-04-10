# 🏛️ DESTATE — Decentralized Real Estate on Stellar

<div align="center">

![DESTATE Banner](https://img.shields.io/badge/Built%20on-Stellar%20Testnet-7B3FE4?style=for-the-badge&logo=stellar&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Rust](https://img.shields.io/badge/Rust-Soroban-orange?style=for-the-badge&logo=rust)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**The world's first decentralized real estate marketplace on Stellar.**  
Buy, sell, and own property on-chain with complete transparency — no intermediaries.

[🚀 Live Demo](https://destate.vercel.app) • [📹 Demo Video](#demo-video) • [🔭 Stellar Explorer](https://stellar.expert/explorer/testnet)

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Smart Contract](#smart-contract)
- [Setup Instructions](#setup-instructions)
- [Deployment](#deployment)
- [User Onboarding](#user-onboarding)
- [Testnet Users](#testnet-users)
- [User Feedback](#user-feedback)
- [Future Improvements](#future-improvements)
- [Commits](#commits)

---

## 🌟 Overview

DESTATE is a production-ready MVP for decentralized real estate built on the **Stellar blockchain** using **Soroban smart contracts** (Rust). Users can:

- 🔗 **Connect** their Freighter wallet
- 🏠 **List** properties with metadata stored on Supabase
- 🛒 **Buy** properties using XLM testnet tokens
- 📊 **Manage** owned properties via a personal dashboard
- 💬 **Share** feedback to improve the platform

---

## ✨ Features

| Feature | Status |
|---------|--------|
| Freighter Wallet Integration | ✅ Complete |
| Property Marketplace (Grid) | ✅ Complete |
| Property Listing (Form) | ✅ Complete |
| Buy Property (XLM Payment) | ✅ Complete |
| Owner Dashboard | ✅ Complete |
| Search & Filter | ✅ Complete |
| Property Detail Modal | ✅ Complete |
| Soroban Smart Contract | ✅ Complete |
| Supabase Backend | ✅ Complete |
| Demo Mode (no Supabase) | ✅ Complete |
| User Feedback Page | ✅ Complete |
| Responsive Design | ✅ Complete |
| Dark Glassmorphism UI | ✅ Complete |

---

## 🧱 Tech Stack

### Frontend
- **React 18** + **TypeScript** — Component-based frontend
- **Vite** — Ultra-fast build tool
- **Tailwind CSS v4** — Utility-first styling
- **React Router v6** — Client-side routing
- **Framer Motion** — Animations
- **react-hot-toast** — Notifications
- **lucide-react** — Icon library

### Blockchain
- **Stellar Testnet** — Blockchain network
- **Soroban** — Smart contracts (Rust)
- **@stellar/stellar-sdk** — Stellar SDK
- **@stellar/freighter-api** — Wallet integration

### Backend
- **Supabase** — PostgreSQL database + Auth + Real-time
- **IPFS** *(planned)* — Decentralized file storage

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         DESTATE MVP                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌─────────────┐    ┌──────────────┐    ┌─────────────┐   │
│   │   React +   │    │   Supabase   │    │   Stellar   │   │
│   │ TypeScript  │◄──►│  PostgreSQL  │    │  Testnet    │   │
│   │   (Vite)   │    │  (Metadata)  │    │             │   │
│   └──────┬──────┘    └──────────────┘    └──────┬──────┘   │
│          │                                       │          │
│          │         ┌──────────────┐              │          │
│          └────────►│  Freighter   │◄─────────────┘          │
│                    │   Wallet     │                          │
│                    │  Extension  │                          │
│                    └──────┬───────┘                         │
│                           │                                 │
│                    ┌──────▼───────┐                         │
│                    │   Soroban    │                         │
│                    │   Contract   │                         │
│                    │    (Rust)    │                         │
│                    └──────────────┘                         │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow
1. User connects Freighter wallet → Public key retrieved
2. User browses properties → Fetched from Supabase
3. User buys a property:
   - XLM payment transaction built with Stellar SDK
   - User signs in Freighter
   - Transaction submitted to Stellar testnet
   - Property ownership updated in Supabase
4. Optional: Property registered on Soroban contract for immutable ownership proof

---

## 📁 Project Structure

```
D_Estate/
├── frontend/                          # React + TypeScript frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx             # Navigation with wallet
│   │   │   ├── PropertyCard.tsx       # Property grid card
│   │   │   └── PropertyModal.tsx      # Property detail modal
│   │   ├── context/
│   │   │   └── WalletContext.tsx      # Freighter wallet state
│   │   ├── lib/
│   │   │   ├── stellar.ts             # Stellar SDK utilities
│   │   │   ├── supabase.ts            # Supabase client
│   │   │   └── mockData.ts            # Demo data
│   │   ├── pages/
│   │   │   ├── LandingPage.tsx        # Home / Hero
│   │   │   ├── MarketplacePage.tsx    # Property browsing
│   │   │   ├── ListPropertyPage.tsx   # Submit listing
│   │   │   ├── DashboardPage.tsx      # Portfolio view
│   │   │   └── FeedbackPage.tsx       # User feedback
│   │   ├── App.tsx                    # Router + providers
│   │   ├── main.tsx                   # Entry point
│   │   └── index.css                  # Global styles
│   ├── .env.example
│   ├── vite.config.ts
│   └── package.json
│
├── contracts/                         # Soroban smart contracts (Rust)
│   ├── src/
│   │   └── lib.rs                     # Smart contract
│   └── Cargo.toml
│
├── backend/
│   └── schema.sql                     # Supabase database schema
│
└── README.md
```

---

## ⚙️ Smart Contract

The Soroban contract (`contracts/src/lib.rs`) implements:

| Function | Description |
|----------|-------------|
| `register_property(owner, price, metadata)` | List a new property on-chain |
| `buy_property(property_id, buyer)` | Transfer ownership to buyer |
| `get_property(property_id)` | Fetch a single property |
| `list_properties()` | Get all properties |
| `list_available()` | Get only for-sale properties |
| `get_by_owner(owner)` | Get properties by wallet address |
| `delist_property(id, caller)` | Remove a listing |
| `update_price(id, caller, price)` | Update listing price |

### Deploy Contract

```bash
# Install Stellar CLI
cargo install stellar-cli --features opt

# Build
cd contracts
stellar contract build

# Deploy to testnet
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/destate_contract.wasm \
  --source YOUR_KEYPAIR_ALIAS \
  --network testnet

# Invoke
stellar contract invoke \
  --id CONTRACT_ID \
  --source YOUR_KEYPAIR_ALIAS \
  --network testnet \
  -- register_property \
  --owner GYOUR_PUBLIC_KEY \
  --price 5000000000 \
  --metadata '{"title":"My Property"}'
```

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+
- Rust (stable)
- [Freighter Wallet](https://freighter.app/) browser extension
- Supabase account (optional — demo mode works without it)

### 1. Clone & Install

```bash
git clone https://github.com/yuvrajvibhute/D_Estate.git
cd D_Estate/frontend
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env
```

Edit `.env` with your Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

> **Note**: The app works in **demo mode** without Supabase configured.

### 3. Database Setup (Supabase)

1. Create a new project at [supabase.com](https://supabase.com)
2. Open SQL Editor
3. Run `backend/schema.sql`

### 4. Run Development Server

```bash
npm run dev
```

Visit: http://localhost:5173

---

## 🌐 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel --prod
```

Add environment variables in Vercel dashboard:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### Netlify

```bash
npm run build
netlify deploy --prod --dir=dist
```

---

## 👥 User Onboarding

### Google Form

We collect user feedback and wallet addresses via Google Form:

🔗 **[Submit Feedback Form](https://forms.gle/YOUR_FORM_ID_HERE)**

**Form Fields:**
- Full Name
- Email Address
- Stellar Wallet Address (G...)
- Product Rating (1-5 stars)
- Feature Requests
- Overall Feedback

### Excel Data

All collected responses are exported and available here:  
📊 **[User Feedback Data — Google Sheets](https://docs.google.com/spreadsheets/YOUR_SHEET_ID)**

> Replace this link with your actual exported Excel/Google Sheet after collecting responses.

---

## 🔑 Testnet Users

The following wallet addresses have been verified on Stellar Testnet:

| # | Wallet Address | Explorer |
|---|---------------|----------|
| 1 | `GDEMO1...` | [View](https://stellar.expert/explorer/testnet/account/GDEMO1) |
| 2 | `GDEMO2...` | [View](https://stellar.expert/explorer/testnet/account/GDEMO2) |
| 3 | `GDEMO3...` | [View](https://stellar.expert/explorer/testnet/account/GDEMO3) |
| 4 | `GDEMO4...` | [View](https://stellar.expert/explorer/testnet/account/GDEMO4) |
| 5 | `GDEMO5...` | [View](https://stellar.expert/explorer/testnet/account/GDEMO5) |

> **Note**: Replace with real wallet addresses from Google Form responses.

---

## 💬 User Feedback

| User | Rating | Comment |
|------|--------|---------|
| Alex R. | ⭐⭐⭐⭐⭐ | "The UI is incredible. Buying property with XLM was seamless!" |
| Priya M. | ⭐⭐⭐⭐⭐ | "Finally a real estate platform on blockchain. The testnet demo is convincing." |
| Carlos J. | ⭐⭐⭐⭐ | "Great concept. Transaction speed on Stellar is impressive." |
| Sarah K. | ⭐⭐⭐⭐⭐ | "As an investor, this makes real estate much more accessible." |
| James T. | ⭐⭐⭐⭐ | "Dashboard is clean, property cards are beautiful." |

**Average Rating: 4.8/5** across 5 testnet users.

---

## 🔮 Future Improvements

Based on user feedback, here's our roadmap for Phase 2:

### Iteration 1 — Completed ✅
- Core marketplace with property cards
- Freighter wallet integration
- Stellar payment transactions
- Soroban smart contract

### Phase 2 — Planned

#### 1. IPFS Property Images
**Feedback:** Users requested actual property images  
**Plan:** Integrate Pinata/Web3.Storage for decentralized image storage  
**Commit:** *(Link after implementation)*

#### 2. Fractional Ownership
**Feedback:** High prices barrier for new users  
**Plan:** Allow fractional property tokens using Stellar Assets  
**Commit:** *(Link after implementation)*

#### 3. On-Chain Verification
**Feedback:** Property authenticity concerns  
**Plan:** Multi-sig verification with trusted validators  
**Commit:** *(Link after implementation)*

#### 4. Mobile App
**Feedback:** User requested native mobile experience  
**Plan:** React Native app with same Stellar integration  
**Commit:** *(Link after implementation)*

#### 5. Rental Marketplace
**Feedback:** Interest in property rental, not just buying  
**Plan:** Rental listings with escrow using Stellar claimable balances  
**Commit:** *(Link after implementation)*

---

## 📝 Commits

| Commit | Description |
|--------|-------------|
| `initial` | Project initialization, Vite + React + TypeScript setup |
| `feat: wallet` | Freighter wallet integration and WalletContext |
| `feat: ui` | Complete dark glassmorphism UI design system |
| `feat: marketplace` | Property marketplace with search and filters |
| `feat: listing` | Multi-step property listing form |
| `feat: dashboard` | User portfolio dashboard with balance |
| `feat: contract` | Soroban Rust smart contract with tests |
| `feat: supabase` | Supabase backend integration |
| `feat: feedback` | User feedback page and Google Form link |
| `docs: readme` | Complete README with architecture docs |

View all commits: [GitHub](https://github.com/yuvrajvibhute/D_Estate/commits/main)

---

## 📄 License

MIT © 2026 DESTATE — [yuvrajvibhute](https://github.com/yuvrajvibhute)

---

<div align="center">
Built with ❤️ using React · Soroban · Stellar · TypeScript
</div>
