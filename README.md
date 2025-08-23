# Swift

**No cash. No stress. Just Swift**


## Abstract

Swift is a blockchain-based payment solution that helps **merchants and SMEs** accept payments, automatically split revenue among multiple parties, and access extra financial tools like **token swaps** and **Naira withdrawals**.

Built on **Starknet smart contracts**, Swift ensures:

* **Secure and transparent payments**.
* **Instant multi-party revenue splitting**.
* **On-chain swap support** using **AutoSwappr**.
* **Seamless cash-out** into **NGN** via fintech integrations.

## Problem Statement

Small businesses across Africa struggle with:

* Manual and error-prone revenue sharing.
* Payment delays and reliance on middlemen.
* Limited access to currency conversion (swap stablecoins easily).
* Poor cash-out options into **local fiat (Naira)**.

## Solution

Swift solves these challenges by providing:

* **Payments in USDC, USDT, and STRK**.
* **Automatic revenue splitting** among 3–5 recipients.
* **AutoSwappr-powered swaps** for instant token conversions.
* **Naira withdrawals** using Nigerian fintech APIs (e.g., Flutterwave).
* **On-chain verification** of all transactions.


## Technical Architecture

**Tech Stack**

* **Smart Contracts**: Cairo on **Starknet**.
* **Frontend**: ReactJS (merchant & customer UI).
* **Wallets**: Argent & Braavos.
* **Swap Integration**: AutoSwappr.
* **Naira Withdrawal**: Flutterwave API.
* **Design**: Figma.
* **Explorer**: Voyager.

**System Flow**

1. Merchant creates a **payment request**.
2. Customer scans QR and pays using stablecoins.
3. Smart contract processes payment → splits funds automatically.
4. Optionally:

   * Swap tokens via **AutoSwappr**.
   * Withdraw to **Naira** using fintech APIs.
5. Events emitted:

   * `PaymentReceived`
   * `SmeDistributed`
   * `SwapExecuted`
   * `NairaWithdrawalProcessed`


## Implementation (Hackathon Build)

* Implemented **payment request + QR code generation**.
* Added **automatic multi-wallet revenue splitting**.
* Integrated **AutoSwappr** for stablecoin swaps.
* Prototyped **Naira withdrawal** via fintech APIs.
* Deployed and tested contracts on **Starknet Devnet**.
* Connected frontend with **Argent/Braavos wallets**.


## Demo & Usage Guide

### Run Locally

```bash
# Clone repo
git clone https://github.com/your-username/swift.git
cd swift

# Install dependencies
npm install

# Start frontend
npm run dev

0x0294e947294a9fb919226fb6b326986a4029cb07adc89ef6c97ea9c5755bb763
```

### Usage Flow

1. Connect wallet (Argent or Braavos).
2. Merchant generates **payment request** → QR code.
3. Customer scans QR & pays in **USDC / USDT / STRK**.
4. Funds are:

   * **Split** among recipients.
   * Optionally **swapped** using AutoSwappr.
   * Optionally **withdrawn** into NGN via fintech API.
5. Merchant dashboard updates in real-time with confirmations & Tx hashes.

 **[Demo Video](#)** | **[Live Demo](#)** | **[Smart Contracts Repo](#)**

## Innovation & Differentiation

* Combines **payments + swaps + fiat withdrawal** in one platform.
* First solution enabling **multi-party automated payments + local cash-out**.
* **On-chain trust layer** ensures transparency for SMEs.

## Impact & Use Cases

* **Restaurants**: Split payments between owners, chefs, and staff, then swap USDT → NGN for expenses.
* **Ride-hailing**: Collect fares, split with drivers, and allow instant Naira withdrawal.
* **Farming cooperatives**: Share proceeds among farmers and cash-out transparently.
* **Freelancers**: Accept stablecoins, swap for preferred tokens, or withdraw to bank accounts.


## Challenges & Learnings

* Wallet integration (Argent & Braavos) required handling edge cases.
* Debugging **swap flows** with AutoSwappr on testnet.
* Time pressure balancing **deployment speed vs. contract security**.
* Learned how SMEs prioritize **ease of use, local currency access, and trust**.


## Future Roadmap

* Expand stablecoin & token support for swaps.
* Strengthen NGN integration with more fintech providers.
* Add **offline payment caching** for low-connectivity regions.
* Mobile app for **merchant accessibility on the go**.
* Analytics dashboard for merchants (transaction insights, payout history).

## 👥 Team Contributions

* **Stephanie Nwankwo** – Smart Contract Developer
* **Divine** – UI/UX Designer (Figma)
* **Moses** – Frontend Developer (ReactJS)

## References

* [Starknet Docs](https://docs.starknet.io/)
* [Cairo Language](https://www.cairo-lang.org/)
* [Voyager Explorer](https://voyager.online/)
* [Argent Wallet](https://www.argent.xyz/)
* [Braavos Wallet](https://braavos.app/)
* [AutoSwappr](#)

## License

MIT License


## Contact

* **Telegram**: [Join Chat](#)
* **Twitter (X)**: [@\_swift](https://x.com/_swift)
