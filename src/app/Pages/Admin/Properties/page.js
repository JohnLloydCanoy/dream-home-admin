'use client';

import React, { useState, useEffect } from 'react';
import DataTable from '@/components/ui/DataTable';
import PropertyFormModal from '@/components/ui/PropertyFormModal';
import ConfirmDeleteModal from '@/components/ui/ConfirmDeleteModal';
import apiClient from '@/lib/apiClient';

export default function PropertiesPage() {
    // Data State
    const [properties, setProperties] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Modal States
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [propertyToEdit, setPropertyToEdit] = useState(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [propertyToDelete, setPropertyToDelete] = useState(null);

    // Fetch Function (extracted so we can call it after adding/editing/deleting)
    const loadProperties = async () => {
        setIsLoading(true);
        try {
            const data = await apiClient('/properties/');
            setProperties(data.results || data.items || data);
        } catch (error) {
            console.error('Failed to load properties:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Load initially
    useEffect(() => { loadProperties(); }, []);

    // Open Modals
    const handleAddClick = () => {
        setPropertyToEdit(null);
        setIsFormOpen(true);
    };

    const handleEditClick = (property) => {
        setPropertyToEdit(property);
        setIsFormOpen(true);
    };

    const handleDeleteClick = (property) => {
        setPropertyToDelete(property);
        setIsDeleteOpen(true);
    };

    // Table Configuration
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
                    <h1 className="text-3xl font-bold text-gray-900">Property Operations</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage DreamHome rental properties and listing assignments.</p>
                </div>
                <button onClick={handleAddClick} className="bg-[#002147] hover:bg-blue-900 text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-sm">
                    + New Property
                </button>
            </div>

            <DataTable 
                columns={tableColumns} 
                data={properties} 
                keyField="property_no"
                isLoading={isLoading}
                actions={renderActions}
            />

            <PropertyFormModal
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSuccess={loadProperties}
                propertyToEdit={propertyToEdit}
            />

            <ConfirmDeleteModal
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onSuccess={loadProperties}
                endpoint="/properties"
                idToDelete={propertyToDelete?.property_no}
                itemName={`Property ${propertyToDelete?.property_no} - ${propertyToDelete?.city}`}
            />
        </div>
    );
}