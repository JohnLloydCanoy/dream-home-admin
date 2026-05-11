'use client';

// ─── SortControls ─────────────────────────────────────────────────────────────
// Reusable "Sort by Name / Sort by Date" button strip.
//
// Quick usage in any page component:
//
//   import { useState, useMemo } from 'react';
//   import SortControls from '@/components/ui/Sorting';
//   import { applySort, createSortHandler } from '@/components/functions/SortingFunc';
//
//   const [sortConfig, setSortConfig] = useState({ field: null, direction: 'asc' });
//   const handleSort = createSortHandler(setSortConfig);
//   const sortedData = useMemo(() => applySort(rawData, sortConfig, 'name', 'created_at'), [rawData, sortConfig]);
//
//   <SortControls sortConfig={sortConfig} onSort={handleSort} />
//
// Props:
//   sortConfig   – { field: 'name' | 'date' | null, direction: 'asc' | 'desc' }
//   onSort       – (field: 'name' | 'date') => void
//   nameLabel    – Button label override.  Default: 'Name'.
//   dateLabel    – Button label override.  Default: 'Date Added'.
//   className    – Extra classes for the wrapper <div>.

import React from 'react';

// ─── Icons ────────────────────────────────────────────────────────────────────

function ArrowUpIcon() {
    return (
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 15l7-7 7 7" />
        </svg>
    );
}

function ArrowDownIcon() {
    return (
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 9l-7 7-7-7" />
        </svg>
    );
}

// Shown on inactive buttons to hint that sorting is available.
function ArrowsUpDownIcon() {
    return (
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
        </svg>
    );
}

// ─── SortButton ───────────────────────────────────────────────────────────────

function SortButton({ field, label, sortConfig, onSort }) {
    const isActive = sortConfig.field === field;
    const isAsc    = sortConfig.direction === 'asc';

    return (
        <button
            type="button"
            onClick={() => onSort(field)}
            aria-pressed={isActive}
            aria-label={`Sort by ${label}${isActive ? ` — currently ${isAsc ? 'A to Z / oldest' : 'Z to A / newest'}` : ''}`}
            className={[
                'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border',
                'transition-all duration-150 focus:outline-none focus-visible:ring-2',
                'focus-visible:ring-[#003580] focus-visible:ring-offset-1',
                isActive
                    ? 'bg-[#003580] text-white border-[#003580] shadow-sm'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-[#003580] hover:text-[#003580] hover:bg-blue-50/50',
            ].join(' ')}
        >
            {label}
            <span className={isActive ? 'text-blue-200' : 'text-gray-300'}>
                {isActive
                    ? (isAsc ? <ArrowUpIcon /> : <ArrowDownIcon />)
                    : <ArrowsUpDownIcon />
                }
            </span>
        </button>
    );
}

// ─── SortControls (default export) ───────────────────────────────────────────

/**
 * @param {{ field: 'name' | 'date' | null, direction: 'asc' | 'desc' }} sortConfig
 * @param {(field: 'name' | 'date') => void} onSort
 * @param {string} [nameLabel]   Default: 'Name'
 * @param {string} [dateLabel]   Default: 'Date Added'
 * @param {string} [className]   Extra wrapper classes
 */
export default function SortControls({
    sortConfig = { field: null, direction: 'asc' },
    onSort,
    nameLabel = 'Name',
    dateLabel = 'Date Added',
    className = '',
}) {
    return (
        <div className={`inline-flex items-center gap-2 ${className}`}>
            <span className="text-xs text-gray-400 font-medium select-none mr-1">Sort</span>

            <SortButton
                field="name"
                label={nameLabel}
                sortConfig={sortConfig}
                onSort={onSort}
            />

            <SortButton
                field="date"
                label={dateLabel}
                sortConfig={sortConfig}
                onSort={onSort}
            />
        </div>
    );
}
