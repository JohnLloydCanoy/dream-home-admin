'use client';

import React, { useState, useEffect } from 'react';
import DataTable from '@/components/ui/DataTable'; 
import ConfirmDeleteModal from '@/components/ui/ConfirmDeleteModal'; 
import apiClient from '@/lib/apiClient';

export default function CrudPageLayout({
    title,
    subtitle,
    addButtonLabel,
    endpoint,
    keyField,
    columns,
    renderFormModal,
    getDeleteModalItemName,
    renderTopContent 
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
            const data = await apiClient(endpoint);
            setDataList(data.results || data.items || data || []);
        } catch (error) {
            console.error(`Failed to load data from ${endpoint}:`, error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { loadData(); }, [endpoint]);

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

    return (
        <div className="w-full max-w-7xl mx-auto">
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
                    <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
                </div>
                <button onClick={handleAddClick} className="bg-[#002147] hover:bg-blue-900 text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-sm">
                    {addButtonLabel}
                </button>
            </div>

            {/* Inject custom top content (like summary cards) here, passing the dataList */}
            {renderTopContent && renderTopContent(dataList)}

            <DataTable 
                columns={columns} 
                data={dataList} 
                keyField={keyField}
                isLoading={isLoading}
                actions={renderActions}
            />

            {/* Render Prop for Custom Form Modal */}
            {renderFormModal({
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
                itemName={itemToDelete ? getDeleteModalItemName(itemToDelete) : ''}
            />
        </div>
    );
}