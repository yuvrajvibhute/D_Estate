import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerProperty } from '../utils/contract';
import { useFreighter } from '../hooks/useFreighter';
import toast from 'react-hot-toast';
import { PlusCircle } from 'lucide-react';

const ListProperty: React.FC = () => {
  const { isWalletConnected, address } = useFreighter();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    location: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isWalletConnected || !address) {
      toast.error('Please connect your Freighter wallet to list a property.');
      return;
    }
    
    if (!formData.title || !formData.price || !formData.location) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    const toastId = toast.loading('Registering property on blockchain...');
    
    try {
      await registerProperty(
        formData.title,
        Number(formData.price),
        formData.location,
        formData.description,
        address
      );
      toast.success('Property successfully listed!', { id: toastId });
      navigate('/dashboard');
    } catch (err) {
      toast.error('Failed to list property. Check your wallet connection.', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in relative z-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-white mb-3">List Your Property</h1>
        <p className="text-slate-400">Tokenize your real estate asset on the Stellar network to reach global buyers instantly.</p>
      </div>

      <div className="glass-card p-8 md:p-10">
        {!isWalletConnected && (
          <div className="bg-purple-900/40 border border-purple-500/50 rounded-xl p-4 mb-8 text-center">
            <p className="text-purple-200">You must connect your Freighter wallet to list properties.</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Property Title *</label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. Neon Penthouse"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                disabled={!isWalletConnected || loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Price (XLM) *</label>
              <input
                type="number"
                min="0"
                className="input-field"
                placeholder="e.g. 150000"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                disabled={!isWalletConnected || loading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Location *</label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. District 9, Alpha City"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              disabled={!isWalletConnected || loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
            <textarea
              rows={4}
              className="input-field resize-none"
              placeholder="Describe your property details, amenities, and unique features..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              disabled={!isWalletConnected || loading}
            ></textarea>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={!isWalletConnected || loading}
              className="btn-primary w-full md:w-auto flex justify-center items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <PlusCircle className="w-5 h-5" />
                  <span>Submit Listing</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ListProperty;
