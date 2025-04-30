import React from 'react';

// Define the props for the component
interface ButtonProps {
  /**
   * Optional click handler function.
   */
  onClick?: () => void;
  /**
   * The content to be displayed inside the button (e.g., text).
   */
  children: React.ReactNode;
  /**
   * Optional additional CSS classes to apply to the button.
   */
  className?: string;
}

/**
 * A reusable button component styled with Tailwind CSS,
 * matching the appearance from the provided image.
 * It features a lime-yellow background by default, transitioning
 * to dark gray on hover.
 */
const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  className = '', // Default to empty string if no extra classes are passed
}) => {
  return (
    <button
      type="button" // Good practice to define button type
      onClick={onClick}
      // Combine base classes, hover/focus states, and any additional classes
      className="px-5 py-1 text-small bg-lime-300 text-black font-small rounded-full transition-colors duration-200 ease-in-out hover:bg-slate-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-lime-500 focus:ring-offset-2"
    >
      {children}
    </button>
  );
};

export default Button;