import React from 'react';

interface HeroProps {
  title: string;
}

const Hero: React.FC<HeroProps> = ({ title }) => {
  return (
    <section className="bg-[#212427] text-white py-16 md:py-24"> {/* Approximate dark background and padding */}
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold">{title}</h1>
      </div>
    </section>
  );
};

export default Hero;