# DESTATE - Decentralized Real Estate Marketplace

## Project Overview
DESTATE is a modern, Web3-powered real estate marketplace built on the Stellar network using Soroban smart contracts. It enables users to securely list, discover, and purchase tokenized property assets via a seamless, dark-themed, glassmorphic UI. 

By eliminating intermediaries and leveraging blockchain technology, DESTATE ensures transparent, instantaneous, and immutable property ownership transfers.

## Features
- **Wallet Connection**: Deep integration with Freighter Wallet for authenticating and signing Stellar transactions.
- **Property Marketplace**: Explore a dynamic grid of listed luxury properties, beautifully displayed with glassmorphism UI.
- **List Properties**: Tokenize and list new properties directly to the network.
- **Buy Properties**: Seamless purchasing flow triggering on-chain Soroban contract logic using XLM.
- **User Dashboard**: A private portal to view properties owned by the connected wallet address.
- **Fast & Responsive**: Fully responsive UI tailored for both Desktop and Mobile experiences with satisfying micro-animations.

## Tech Stack
- **Frontend**: React (Vite) + TypeScript
- **Styling**: Tailwind CSS (CSS variables, dynamic gradients, glassmorphism)
- **Icons**: Lucide React
- **Blockchain**: Stellar Testnet, Soroban Smart Contracts (Rust)
- **Wallet Integration**: `@stellar/freighter-api`
- **State & Notifications**: React Hot Toast

## Architecture Explanation
The application is strictly decoupled:
* **Frontend (`/frontend`)**: Implements the presentation layer. It manages local application state and acts as the interface communicating with the underlying smart contracts through the user's Freighter wallet. It uses Mock data structures simulating contract behavior out-of-the-box for MVP presentation, ready to be immediately mapped to real initialized Soroban JS client bindings.
* **Smart Contract (`/contracts`)**: Written in Rust for the Soroban WASM runtime. The contract handles core business logic: maintaining global property ID counters, verifying authorization (signature checks), and enforcing state transition rules (e.g., preventing buyers from buying invalid properties). 

## Setup Instructions

### Frontend Setup
1. Open a terminal.
2. Navigate to the frontend directory: `cd frontend`
3. Install dependencies: `npm install`
4. Start the local Vite development server: `npm run dev`
5. Open `http://localhost:5173` in your browser.

### Smart Contract Setup
1. Ensure your system has `rustc` and `cargo` installed.
2. Navigate to `contracts/`
3. Build the contract: `cargo build --target wasm32-unknown-unknown --release`
4. Deploy the `.wasm` file using the Stellar CLI onto the Futurenet or Testnet.

## Deployment Steps
### Deploying to Vercel (Frontend)
1. Commit the code to a GitHub, GitLab, or Bitbucket repository.
2. Log into [Vercel](https://vercel.com/) and create a "New Project".
3. Import the repository.
4. Set the "Framework Preset" to `Vite` (Vercel normally auto-detects this).
5. Ensure the Root Directory is set to `frontend`.
6. Click **Deploy**. Vercel will automatically run `npm install && npm run build` and publish your decentralized marketplace!

## Smart Contract Explanation
The Soroban smart contract is responsible for:
- `register_property`: Mints a new property record on the ledger. Requires the signature of the owner. Returns a unique tracking ID.
- `buy_property`: Handles the transfer of the tokenized real estate unit from the current owner to the buyer. Requires the buyer's authorization. Delists the property upon success.
- **Storage**: Real estate assets are kept in the immutable ledger. For complex metadata (like high-res photos), IPFS hashes or API URIs can be stored inside the `metadata` string field.

## User Onboarding & Feedback
Help us improve DESTATE!
Once you test out the application via the Freighter Wallet, please provide your thoughts, feature requests, or report any bugs using our dedicated community feedback form:

**[Submit Feedback via Google Forms](https://forms.gle/your-mock-form-link)**

---
*Built for the future of Web3 Real Estate.*
