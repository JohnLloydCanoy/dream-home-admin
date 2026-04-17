import React, { useId } from 'react';

const FormField = ({ 
    label, 
    field, 
    value, 
    onChange, 
    error, 
    type = "text", 
    children, 
    required = true, 
    className = "", 
    labelClass = "text-gray-700", 
    placeholder = "" 
}) => {
    const inputId = useId();

    const baseInputClasses = `
        w-full p-2.5 text-sm border rounded-lg transition-all duration-200 outline-none
        placeholder:text-gray-400
        ${error 
            ? 'border-red-500 bg-red-50/30 focus:ring-4 focus:ring-red-500/10' 
            : 'border-gray-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 hover:border-gray-400'
        }
    `;

    return (
        <div className={`flex flex-col gap-1.5 ${className}`}>
            <div className="flex justify-between items-center">
                <label 
                    htmlFor={inputId}
                    className={`text-[11px] font-bold uppercase tracking-wider ${labelClass} flex items-center gap-1`}
                >
                    {label} 
                    {required && <span className="text-red-500 text-sm font-black leading-none">*</span>}
                </label>
                
                {/* Optional: Small status text could go here */}
            </div>

            <div className="relative">
                {type === "select" ? (
                    <select 
                        id={inputId}
                        value={value || ""} 
                        onChange={(e) => onChange(field, e.target.value)}
                        className={`${baseInputClasses} bg-white appearance-none cursor-pointer pr-10`}
                    >
                        {children}
                    </select>
                ) : type === "textarea" ? (
                    <textarea
                        id={inputId}
                        value={value || ""}
                        onChange={(e) => onChange(field, e.target.value)}
                        className={`${baseInputClasses} min-h-28 resize-y`}
                        placeholder={placeholder}
                    />
                ) : (
                    <input 
                        id={inputId}
                        type={type}
                        value={value || ""} 
                        onChange={(e) => onChange(field, e.target.value)} 
                        className={baseInputClasses}
                        placeholder={placeholder}
                    />
                )}
                {type === "select" && (
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                )}
            </div>

            {error && (
                <div className="flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1">
                    <svg className="w-3.5 h-3.5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <p className="text-red-500 text-[11px] font-bold leading-none">{error}</p>
                </div>
            )}
        </div>
    );
};

export default FormField;