import React, { useEffect, useState } from 'react';
import { getOwnedProperties, type Property } from '../utils/contract';
import { useFreighter } from '../hooks/useFreighter';
import PropertyCard from '../components/PropertyCard';
import { LayoutDashboard, WalletCards } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { isWalletConnected, address } = useFreighter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isWalletConnected && address) {
      loadOwnedProperties();
    }
  }, [isWalletConnected, address]);

  const loadOwnedProperties = async () => {
    setLoading(true);
    try {
      const data = await getOwnedProperties(address!);
      setProperties(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!isWalletConnected) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center animate-fade-in z-10 w-full flex flex-col items-center">
        <div className="w-24 h-24 bg-purple-900/30 rounded-full flex items-center justify-center mb-6 border border-purple-500/30">
          <WalletCards className="w-12 h-12 text-purple-400" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">Dashboard Blocked</h2>
        <p className="text-slate-400 mb-8 max-w-md">Connect your Freighter wallet to view your owned properties and manage your portfolio.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in relative z-10">
      <div className="flex items-center space-x-3 mb-8 border-b border-slate-700/50 pb-6">
        <div className="p-3 bg-blue-600/20 rounded-lg">
          <LayoutDashboard className="w-8 h-8 text-blue-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Your Portfolio</h1>
          <p className="text-slate-400 font-mono text-sm mt-1">Wallet: {address}</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : properties.length === 0 ? (
        <div className="glass-card p-12 text-center border-dashed border-2 border-slate-600 bg-slate-800/10">
          <h3 className="text-xl text-white font-medium mb-3">Your Portfolio is Empty</h3>
          <p className="text-slate-400 mb-6">You haven't purchased any properties on DESTATE yet.</p>
          <Link to="/marketplace" className="btn-primary inline-flex items-center space-x-2">
            Explore Marketplace
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map(property => (
            <PropertyCard 
              key={property.id} 
              property={property} 
              isOwnerView={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
