'use client';

import React, { useEffect, useMemo, useState } from 'react';
import DataTable from '@/components/ui/DataTable';
import Button from '@components/ui/Button';
import ConfirmDeleteModal from '@/components/ui/ConfirmDeleteModal';
import LeaseFormModal from '@/components/ui/LeaseFormModal';
import apiClient from '@/lib/apiClient';

const normalizeList = (data) => data?.results || data?.items || data || [];

const getPropertyLabel = (value) => {
    if (!value) return 'N/A';
    if (typeof value === 'object') {
        const propertyNo = value.property_no || value.id || 'N/A';
        const location = [value.street, value.city].filter(Boolean).join(', ');
        return location ? `${propertyNo} - ${location}` : `${propertyNo}`;
    }
    return value;
};

const getRenterLabel = (value) => {
    if (!value) return 'N/A';
    if (typeof value === 'object') {
        const fullName = `${value.first_name || ''} ${value.last_name || ''}`.trim();
        const renterId = value.client_no || value.id || 'N/A';
        return `${fullName || 'Unknown Renter'} (${renterId})`;
    }
    return value;
};

const formatCurrency = (value) => {
    if (value === null || value === undefined || value === '') return 'N/A';

    const amount = Number(value);
    if (Number.isNaN(amount)) return value;

    return `₱${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const getStartDate = (lease) => lease?.start_date || lease?.rent_start || 'N/A';
const getEndDate = (lease) => lease?.end_date || lease?.rent_finish || 'N/A';

export default function LeaseAgreementsPage() {
    const [leases, setLeases] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState('');

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [leaseToEdit, setLeaseToEdit] = useState(null);

    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [leaseToDelete, setLeaseToDelete] = useState(null);

    const loadLeases = async () => {
        setIsLoading(true);
        setLoadError('');

        try {
            const data = await apiClient('/leases/');
            setLeases(normalizeList(data));
        } catch (error) {
            console.error('Failed to load lease agreements:', error);
            setLoadError('Unable to load lease agreements right now.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadLeases();
    }, []);

    const summary = useMemo(() => {
        const totalMonthlyRent = leases.reduce((accumulator, lease) => accumulator + (Number(lease.monthly_rent) || 0), 0);
        const depositPaid = leases.filter((lease) => Boolean(lease.deposit_paid)).length;

        return {
            totalLeases: leases.length,
            totalMonthlyRent,
            depositPaid,
            depositPending: leases.length - depositPaid
        };
    }, [leases]);

    const handleAddClick = () => {
        setLeaseToEdit(null);
        setIsFormOpen(true);
    };

    const handleEditClick = (lease) => {
        setLeaseToEdit(lease);
        setIsFormOpen(true);
    };

    const handleDeleteClick = (lease) => {
        setLeaseToDelete(lease);
        setIsDeleteOpen(true);
    };

    const tableColumns = [
        {
            key: 'lease_no',
            label: 'Lease No',
            render: (value) => (
                <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded text-xs">
                    {value}
                </span>
            )
        },
        {
            key: 'property',
            label: 'Property',
            render: (value) => getPropertyLabel(value)
        },
        {
            key: 'renter',
            label: 'Renter',
            render: (value) => getRenterLabel(value)
        },
        {
            key: 'monthly_rent',
            label: 'Monthly Rent',
            render: (value) => formatCurrency(value)
        },
        {
            key: 'deposit',
            label: 'Deposit',
            render: (value) => formatCurrency(value)
        },
        {
            key: 'payment_method',
            label: 'Payment Method',
            render: (value) => value || 'N/A'
        },
        {
            key: 'duration',
            label: 'Duration',
            render: (value) => `${value || 'N/A'} month(s)`
        },
        {
            key: 'term',
            label: 'Term',
            render: (_, row) => `${getStartDate(row)} to ${getEndDate(row)}`
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
                    <h1 className="text-3xl font-bold text-gray-900">Lease Agreements</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Generate and manage rental contracts between available properties and renter clients.
                    </p>
                </div>

                <div className="flex gap-2">
                    <Button variant="secondary" onClick={loadLeases}>
                        Refresh
                    </Button>
                    <Button variant="primary" onClick={handleAddClick}>
                        + Create Lease
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Total Leases</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{summary.totalLeases}</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Portfolio Monthly Rent</p>
                    <p className="text-2xl font-bold text-blue-700 mt-1">{formatCurrency(summary.totalMonthlyRent)}</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Deposit Paid</p>
                    <p className="text-2xl font-bold text-green-700 mt-1">{summary.depositPaid}</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Deposit Pending</p>
                    <p className="text-2xl font-bold text-amber-700 mt-1">{summary.depositPending}</p>
                </div>
            </div>

            {loadError && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
                    {loadError}
                </div>
            )}

            <DataTable
                columns={tableColumns}
                data={leases}
                keyField="lease_no"
                isLoading={isLoading}
                emptyMessage="No lease agreements found."
                onRowClick={handleEditClick}
                actions={renderActions}
            />

            <LeaseFormModal
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSuccess={loadLeases}
                leaseToEdit={leaseToEdit}
            />

            <ConfirmDeleteModal
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onSuccess={loadLeases}
                endpoint="/leases"
                idToDelete={leaseToDelete?.lease_no}
                itemName={`Lease ${leaseToDelete?.lease_no || ''}`.trim()}
            />
        </div>
    );
}
