'use client';

// ─── PaginationControls ───────────────────────────────────────────────────────
// Reusable numbered-page navigation bar.
//
// Quick usage in any page component:
//
//   import { useState } from 'react';
//   import PaginationControls from '@/components/ui/pagination';
//   import { paginateData, getPageCount, getPageInfo } from '@/components/functions/paginationfunc';
//
//   const [currentPage, setCurrentPage] = useState(1);
//   const PAGE_SIZE = 10;
//
//   const pageCount = getPageCount(data.length, PAGE_SIZE);
//   const pagedData = paginateData(data, currentPage, PAGE_SIZE);
//
//   <PaginationControls
//       currentPage={currentPage}
//       pageCount={pageCount}
//       pageSize={PAGE_SIZE}
//       totalItems={data.length}
//       onPageChange={setCurrentPage}
//   />
//
// Props:
//   currentPage  – current 1-indexed page number
//   pageCount    – total number of pages
//   pageSize     – records per page (used for "Showing X–Y of Z")
//   totalItems   – total record count (used for "Showing X–Y of Z")
//   onPageChange – (page: number) => void
//   className    – extra classes for the wrapper <div>

import React from 'react';
import { getPageInfo, getPageRange } from '@/components/functions/paginationfunc';

// ─── Icons ────────────────────────────────────────────────────────────────────

function ChevronLeftIcon() {
    return (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
        </svg>
    );
}

function ChevronRightIcon() {
    return (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
        </svg>
    );
}

// ─── PageButton ───────────────────────────────────────────────────────────────

function PageButton({ page, isActive, onClick }) {
    return (
        <button
            type="button"
            onClick={() => onClick(page)}
            aria-current={isActive ? 'page' : undefined}
            aria-label={`Go to page ${page}`}
            className={[
                'min-w-[2rem] h-8 px-2 rounded-lg text-xs font-semibold border transition-all duration-150',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#003580] focus-visible:ring-offset-1',
                isActive
                    ? 'bg-[#003580] text-white border-[#003580] shadow-sm'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-[#003580] hover:text-[#003580] hover:bg-blue-50/50',
            ].join(' ')}
        >
            {page}
        </button>
    );
}

function NavButton({ onClick, disabled, children, ariaLabel }) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            aria-label={ariaLabel}
            className={[
                'h-8 px-2.5 rounded-lg text-xs font-semibold border transition-all duration-150',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#003580] focus-visible:ring-offset-1',
                'bg-white text-gray-600 border-gray-200',
                'hover:border-[#003580] hover:text-[#003580] hover:bg-blue-50/50',
                'disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white',
                'disabled:hover:border-gray-200 disabled:hover:text-gray-600',
            ].join(' ')}
        >
            {children}
        </button>
    );
}

// ─── PaginationControls (default export) ─────────────────────────────────────

/**
 * @param {number}   currentPage
 * @param {number}   pageCount
 * @param {number}   pageSize
 * @param {number}   totalItems
 * @param {Function} onPageChange   (page: number) => void
 * @param {string}  [className]     Extra wrapper classes
 */
export default function PaginationControls({
    currentPage,
    pageCount,
    pageSize,
    totalItems,
    onPageChange,
    className = '',
}) {
    if (pageCount <= 1 && totalItems <= pageSize) return null;

    const pageRange = getPageRange(currentPage, pageCount);
    const info = getPageInfo(currentPage, pageSize, totalItems);

    return (
        <div className={`flex flex-wrap items-center justify-between gap-3 ${className}`}>

            {/* ── Record info ── */}
            <span className="text-xs text-gray-400 font-medium select-none">
                {info}
            </span>

            {/* ── Page controls ── */}
            <div className="inline-flex items-center gap-1.5">

                {/* Previous */}
                <NavButton
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                    ariaLabel="Go to previous page"
                >
                    <span className="inline-flex items-center gap-1">
                        <ChevronLeftIcon /> Prev
                    </span>
                </NavButton>

                {/* Numbered pages */}
                {pageRange.map((page, index) =>
                    page === null ? (
                        <span
                            key={`ellipsis-${index}`}
                            className="px-1 text-xs text-gray-400 select-none"
                        >
                            …
                        </span>
                    ) : (
                        <PageButton
                            key={page}
                            page={page}
                            isActive={page === currentPage}
                            onClick={onPageChange}
                        />
                    )
                )}

                {/* Next */}
                <NavButton
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage >= pageCount}
                    ariaLabel="Go to next page"
                >
                    <span className="inline-flex items-center gap-1">
                        Next <ChevronRightIcon />
                    </span>
                </NavButton>

            </div>
        </div>
    );
}
