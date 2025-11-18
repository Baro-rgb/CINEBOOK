import React, { useState } from 'react';
import { MapPin, Clock, Star, Search, Filter } from 'lucide-react';
import BlurCircle from '../components/BlurCircle';
import { useAppContext } from '../context/AppContext';

const TheaterCard = ({ theater }) => {
  return (
    <div className="group bg-gradient-to-br from-zinc-900 to-zinc-950 p-6 rounded-2xl shadow-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/20 border border-zinc-800 hover:border-primary/50 relative overflow-hidden">
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-transparent transition-all duration-300 pointer-events-none" />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-xl font-bold text-white tracking-tight leading-tight flex-1 pr-2">
            {theater.name}
          </h2>
          {theater.rating && (
            <div className="flex items-center gap-1 bg-amber-500/10 px-2.5 py-1 rounded-lg backdrop-blur-sm flex-shrink-0">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span className="text-sm font-semibold text-amber-500">{theater.rating}</span>
            </div>
          )}
        </div>
        
        {/* Location */}
        <div className="flex items-start gap-2 mb-5">
          <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
          <p className="text-sm text-zinc-400 leading-relaxed">{theater.location}</p>
        </div>

        {/* Schedule */}
        {theater.schedule && theater.schedule.length > 0 && (
          <div className="mb-5">
            <div className="flex items-center gap-2 text-sm font-medium text-zinc-300 mb-3">
              <Clock className="w-4 h-4 text-primary" />
              <span>Available Showtimes</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {theater.schedule.slice(0, 5).map((time, index) => (
                <span 
                  key={index} 
                  className="px-3 py-1.5 text-xs font-medium bg-zinc-800 text-zinc-300 rounded-lg hover:bg-primary hover:text-white transition-all duration-200 cursor-pointer"
                >
                  {time}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* CTA Button */}
        <button className="w-full mt-2 py-2.5 text-sm font-semibold bg-primary text-white rounded-xl shadow-lg hover:bg-primary-dull transition-all duration-300 hover:shadow-primary/50">
          View Details & Book
        </button>
      </div>
    </div>
  );
};

const Theaters = () => {
  const { theaters } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('all');

  // Filter theaters based on search and district
  const filteredTheaters = theaters?.filter(theater => {
    const matchesSearch = theater.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         theater.location?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDistrict = selectedDistrict === 'all' || 
                           theater.location?.toLowerCase().includes(selectedDistrict.toLowerCase());
    return matchesSearch && matchesDistrict;
  }) || [];

  // Extract unique districts from theaters
  const districts = [...new Set(theaters?.map(t => {
    const match = t.location?.match(/District \d+|Quận \d+|Thủ Đức/i);
    return match ? match[0] : null;
  }).filter(Boolean))] || [];

  return (
    <div className="relative my-40 mb-60 md:px-16 lg:px-40 xl:px-44 overflow-hidden min-h-[80vh]">
      <BlurCircle top="200px" right="50px" color="rgba(248, 69, 101, 0.15)" /> 
      <BlurCircle bottom="100px" left="10px" color="rgba(248, 69, 101, 0.1)" />

      {/* Page Header */}
      <div className="mb-10 relative z-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
          Our Theaters
        </h1>
        <p className="text-zinc-400 text-sm">Find the perfect cinema near you</p>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-12 relative z-10">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
          <input
            type="text"
            placeholder="Search theaters by name or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
          />
        </div>
        
        <div className="relative md:w-48">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 pointer-events-none" />
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="w-full pl-12 pr-10 py-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 appearance-none cursor-pointer transition-all"
          >
            <option value="all">All Districts</option>
            {districts.map((district, idx) => (
              <option key={idx} value={district}>{district}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Theater Grid */}
      {filteredTheaters.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          {filteredTheaters.map((theater) => (
            <TheaterCard theater={theater} key={theater._id} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-zinc-400 relative z-10">
          <div className="w-20 h-20 mb-4 rounded-full bg-zinc-900 flex items-center justify-center">
            <MapPin className="w-10 h-10 text-zinc-700" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">No theaters found</h2>
          <p className="text-sm">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Load More Button */}
      {filteredTheaters.length > 0 && filteredTheaters.length >= 6 && (
        <div className='flex justify-center mt-16 relative z-10'>
          <button className='px-8 py-3 bg-primary text-white font-semibold rounded-full shadow-lg hover:bg-primary-dull hover:shadow-primary/50 transition-all duration-300 hover:scale-105'>
            Load More Theaters
          </button>
        </div>
      )}
    </div>
  );
};

export default Theaters;