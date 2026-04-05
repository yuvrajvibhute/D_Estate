import React, { useEffect, useState } from 'react';
import { getProperties, type Property } from '../utils/contract';
import PropertyCard from '../components/PropertyCard';
import { Search } from 'lucide-react';

const Marketplace: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const data = await getProperties();
      setProperties(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const filtered = properties.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in relative z-10">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-extrabold text-white mb-2">Marketplace</h1>
          <p className="text-slate-400">Discover and buy tokenized premium real estate.</p>
        </div>
        
        <div className="mt-6 md:mt-0 relative w-full md:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-500" />
          </div>
          <input
            type="text"
            className="input-field pl-10"
            placeholder="Search location or title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <h3 className="text-xl text-white font-medium mb-2">No properties found</h3>
          <p className="text-slate-400">Try adjusting your search criteria or check back later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map(property => (
            <PropertyCard 
              key={property.id} 
              property={property} 
              onBuyUpdate={fetchProperties}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Marketplace;
