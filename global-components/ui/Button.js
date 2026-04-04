import React from 'react';

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary', 
  size = 'md',        
  className = '',     
  disabled = false,
  isLoading = false,
  ...props          
}) => {
  //  Base classes that every button gets
  const baseClasses = "inline-flex items-center justify-center font-bold rounded-lg transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none";

  //  Variant specific styles (Using your DreamHome colors)
  const variants = {
    primary: "bg-[#002147] hover:bg-[#001833] text-white shadow-md",
    secondary: "bg-blue-50 hover:bg-blue-100 text-[#002147] border border-blue-200",
    danger: "bg-[#E11553] hover:bg-red-700 text-white shadow-md",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-600",
  };

  //  Size specific styles
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-6 py-2.5 text-sm",
    lg: "px-8 py-3 text-base",
  };

  // Combine them all together
  const combinedClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={combinedClasses}
      {...props}
    >
      {/* Loading Spinner */}
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      
      {/* Button Content */}
      {children}
    </button>
  );
};

export default Button;