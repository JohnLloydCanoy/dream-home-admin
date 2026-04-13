'use client';

import React, { useEffect, useState } from 'react';
import DataTable from '@/components/ui/DataTable';
import PropertyViewingFormModal from '@/components/ui/PropertyViewingFormModal';
import ConfirmDeleteModal from '@/components/ui/ConfirmDeleteModal';
import apiClient from '@/lib/apiClient';

export default function ViewingsPage() {
    // Data State
    const [viewings, setViewings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Modal States
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [viewingToEdit, setViewingToEdit] = useState(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [viewingToDelete, setViewingToDelete] = useState(null);

    const loadViewings = async () => {
        setIsLoading(true);
        try {
            const data = await apiClient('/properties/viewings/');
            setViewings(data.results || data.items || data);
        } catch (error) {
            console.error('Failed to load property viewings:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { loadViewings(); }, []);

    const handleAddClick = () => {
        setViewingToEdit(null);
        setIsFormOpen(true);
    };

    const handleEditClick = (viewing) => {
        setViewingToEdit(viewing);
        setIsFormOpen(true);
    };

    const handleDeleteClick = (viewing) => {
        setViewingToDelete(viewing);
        setIsDeleteOpen(true);
    };

    const tableColumns = [
        {
            key: 'id',
            label: 'Viewing #',
            render: (val) => <span className="font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">#{val}</span>
        },
        {
            key: 'property',
            label: 'Property',
            render: (val) => <span className="font-medium text-gray-900">{val}</span>
        },
        {
            key: 'renter',
            label: 'Renter',
            render: (val) => <span className="text-gray-700">{val}</span>
        },
        {
            key: 'view_date',
            label: 'Viewing Date',
            render: (val) => {
                if (!val) return 'N/A';
                const date = new Date(val);
                if (Number.isNaN(date.getTime())) return val;
                return date.toLocaleDateString();
            }
        },
        {
            key: 'comments',
            label: 'Comments',
            render: (val) => val || 'No comments'
        }
    ];

    const renderActions = (row) => (
        <div className="flex justify-end gap-3">
            <button
                onClick={(e) => { e.stopPropagation(); handleEditClick(row); }}
                className="text-blue-600 hover:text-blue-900 text-sm font-semibold"
            >
                Edit
            </button>
            <button
                onClick={(e) => { e.stopPropagation(); handleDeleteClick(row); }}
                className="text-red-600 hover:text-red-900 text-sm font-semibold"
            >
                Delete
            </button>
        </div>
    );

    return (
        <div className=" w-full max-w-7xl mx-auto">
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Property Viewings</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage scheduled renter viewings for listed properties.</p>
                </div>
                <button onClick={handleAddClick} className="bg-[#002147] hover:bg-blue-900 text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-sm">
                    + New Viewing
                </button>
            </div>

            <DataTable
                columns={tableColumns}
                data={viewings}
                keyField="id"
                isLoading={isLoading}
                actions={renderActions}
            />

            <PropertyViewingFormModal
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSuccess={loadViewings}
                viewingToEdit={viewingToEdit}
            />

            <ConfirmDeleteModal
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onSuccess={loadViewings}
                endpoint="/properties/viewings"
                idToDelete={viewingToDelete?.id}
                itemName={`Viewing #${viewingToDelete?.id} for Property ${viewingToDelete?.property}`}
            />

        </div>
    );
}