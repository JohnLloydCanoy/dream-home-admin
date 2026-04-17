'use client';

import React, { useEffect, useMemo, useState } from 'react';
import DataTable from '@/components/ui/DataTable';
import Button from '@components/ui/Button';
import ConfirmDeleteModal from '@/components/ui/ConfirmDeleteModal';
import RenterFormModal from '@/components/ui/RenterFormModal';
import apiClient from '@/lib/apiClient';

const normalizeList = (data) => data?.results || data?.items || data || [];

const getPreference = (renter, field) => {
    if (renter?.[field] !== undefined && renter?.[field] !== null) return renter[field];
    if (renter?.renter_requirements?.[field] !== undefined && renter?.renter_requirements?.[field] !== null) {
        return renter.renter_requirements[field];
    }
    return null;
};

const getRenterName = (renter) => {
    if (!renter) return 'Unknown Renter';
    return `${renter.first_name || ''} ${renter.last_name || ''}`.trim() || renter.client_no;
};

const formatCurrency = (value) => {
    if (value === null || value === undefined || value === '') return 'N/A';
    const amount = Number(value);
    if (Number.isNaN(amount)) return value;
    return `₱${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export default function RentersPage() {
    const [renters, setRenters] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState('');

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [renterToEdit, setRenterToEdit] = useState(null);

    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [renterToDelete, setRenterToDelete] = useState(null);

    const loadRenters = async () => {
        setIsLoading(true);
        setLoadError('');

        try {
            const data = await apiClient('/users/client/');
            const renterOnly = normalizeList(data).filter((client) => client.role === 'Renter');
            setRenters(renterOnly);
        } catch (error) {
            console.error('Failed to load renter records:', error);
            setLoadError('Unable to load renter records right now.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadRenters();
    }, []);

    const summary = useMemo(() => {
        const withPreference = renters.filter((renter) => Boolean(getPreference(renter, 'pref_property_type'))).length;
        const withBudget = renters.filter((renter) => Boolean(getPreference(renter, 'max_monthly_rent'))).length;

        return {
            total: renters.length,
            withPreference,
            withBudget
        };
    }, [renters]);

    const handleAddClick = () => {
        setRenterToEdit(null);
        setIsFormOpen(true);
    };

    const handleEditClick = (renter) => {
        setRenterToEdit(renter);
        setIsFormOpen(true);
    };

    const handleDeleteClick = (renter) => {
        setRenterToDelete(renter);
        setIsDeleteOpen(true);
    };

    const tableColumns = [
        {
            key: 'client_no',
            label: 'Renter ID',
            render: (value) => (
                <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded text-xs">
                    {value}
                </span>
            )
        },
        {
            key: 'renter_name',
            label: 'Renter',
            render: (_, row) => (
                <div>
                    <p className="font-semibold text-gray-900">{getRenterName(row)}</p>
                    <p className="text-xs text-gray-500">{row.email || 'No email on file'}</p>
                </div>
            )
        },
        {
            key: 'telephone_no',
            label: 'Telephone',
            render: (value) => value || 'N/A'
        },
        {
            key: 'pref_property_type',
            label: 'Pref. Type',
            render: (_, row) => getPreference(row, 'pref_property_type') || 'N/A'
        },
        {
            key: 'max_monthly_rent',
            label: 'Max Rent',
            render: (_, row) => formatCurrency(getPreference(row, 'max_monthly_rent'))
        },
        {
            key: 'general_comments',
            label: 'Comments',
            render: (_, row) => {
                const comments = getPreference(row, 'general_comments') || '';
                if (!comments) return 'No special notes';
                return comments.length > 70 ? `${comments.slice(0, 70)}...` : comments;
            }
        }
    ];

    const renderActions = (row) => (
        <div className="flex justify-end gap-2">
            <Button
                variant="secondary"
                size="sm"
                onClick={(event) => {
                    event.stopPropagation();
                    handleEditClick(row);
                }}
            >
                Edit
            </Button>
            <Button
                variant="danger"
                size="sm"
                onClick={(event) => {
                    event.stopPropagation();
                    handleDeleteClick(row);
                }}
            >
                Delete
            </Button>
        </div>
    );

    return (
        <div className="w-full max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Renter Records & Preferences</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Manage renter profiles and their property preference requirements.
                    </p>
                </div>

                <div className="flex gap-2">
                    <Button variant="secondary" onClick={loadRenters}>
                        Refresh
                    </Button>
                    <Button variant="primary" onClick={handleAddClick}>
                        + Add New Renter
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Total Renters</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{summary.total}</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">With Property Type Preference</p>
                    <p className="text-2xl font-bold text-blue-700 mt-1">{summary.withPreference}</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">With Max Rent Budget</p>
                    <p className="text-2xl font-bold text-green-700 mt-1">{summary.withBudget}</p>
                </div>
            </div>

            {loadError && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
                    {loadError}
                </div>
            )}

            <DataTable
                columns={tableColumns}
                data={renters}
                keyField="client_no"
                isLoading={isLoading}
                emptyMessage="No renter records found."
                onRowClick={handleEditClick}
                actions={renderActions}
            />

            <RenterFormModal
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSuccess={loadRenters}
                renterToEdit={renterToEdit}
            />

            <ConfirmDeleteModal
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onSuccess={loadRenters}
                endpoint="/users/client"
                idToDelete={renterToDelete?.client_no}
                itemName={`${renterToDelete?.first_name || ''} ${renterToDelete?.last_name || ''}`.trim() || renterToDelete?.client_no}
            />
        </div>
    );
}