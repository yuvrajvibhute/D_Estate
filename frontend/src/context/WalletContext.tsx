import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import {
  isConnected,
  requestAccess,
  signTransaction,
  getNetwork,
  getAddress,
} from '@stellar/freighter-api';

interface WalletContextType {
  publicKey: string | null;
  network: string | null;
  isWalletConnected: boolean;
  isConnecting: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  signTx: (xdr: string) => Promise<string>;
}

const WalletContext = createContext<WalletContextType | null>(null);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [network, setNetwork] = useState<string | null>(null);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const connectWallet = useCallback(async () => {
    setIsConnecting(true);
    try {
      // Check if Freighter is installed
      const connectedResult = await isConnected();
      const connected =
        typeof connectedResult === 'boolean'
          ? connectedResult
          : (connectedResult as any)?.isConnected ?? false;

      if (!connected) {
        window.open('https://freighter.app/', '_blank');
        throw new Error('Please install Freighter wallet extension');
      }

      // Request access
      await requestAccess();

      // Get public key via getAddress
      const addrResult = await getAddress();
      const pk =
        typeof addrResult === 'string'
          ? addrResult
          : (addrResult as any)?.address ?? null;
      if (!pk) throw new Error('Could not retrieve public key');

      // Get network
      let net: string = 'TESTNET';
      try {
        const netObj = await getNetwork();
        if (typeof netObj === 'string') {
          net = netObj;
        } else if (netObj && typeof netObj === 'object' && 'network' in netObj) {
          net = (netObj as any).network;
        }
      } catch {
        net = 'TESTNET';
      }

      setPublicKey(pk);
      setNetwork(net);
      setIsWalletConnected(true);
    } catch (err: any) {
      console.error('Wallet connection error:', err);
      throw err;
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    setPublicKey(null);
    setNetwork(null);
    setIsWalletConnected(false);
  }, []);

  const signTx = useCallback(async (xdr: string): Promise<string> => {
    try {
      const result = await signTransaction(xdr, {
        networkPassphrase: 'Test SDF Network ; September 2015',
      });
      if (typeof result === 'string') return result;
      if (result && typeof result === 'object' && 'signedTxXdr' in result) {
        return (result as any).signedTxXdr;
      }
      throw new Error('Could not get signed transaction');
    } catch (err: any) {
      throw new Error(`Transaction signing failed: ${err.message}`);
    }
  }, []);

  return (
    <WalletContext.Provider
      value={{
        publicKey,
        network,
        isWalletConnected,
        isConnecting,
        connectWallet,
        disconnectWallet,
        signTx,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error('useWallet must be used within WalletProvider');
  return ctx;
};
