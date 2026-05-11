'use client';

import React, { useState, useEffect, useMemo } from 'react';
import DataTable from '@/components/ui/DataTable';
import ConfirmDeleteModal from '@/components/ui/ConfirmDeleteModal';
import SortControls from '@/components/ui/Sorting';
import { applySort, createSortHandler } from '@/components/functions/SortingFunc';
import apiClient from '@/lib/apiClient';
import Button from '@components/ui/Button';

export default function CrudPageLayout({
    title,
    subtitle,
    addButtonLabel,
    endpoint,
    keyField,
    columns,
    renderFormModal,
    getDeleteModalItemName,
    renderTopContent,
    renderHeaderActions,
    renderHeaderMiddle,
    // Advanced / optional
    fetchData,
    customActions,
    onRowClick,
    searchQuery,
    searchKeys,
    searchPredicate,
    // ── Sorting ──────────────────────────────────────────────────────────────
    // nameKey  – field key string OR array, e.g. 'name' or ['first_name','last_name']
    // dateKey  – field key for the date column, e.g. 'created_at' or 'date_joined'
    // Pass either (or both) to enable the matching sort button automatically.
    nameKey,
    dateKey,
    sortNameLabel,          // override sort button label for Name  (default: 'Name')
    sortDateLabel,          // override sort button label for Date  (default: 'Date Added')
    // ── Pagination ───────────────────────────────────────────────────────────
    // pageSize = 0 means no pagination (all records shown)
    pageSize = 0,
}) {
    // ── Data ──────────────────────────────────────────────────────────────────
    const [dataList,  setDataList]  = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // ── Modals ────────────────────────────────────────────────────────────────
    const [isFormOpen,   setIsFormOpen]   = useState(false);
    const [itemToEdit,   setItemToEdit]   = useState(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    // ── Sorting ───────────────────────────────────────────────────────────────
    const [sortConfig, setSortConfig] = useState({ field: null, direction: 'asc' });
    const handleSort = createSortHandler(setSortConfig);

    // Only show sort controls when at least one key is provided
    const sortEnabled = nameKey !== undefined || dateKey !== undefined;

    // ── Pagination ────────────────────────────────────────────────────────────
    const [currentPage, setCurrentPage] = useState(1);

    // ── Fetch ─────────────────────────────────────────────────────────────────
    const loadData = async () => {
        setIsLoading(true);
        try {
            const data = fetchData ? await fetchData() : await apiClient(endpoint);
            setDataList(data?.results || data?.items || data || []);
        } catch (error) {
            console.error('Failed to load data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [endpoint]);

    // ── Sorted data ───────────────────────────────────────────────────────────
    const sortedData = useMemo(
        () => sortEnabled ? applySort(dataList, sortConfig, nameKey, dateKey) : dataList,
        [dataList, sortConfig, sortEnabled, nameKey, dateKey]
    );

    // ── Paginated data ────────────────────────────────────────────────────────
    const pageCount  = pageSize > 0 ? Math.max(1, Math.ceil(sortedData.length / pageSize)) : 1;
    const pagedData  = pageSize > 0 ? sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize) : sortedData;

    // Reset to page 1 whenever sort or data changes
    useEffect(() => {
        setCurrentPage(1);
    }, [sortConfig, dataList, pageSize]);

    // ── Action handlers ───────────────────────────────────────────────────────
    const handleAddClick    = () => { setItemToEdit(null); setIsFormOpen(true); };
    const handleEditClick   = (item) => { setItemToEdit(item);   setIsFormOpen(true);   };
    const handleDeleteClick = (item) => { setItemToDelete(item); setIsDeleteOpen(true); };

    const renderActions = (row) => (
        <div className="flex justify-end gap-3">
            <button onClick={(e) => { e.stopPropagation(); handleEditClick(row); }} className="text-blue-600 hover:text-blue-900 text-sm font-semibold">
                Edit
            </button>
            <button onClick={(e) => { e.stopPropagation(); handleDeleteClick(row); }} className="text-red-600 hover:text-red-900 text-sm font-semibold">
                Delete
            </button>
        </div>
    );

    const actionsToRender = customActions
        ? (row) => customActions(row, handleEditClick, handleDeleteClick)
        : renderActions;

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <div className="w-full max-w-7xl mx-auto space-y-6">

            {/* ── Page header ── */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div className="min-w-0">
                    <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
                    <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
                </div>
                {renderHeaderMiddle && (
                    <div className="w-full sm:flex-1 sm:flex sm:justify-end">
                        {renderHeaderMiddle(dataList)}
                    </div>
                )}
                <div className="flex items-center gap-3">
                    {renderHeaderActions && renderHeaderActions(dataList)}
                    <Button variant="primary" onClick={handleAddClick}>
                        {addButtonLabel}
                    </Button>
                </div>
            </div>

            {/* ── Optional top content (summary cards, etc.) ── */}
            {renderTopContent && renderTopContent(dataList)}

            {/* ── Data table ── */}
            <DataTable
                columns={columns}
                data={pagedData}
                keyField={keyField}
                isLoading={isLoading}
                actions={actionsToRender}
                searchQuery={searchQuery}
                searchKeys={searchKeys}
                searchPredicate={searchPredicate}
                onRowClick={onRowClick}
            />

            {/* ── Sort controls (below table) ── */}
            {sortEnabled && (
                <div className="flex items-center justify-end">
                    <SortControls
                        sortConfig={sortConfig}
                        onSort={handleSort}
                        nameLabel={sortNameLabel ?? (Array.isArray(nameKey) ? 'Name' : 'Name')}
                        dateLabel={sortDateLabel ?? (dateKey === 'date_joined' ? 'Date Joined' : 'Date Added')}
                    />
                </div>
            )}

            {/* ── Pagination ── */}
            {pageSize > 0 && (
                <div className="flex items-center justify-end gap-3 text-xs text-gray-500">
                    <span className="text-gray-400">
                        {sortedData.length === 0
                            ? 'No records'
                            : `Showing ${(currentPage - 1) * pageSize + 1}–${Math.min(currentPage * pageSize, sortedData.length)} of ${sortedData.length}`
                        }
                    </span>
                    <button
                        type="button"
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage <= 1}
                        className="px-3 py-2 rounded-md border border-gray-200 bg-white text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                        Previous
                    </button>
                    <span className="font-semibold text-gray-600">{currentPage} / {pageCount}</span>
                    <button
                        type="button"
                        onClick={() => setCurrentPage((p) => Math.min(pageCount, p + 1))}
                        disabled={currentPage >= pageCount}
                        className="px-3 py-2 rounded-md border border-gray-200 bg-white text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                        Next
                    </button>
                </div>
            )}

            {/* ── Form modal ── */}
            {renderFormModal && renderFormModal({
                isOpen: isFormOpen,
                onClose: () => setIsFormOpen(false),
                onSuccess: loadData,
                itemToEdit,
            })}

            {/* ── Delete modal ── */}
            <ConfirmDeleteModal
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onSuccess={loadData}
                endpoint={endpoint}
                idToDelete={itemToDelete?.[keyField]}
                itemName={itemToDelete && getDeleteModalItemName ? getDeleteModalItemName(itemToDelete) : ''}
            />
        </div>
    );
}