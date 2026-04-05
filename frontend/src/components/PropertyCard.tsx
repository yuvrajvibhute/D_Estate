import React, { useState } from 'react';
import { buyProperty, type Property } from '../utils/contract';
import { MapPin, Coins, ExternalLink } from 'lucide-react';
import { useFreighter } from '../hooks/useFreighter';
import toast from 'react-hot-toast';

interface PropertyCardProps {
  property: Property;
  onBuyUpdate?: () => void;
  isOwnerView?: boolean;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, onBuyUpdate, isOwnerView }) => {
  const { isWalletConnected, address } = useFreighter();
  const [loading, setLoading] = useState(false);

  const handleBuy = async () => {
    if (!isWalletConnected || !address) {
      toast.error('Please connect your Freighter wallet first.');
      return;
    }
    
    setLoading(true);
    const toastId = toast.loading('Initiating transaction on Stellar Soroban...');
    
    try {
      // Simulate external transaction
      const success = await buyProperty(property.id, address);
      if (success) {
        toast.success('Property details updated on the blockchain!', { id: toastId });
        if (onBuyUpdate) onBuyUpdate();
      } else {
        toast.error('Transaction failed.', { id: toastId });
      }
    } catch (e: any) {
      toast.error('Error during transaction', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card overflow-hidden group">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={property.imageUrl} 
          alt={property.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />
        <div className="absolute bottom-3 left-4 flex items-center space-x-1 text-white">
          <MapPin className="w-4 h-4 text-purple-400" />
          <span className="text-sm font-medium drop-shadow-md">{property.location}</span>
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-white leading-tight">{property.title}</h3>
          <div className="flex flex-col items-end">
            <span className="flex items-center space-x-1 text-secondary font-bold text-lg">
              <Coins className="w-4 h-4" />
              <span>{property.price.toLocaleString()} XLM</span>
            </span>
          </div>
        </div>
        
        <p className="text-slate-400 text-sm mb-4 line-clamp-2">{property.description}</p>
        
        <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
              <span className="text-xs font-mono">{property.owner.substring(0,2)}</span>
            </div>
            <div className="text-xs text-slate-400">
              <p>Owner Info</p>
              <p className="font-mono text-slate-300">{property.owner.slice(0,6)}...{property.owner.slice(-4)}</p>
            </div>
          </div>
          
          {!isOwnerView && property.active && (
             <button 
               onClick={handleBuy}
               disabled={loading || (isWalletConnected && address === property.owner)}
               className="bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/50 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center space-x-1"
             >
               {loading ? 'Processing...' : 'Buy Now'}
               {!loading && <ExternalLink className="w-3 h-3 ml-1" />}
             </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
