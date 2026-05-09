'use client';

import React from 'react';
import CrudPageLayout from '@/components/layout/CrudPageLayout';
import PropertyFormModal from '@/components/ui/PropertyFormModal';

export default function PropertiesPage() {
    const tableColumns = [
        {
            key: 'property_no', label: 'Property ID',
            render: (val) => <span className="font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">{val}</span>
        },
        { 
            key: 'address', label: 'Address',
            render: (val, row) => (
                <div className="text-xs text-gray-500">
                    <p className="text-gray-900 font-medium">{row.street}</p>
                    <p>{row.area ? `${row.area}, ` : ''}{row.city} {row.postcode}</p>
                </div>
            )
        },
        { key: 'property_type', label: 'Type' },
        {
            key: 'no_of_rooms',
            label: 'Rooms',
            render: (val) => <span className="font-medium text-gray-900">{val}</span>
        },
        {
            key: 'monthly_rent',
            label: 'Monthly Rent',
            render: (value) => {
                const amount = Number(value);
                const formatted = Number.isNaN(amount)
                    ? value
                    : amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

                return <span className="font-medium text-gray-900">₱{formatted}</span>;
            }
        },
        { 
            key: 'status', 
            label: 'Status',
            render: (value) => {
                const colors = {
                    'Available': 'bg-green-100 text-green-800',
                    'Rented': 'bg-blue-100 text-blue-800',
                    'Withdrawn': 'bg-orange-100 text-orange-800'
                };
                return (
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${colors[value] || 'bg-gray-100 text-gray-800'}`}>
                        {value}
                    </span>
                );
            }
        },
        {
            key: 'owner_no',
            label: 'Owner',
            render: (val) => {
                if (!val) return 'N/A';
                if (typeof val === 'object') {
                    const name = `${val.first_name || ''} ${val.last_name || ''}`.trim();
                    return name || val.client_no || 'N/A';
                }
                return val;
            }
        },
        {
            key: 'branch_no',
            label: 'Branch',
            render: (val) => {
                if (!val) return 'N/A';
                if (typeof val === 'object') {
                    return val.city ? `${val.branch_no} - ${val.city}` : val.branch_no;
                }
                return val;
            }
        }
    ];

    return (
        <CrudPageLayout
            title="Property Operations"
            subtitle="Manage DreamHome rental properties and listing assignments."
            addButtonLabel="+ New Property"
            endpoint="/properties/"
            keyField="property_no"
            columns={tableColumns}
            getDeleteModalItemName={(property) => `Property ${property.property_no} - ${property.city}`}
            renderFormModal={({ isOpen, onClose, onSuccess, itemToEdit }) => (
                <PropertyFormModal
                    isOpen={isOpen}
                    onClose={onClose}
                    onSuccess={onSuccess}
                    propertyToEdit={itemToEdit}
                />
            )}
        />
    );
}