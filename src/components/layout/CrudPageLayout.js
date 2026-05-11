'use client';

import React, { useState, useEffect } from 'react';
import DataTable from '@/components/ui/DataTable'; 
import ConfirmDeleteModal from '@/components/ui/ConfirmDeleteModal'; 
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
    // New Optional Props for Advanced Pages
    fetchData,
    customActions,
    onRowClick,
    searchQuery,
    searchKeys,
    searchPredicate
}) {
    // Shared Data State
    const [dataList, setDataList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Shared Modal States
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [itemToEdit, setItemToEdit] = useState(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    // Universal Fetch Function
    const loadData = async () => {
        setIsLoading(true);
        try {
            // Use custom fetch if provided, otherwise fallback to standard endpoint
            const data = fetchData ? await fetchData() : await apiClient(endpoint);
            setDataList(data?.results || data?.items || data || []);
        } catch (error) {
            console.error(`Failed to load data:`, error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { 
        loadData(); 
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [endpoint]);

    // Action Handlers
    const handleAddClick = () => {
        setItemToEdit(null);
        setIsFormOpen(true);
    };

    const handleEditClick = (item) => {
        setItemToEdit(item);
        setIsFormOpen(true);
    };

    const handleDeleteClick = (item) => {
        setItemToDelete(item);
        setIsDeleteOpen(true);
    };

    // Standardized Actions Column
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

    // Determine which actions to show
    const actionsToRender = customActions 
        ? (row) => customActions(row, handleEditClick, handleDeleteClick)
        : renderActions;

    return (
        <div className="w-full max-w-7xl mx-auto space-y-6">
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
                <div className="flex items-center gap-3 ">
                    {renderHeaderActions && renderHeaderActions(dataList)}
                    <Button  variant="primary" onClick={handleAddClick}>
                        {addButtonLabel}
                    </Button>
                </div>
            </div>

            {/* Inject custom top content (like summary cards) here, passing the dataList */}
            {renderTopContent && renderTopContent(dataList)}

            <DataTable 
                columns={columns} 
                data={dataList} 
                keyField={keyField}
                isLoading={isLoading}
                actions={actionsToRender}
                searchQuery={searchQuery}
                searchKeys={searchKeys}
                searchPredicate={searchPredicate}
                onRowClick={onRowClick}
            />

            {/* Render Prop for Custom Form Modal */}
            {renderFormModal && renderFormModal({
                isOpen: isFormOpen,
                onClose: () => setIsFormOpen(false),
                onSuccess: loadData,
                itemToEdit: itemToEdit
            })}

            {/* Universal Delete Modal */}
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