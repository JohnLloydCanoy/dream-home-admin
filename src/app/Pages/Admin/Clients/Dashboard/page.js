'use client';

import React, { useState, useEffect } from 'react';
import DataTable from '@/components/ui/DataTable';
import ClientFormModal from '@/components/ui/ClientFormModal';
import ConfirmDeleteModal from '@/components/ui/ConfirmDeleteModal';
import apiClient from '@/lib/apiClient';

export default function DashboardPage() {
    const [clientList, setClientList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [clientToEdit, setClientToEdit] = useState(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [clientToDelete, setClientToDelete] = useState(null);

    const loadClients = async () => {
        setIsLoading(true);
        try {
            const data = await apiClient('/users/clients/');
            setClientList(data.results || data.items || data);
        } catch (error) {
            console.error("Failed to load clients:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { loadClients(); }, []);

    const handleAddClick = () => {
        setClientToEdit(null);
        setIsFormOpen(true);
    };

    const handleEditClick = (client) => {
        setClientToEdit(client);
        setIsFormOpen(true);
    };

    const handleDeleteClick = (client) => {
        setClientToDelete(client);
        setIsDeleteOpen(true);
    };

    // Table Configuration
    const tableColumns = [
        {
            key: 'client_no', label: 'Client ID',
            render: (val) => <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">{val}</span>
        },
        {
            key: 'name', label: 'Full Name',
            render: (val, row) => <span className="font-medium text-gray-900">{row.first_name} {row.last_name}</span>
        },
        {
            key: 'email', label: 'Email',
            render: (val) => <span className="text-gray-700">{val}</span>
        },
        {
            key: 'telephone_no', label: 'Telephone',
            render: (val) => <span className="text-gray-700">{val || 'N/A'}</span>
        },
        {
            key: 'role', label: 'Role',
            render: (val) => {
                const colors = {
                    'renter': 'bg-blue-100 text-blue-800',
                    'owner': 'bg-orange-100 text-orange-800',
                };
                const normalizedVal = val ? val.toLowerCase() : '';
                return (
                    <span
                        className={`px-2 py-1 rounded-full text-xs font-bold ${colors[normalizedVal] || 'bg-gray-100 text-gray-800'}`}
                    >
                        {val || 'N/A'}
                    </span>
                );
            }
        }
    ];

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
        <div className=" w-full max-w-7xl mx-auto">
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Clients Dashboard</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage DreamHome clients, both renters and owners.</p>
                </div>
                <button onClick={handleAddClick} className="bg-[#002147] hover:bg-blue-900 text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-sm">
                    + Add Client
                </button>
            </div>

            <DataTable
                columns={tableColumns}
                data={clientList}
                keyField="client_no"
                isLoading={isLoading}
                actions={renderActions}
            />

            <ClientFormModal
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSuccess={loadClients}
                clientToEdit={clientToEdit}
            />

            <ConfirmDeleteModal
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onSuccess={loadClients}
                endpoint="/users/clients"
                idToDelete={clientToDelete?.client_no}
                itemName={`${clientToDelete?.first_name} ${clientToDelete?.last_name} (${clientToDelete?.role})`}
            />
        </div>
    );
}