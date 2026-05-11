'use client';

import React from 'react';

const sizeClasses = {
	sm: 'h-9 pl-9 pr-8 text-xs',
	md: 'h-10 pl-10 pr-9 text-sm',
	lg: 'h-12 pl-12 pr-10 text-base'
};

const iconClasses = {
	sm: 'h-4 w-4',
	md: 'h-4 w-4',
	lg: 'h-5 w-5'
};

export default function SearchBar({
	value = '',
	onChange,
	onClear,
	placeholder = 'Search...',
	size = 'md',
	className = '',
	inputClassName = '',
	disabled = false
}) {
	const handleChange = (event) => {
		if (onChange) onChange(event.target.value);
	};

	const handleClear = () => {
		if (onClear) {
			onClear();
		} else if (onChange) {
			onChange('');
		}
	};

	const hasValue = Boolean(value);

	return (
		<div className={`relative ${className}`}>
			<div className="absolute inset-y-0 left-3 flex items-center text-gray-400">
				<svg className={iconClasses[size] || iconClasses.md} viewBox="0 0 24 24" fill="none" stroke="currentColor">
					<circle cx="11" cy="11" r="7" strokeWidth="2" />
					<path d="M20 20L16.5 16.5" strokeWidth="2" strokeLinecap="round" />
				</svg>
			</div>
			<input
				type="text"
				value={value}
				onChange={handleChange}
				placeholder={placeholder}
				aria-label="Search"
				disabled={disabled}
				className={`w-full rounded-lg border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-600/10 ${sizeClasses[size] || sizeClasses.md} ${inputClassName}`}
			/>
			{hasValue && !disabled && (
				<button
					type="button"
					onClick={handleClear}
					className="absolute inset-y-0 right-2 flex items-center text-gray-400 hover:text-gray-700"
					aria-label="Clear search"
				>
					<svg className={iconClasses[size] || iconClasses.md} viewBox="0 0 24 24" fill="none" stroke="currentColor">
						<path d="M6 6L18 18" strokeWidth="2" strokeLinecap="round" />
						<path d="M18 6L6 18" strokeWidth="2" strokeLinecap="round" />
					</svg>
				</button>
			)}
		</div>
	);
}
