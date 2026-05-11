'use client';

import React, { useMemo } from 'react';


const DataTable = ({ 
    columns, 
    data, 
    keyField = 'id', 
    isLoading = false, 
    emptyMessage = "No records found.",
    onRowClick,
    actions,
    searchQuery = '',
    searchKeys,
    searchPredicate
}) => {
    const safeColumns = Array.isArray(columns) ? columns : [];
    const safeData = Array.isArray(data) ? data : [];

    const filteredData = useMemo(() => {
        const normalizedQuery = String(searchQuery || '').trim().toLowerCase();
        if (!normalizedQuery) return safeData;

        const searchableColumns = safeColumns.filter((column) => column.searchable !== false);
        const defaultKeys = searchableColumns.map((column) => column.key).filter(Boolean);
        const keysToSearch = Array.isArray(searchKeys) && searchKeys.length ? searchKeys : defaultKeys;

        if (!keysToSearch.length) return safeData;

        const formatValue = (value) => {
            if (value === null || value === undefined) return '';
            if (typeof value === 'string') return value;
            if (typeof value === 'number' || typeof value === 'boolean') return String(value);
            if (value instanceof Date) return value.toLocaleDateString();
            if (Array.isArray(value)) return value.map(formatValue).join(' ');
            if (typeof value === 'object') return JSON.stringify(value);
            return String(value);
        };

        const defaultPredicate = (row) => {
            return keysToSearch.some((key) => {
                const column = safeColumns.find((col) => col.key === key);
                const rawValue = column?.searchValue ? column.searchValue(row) : row?.[key];
                const normalizedValue = formatValue(rawValue).toLowerCase();
                return normalizedValue.includes(normalizedQuery);
            });
        };

        const predicate = searchPredicate
            ? (row) => searchPredicate(row, normalizedQuery)
            : defaultPredicate;

        return safeData.filter(predicate);
    }, [safeColumns, safeData, searchKeys, searchQuery, searchPredicate]);

    // --- Loading State ---
    if (isLoading) {
        return (
            <div className="w-full p-10 flex flex-col justify-center items-center text-gray-500 bg-white rounded-xl border border-gray-200">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-sm font-medium">Loading data...</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
                {/* --- TABLE HEADER --- */}
                <thead className="bg-gray-50/80">
                    <tr>
                        {columns.map((col) => (
                            <th 
                                key={col.key} 
                                className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs"
                            >
                                {col.label}
                            </th>
                        ))}
                        {/* Optional Actions Column Header */}
                        {actions && (
                            <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs text-right">
                                Actions
                            </th>
                        )}
                    </tr>
                </thead>

                {/* --- TABLE BODY --- */}
                <tbody className="divide-y divide-gray-100">
                    {filteredData.length === 0 ? (
                        /* Empty State */
                        <tr>
                            <td colSpan={columns.length + (actions ? 1 : 0)} className="px-6 py-12 text-center text-gray-500">
                                <div className="flex flex-col items-center justify-center">
                                    <svg className="w-10 h-10 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                    </svg>
                                    <p className="text-sm">{emptyMessage}</p>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        /* Data Rows */
                        filteredData.map((row, index) => (
                            <tr 
                                key={row[keyField] || index} 
                                className={`transition-colors hover:bg-gray-50/50 ${onRowClick ? 'cursor-pointer' : ''}`}
                                onClick={() => onRowClick && onRowClick(row)}
                            >
                                {columns.map((col) => (
                                    <td key={`${row[keyField] || index}-${col.key}`} className="px-6 py-4 whitespace-nowrap text-gray-700">
                                        {/* 🌟 The Magic Part: Use custom render function if provided, else output raw text */}
                                        {col.render ? col.render(row[col.key], row) : row[col.key]}
                                    </td>
                                ))}
                                
                                {/* Optional Actions Column Body */}
                                {actions && (
                                    <td className="px-6 py-4 whitespace-nowrap text-right font-medium">
                                        {actions(row)}
                                    </td>
                                )}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default DataTable;