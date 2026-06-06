import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useSearch } from '../../context/SearchContext';

function SearchBar() {
  const { searchQuery, setSearchQuery } = useSearch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-[720px] h-[50px] flex items-center">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Enter Keyword or Item"
        className="w-full h-full bg-transparent border border-[rgba(255,255,255,0.35)] rounded-full pl-12 pr-6 text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-brand-red transition-colors font-sans"
      />
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none flex items-center">
        <Search className="w-4 h-4 text-white" />
      </div>
    </form>
  );
}

export default SearchBar;
