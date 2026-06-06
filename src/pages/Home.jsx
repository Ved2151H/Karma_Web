import React from 'react';
import HeroBanner from '../components/HeroBanner/HeroBanner';
import FeaturedProducts from '../components/home/FeaturedProducts';
import NewArrivals from '../components/home/NewArrivals';

function Home() {
  return (
    <div className="w-full bg-white font-sans overflow-hidden">
      {/* Hero Slider Section */}
      <HeroBanner />

      {/* Featured Products Section */}
      <FeaturedProducts />

      {/* New Arrivals Section */}
      <NewArrivals />
    </div>
  );
}

export default Home;
