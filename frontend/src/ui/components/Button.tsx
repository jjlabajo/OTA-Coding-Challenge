import React from 'react';

// Define the props for the component
interface ButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  className = '', // Default to empty string if no extra classes are passed
  type = 'button',
  disabled = false
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={"cursor-pointer px-5 py-1 text-small bg-lime-300 text-black font-small rounded-full transition-colors duration-200 ease-in-out hover:bg-slate-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-lime-500 focus:ring-offset-2 " + className}
    >
      {children}
    </button>
  );
};

export default Button;