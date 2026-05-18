import React from 'react';

export default function Button({ 
    children, 
    variant = 'primary', 
    size = 'md', 
    disabled = false, 
    onClick, 
    type = 'button',
    className = ''
}) {
    const baseStyle = "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
    
    const variants = {
        primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
        secondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-blue-500",
        ghost: "bg-transparent text-gray-600 hover:bg-gray-100 focus:ring-gray-500",
        danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
    };

    const sizes = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2 text-sm",
        lg: "px-6 py-3 text-base"
    };

    const styles = `${baseStyle} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`;

    return (
        <button
            type={type}
            disabled={disabled}
            onClick={onClick}
            className={styles}
        >
            {children}
        </button>
    );
}
