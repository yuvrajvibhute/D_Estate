import { useState, useEffect } from 'react';
import {
  isConnected,
  requestAccess,
  getAddress,
  getNetworkDetails,
  signTransaction
} from '@stellar/freighter-api';

export const useFreighter = () => {
  const [address, setAddress] = useState<string | null>(null);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [network, setNetwork] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      if (await isConnected()) {
        const res = await getAddress();
        const _address = typeof res === 'object' ? (res as any).address || (res as any).publicKey : res;
        if (_address) {
          setAddress(String(_address));
          setIsWalletConnected(true);
          const _network = await getNetworkDetails();
          setNetwork(typeof _network === 'object' ? (_network as any).network || String(_network) : String(_network));
        }
      }
    } catch (e) {
      console.error("Freighter not connected or locked", e);
    }
  };

  const connect = async () => {
    try {
      setLoading(true);
      if (await isConnected()) {
        await requestAccess();
        const res = await getAddress();
        const _address = typeof res === 'object' ? (res as any).address || (res as any).publicKey : res;
        const resNet = await getNetworkDetails();
        const _network = typeof resNet === 'object' ? (resNet as any).network || String(resNet) : String(resNet);
        setAddress(String(_address));
        setNetwork(String(_network));
        setIsWalletConnected(true);
      } else {
        alert('Please install Freighter Wallet Extension!');
        window.open('https://freighter.app', '_blank');
      }
    } catch (error) {
      console.error('Error connecting to Freighter', error);
    } finally {
      setLoading(false);
    }
  };

  const disconnect = () => {
    setAddress(null);
    setIsWalletConnected(false);
    setNetwork('');
  };

  return {
    address,
    isWalletConnected,
    network,
    loading,
    connect,
    disconnect,
    signTransaction
  };
};
