'use client';

import React from 'react';
import CrudPageLayout from '@/components/layout/CrudPageLayout';
import ViewingFormModal from '@/components/ui/ViewingFormModal';

// --- Helper Functions ---
const getViewingId = (viewing) => viewing?.id || viewing?.pk || viewing?.viewing_id || null;

const getPropertyLabel = (value) => {
    if (!value) return 'N/A';
    if (typeof value === 'object') {
        const id = value.property_no || value.id || 'N/A';
        const location = [value.street, value.city].filter(Boolean).join(', ');
        return location ? `${id} - ${location}` : `${id}`;
    }
    return value;
};

const getClientLabel = (row) => {
    const value = row.client || row.renter;
    if (!value) return 'N/A';
    if (typeof value === 'object') {
        const fullName = `${value.first_name || ''} ${value.last_name || ''}`.trim();
        const id = value.client_no || value.id || 'N/A';
        return `${fullName || 'Unknown Client'} (${id})`;
    }
    return value;
};

const getViewingDate = (row) => row.viewing_date || row.view_date || 'N/A';
const getViewingTime = (row) => row.viewing_time || 'N/A';

export default function PropertyViewingsPage() {
    const tableColumns = [
        {
            key: 'viewing_id',
            label: 'Viewing ID',
            render: (_, row) => (
                <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded text-xs">
                    {getViewingId(row) || 'N/A'}
                </span>
            )
        },
        {
            key: 'property',
            label: 'Property',
            render: (value) => <span className="text-gray-900 font-medium">{getPropertyLabel(value)}</span>
        },
        {
            key: 'client',
            label: 'Client',
            render: (_, row) => <span className="text-gray-900">{getClientLabel(row)}</span>
        },
        {
            key: 'viewing_date',
            label: 'Date',
            render: (_, row) => getViewingDate(row)
        },
        {
            key: 'viewing_time',
            label: 'Time',
            render: (_, row) => getViewingTime(row)
        },
        {
            key: 'comments',
            label: 'Comments',
            render: (value) => {
                const text = value || '';
                if (!text) return 'No feedback';
                return text.length > 80 ? `${text.slice(0, 80)}...` : text;
            }
        }
    ];

    return (
        <CrudPageLayout
            title="Property Viewings"
            subtitle="Record and review client viewings with schedule and feedback details."
            addButtonLabel="+ Record New Viewing"
            endpoint="/properties/viewings/"
            keyField="id" 
            columns={tableColumns}
            getDeleteModalItemName={(viewing) => `Viewing #${getViewingId(viewing) || 'N/A'}`}
            renderFormModal={({ isOpen, onClose, onSuccess, itemToEdit }) => (
                <ViewingFormModal
                    isOpen={isOpen}
                    onClose={onClose}
                    onSuccess={onSuccess}
                    viewingToEdit={itemToEdit}
                />
            )}
        />
    );
}