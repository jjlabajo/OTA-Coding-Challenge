import React, { ReactNode } from 'react';

interface HeaderProps {
  children?: ReactNode;
}

const Header: React.FC<HeaderProps> = ({ children }) => {
  // No state or effect needed

  return (
    // Apply the custom animation class and base text color
    <header className="header-scroll-animation text-white bg-[#212427]">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center transition-all duration-300"> {/* Optional: transition for padding/height if needed */}
        {/* Logo */}
        <div className="flex-shrink-0">
        </div>

        {/* Primary Navigation */}
        <div className="hidden md:flex items-center space-x-6">
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-4 text-xs text-gray-400">
          </div>
          {children}
        </div>
      </nav>
    </header>
  );
};

export default Header;