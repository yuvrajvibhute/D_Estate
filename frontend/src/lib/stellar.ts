// Stellar testnet transaction utilities
import * as StellarSdk from '@stellar/stellar-sdk';

const STELLAR_HORIZON_URL = 'https://horizon-testnet.stellar.org';
const STELLAR_NETWORK_PASSPHRASE = StellarSdk.Networks.TESTNET;

export const server = new StellarSdk.Horizon.Server(STELLAR_HORIZON_URL);

// Format XLM amount (stroops to XLM)
export const stroopsToXLM = (stroops: string | number): number => {
  return Number(stroops) / 10_000_000;
};

// Format XLM amount display
export const formatXLM = (amount: number): string => {
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}M XLM`;
  if (amount >= 1_000) return `${(amount / 1_000).toFixed(1)}K XLM`;
  return `${amount.toFixed(2)} XLM`;
};

// Truncate stellar address
export const truncateAddress = (address: string, chars = 6): string => {
  if (!address) return '';
  return `${address.slice(0, chars)}...${address.slice(-4)}`;
};

// Build a payment transaction for buying a property
export const buildPaymentTransaction = async (
  buyerPublicKey: string,
  sellerPublicKey: string,
  amountXLM: number
): Promise<string> => {
  const account = await server.loadAccount(buyerPublicKey);
  
  const transaction = new StellarSdk.TransactionBuilder(account, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: STELLAR_NETWORK_PASSPHRASE,
  })
    .addOperation(
      StellarSdk.Operation.payment({
        destination: sellerPublicKey,
        asset: StellarSdk.Asset.native(),
        amount: amountXLM.toFixed(7),
      })
    )
    .addMemo(StellarSdk.Memo.text('DESTATE Property Purchase'))
    .setTimeout(30)
    .build();

  return transaction.toEnvelope().toXDR('base64');
};

// Submit a signed transaction
export const submitTransaction = async (signedXdr: string): Promise<string> => {
  const transaction = StellarSdk.TransactionBuilder.fromXDR(
    signedXdr,
    STELLAR_NETWORK_PASSPHRASE
  );
  const result = await server.submitTransaction(transaction);
  return result.hash;
};

// Fund a testnet account using Friendbot
export const fundTestnetAccount = async (publicKey: string): Promise<void> => {
  const response = await fetch(
    `https://friendbot.stellar.org/?addr=${encodeURIComponent(publicKey)}`
  );
  if (!response.ok) throw new Error('Friendbot funding failed');
};

// Get account balance
export const getAccountBalance = async (publicKey: string): Promise<number> => {
  try {
    const account = await server.loadAccount(publicKey);
    const nativeBalance = account.balances.find(
      (b: any) => b.asset_type === 'native'
    );
    return nativeBalance ? parseFloat(nativeBalance.balance) : 0;
  } catch {
    return 0;
  }
};

// Validate Stellar public key
export const isValidStellarAddress = (address: string): boolean => {
  try {
    StellarSdk.Keypair.fromPublicKey(address);
    return true;
  } catch {
    return false;
  }
};

// Property transaction types
export interface PropertyTransaction {
  hash: string;
  property_id: string;
  buyer: string;
  seller: string;
  amount: number;
  timestamp: string;
}
