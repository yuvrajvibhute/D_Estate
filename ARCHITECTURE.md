# DESTATE — Architecture Document

## System Overview

DESTATE is a decentralized real estate marketplace built on the Stellar blockchain. It uses a hybrid architecture combining on-chain smart contracts (Soroban/Rust) for ownership records and off-chain metadata storage (Supabase) for property listings.

---

## Component Architecture

```
┌────────────────────────────────────────────────────────────────────┐
│                        USER BROWSER                                │
│                                                                    │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                  React Application (Vite)                    │   │
│  │                                                             │   │
│  │  Pages: Landing | Marketplace | List Property | Dashboard   │   │
│  │                                                             │   │
│  │  Components: Navbar | PropertyCard | PropertyModal          │   │
│  │                                                             │   │
│  │  Hooks/Context:                                             │   │
│  │    ├── WalletContext (Freighter integration)                │   │
│  │    └── Custom hooks for data fetching                       │   │
│  │                                                             │   │
│  │  Libs:                                                      │   │
│  │    ├── stellar.ts  (Stellar SDK transactions)               │   │
│  │    ├── supabase.ts (Database operations)                    │   │
│  │    └── mockData.ts (Demo mode data)                         │   │
│  └──────────────────────┬──────────────────────────────────────┘   │
└─────────────────────────│──────────────────────────────────────────┘
                          │
          ┌───────────────┼───────────────────┐
          │               │                   │
          ▼               ▼                   ▼
  ┌──────────────┐ ┌─────────────┐  ┌────────────────┐
  │  Freighter   │ │  Supabase   │  │    Stellar     │
  │   Wallet     │ │ PostgreSQL  │  │   Testnet      │
  │  Extension   │ │ (Metadata)  │  │   Network      │
  └──────┬───────┘ └─────────────┘  └───────┬────────┘
         │                                   │
         └──────────── signs ────────────────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │    Soroban      │
                 │    Contract     │
                 │  (Rust/WASM)    │
                 │                 │
                 │  register_prop  │
                 │  buy_property   │
                 │  get_property   │
                 └─────────────────┘
```

---

## Data Models

### Property (Supabase)
```typescript
{
  id: UUID,
  title: string,
  price: number,           // XLM amount
  location: string,
  description: string,
  owner: string,           // Stellar public key (G...)
  image_url?: string,
  property_type: string,
  bedrooms?: number,
  bathrooms?: number,
  area_sqft?: number,
  is_sold: boolean,
  contract_id?: string,    // Maps to Soroban property ID
  created_at: timestamp,
  updated_at: timestamp,
}
```

### Property (Soroban / On-Chain)
```rust
pub struct Property {
    pub id: u64,
    pub owner: Address,     // Stellar address
    pub price: i128,        // In stroops (1 XLM = 10M stroops)
    pub metadata: String,   // JSON or IPFS CID
    pub status: PropertyStatus, // ForSale | Sold | Delisted
    pub created_at: u64,    // Ledger timestamp
}
```

---

## Transaction Flow

### Buy Property Flow
```
User clicks "Buy Now"
        │
        ▼
Check Freighter installed
        │
        ▼
Get buyer balance (Stellar SDK)
        │
        ▼
Balance >= price + 2 XLM fee?
        │ YES
        ▼
Build payment transaction (XDR)
        │
        ▼
Request signature from Freighter
        │ User signs
        ▼
Submit to Stellar Testnet
        │
        ▼
Get transaction hash
        │
        ▼
Update property owner in Supabase
        │
        ▼
Show success toast + update UI
```

### Property Listing Flow
```
User fills form (title, price, location, desc)
        │
        ▼
Validate inputs
        │
        ▼
Review step (confirm details)
        │
        ▼
Insert into Supabase properties table
        │
        ▼ (Optional: Enhanced)
Call register_property on Soroban contract
        │
        ▼
Show success + redirect to Marketplace
```

---

## Security Considerations

| Concern | Mitigation |
|---------|------------|
| Unauthorized purchases | Stellar transaction requires buyer's signature |
| Fake listings | Owner's wallet is recorded immutably |
| Price manipulation | Smart contract enforces owner-only price updates |
| Replay attacks | Stellar uses sequence numbers |
| Front-end trust | All money movement happens on Stellar network |

---

## Scalability Design

- **Supabase** handles property metadata (scalable PostgreSQL)
- **Stellar** handles financial transactions (5+ TPS, global)
- **Soroban** handles ownership records (immutable, trustless)
- **Frontend** is stateless, deployable on CDN

---

## Network Configuration

| Setting | Value |
|---------|-------|
| Network | Stellar Testnet |
| Horizon URL | https://horizon-testnet.stellar.org |
| Passphrase | `Test SDF Network ; September 2015` |
| Friendbot | https://friendbot.stellar.org |
| Explorer | https://stellar.expert/explorer/testnet |

---

## Technology Decisions

### Why Stellar?
- Near-zero transaction fees (~$0.0001)
- 3-5 second block times
- Native multi-currency support
- Soroban smart contracts (Rust)
- Strong ecosystem for real-world assets

### Why Supabase?
- Open-source Firebase alternative
- Real-time subscriptions
- Row-level security
- Simple SDK integration
- Generous free tier for MVP

### Why Freighter?
- Official Stellar wallet
- Best-in-class developer APIs
- Browser extension (no mobile app needed for MVP)
- Supports testnet/mainnet switching

---

## Deployment Architecture

```
GitHub Repository
      │
      ├── Vercel (Frontend)
      │     ├── Auto-deploys on push to main
      │     └── Environment vars in Vercel dashboard
      │
      ├── Supabase (Backend)
      │     ├── Managed PostgreSQL
      │     └── Auto-scaling
      │
      └── Stellar Testnet (Blockchain)
            ├── Smart contract deployed via stellar CLI
            └── Transactions via Horizon REST API
```
