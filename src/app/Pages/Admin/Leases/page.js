'use client';

import React from 'react';
import CrudPageLayout from '@/components/layout/CrudPageLayout'; // Adjust path
import LeaseFormModal from '@/components/ui/LeaseFormModal';

// --- Helper Functions ---
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

// --- Main Page Component ---
export default function LeaseAgreementsPage() {
    const tableColumns = [
        {
            key: 'lease_no',
            label: 'Lease No',
            render: (value) => <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded text-xs">{value}</span>
        },
        { key: 'property', label: 'Property', render: (value) => getPropertyLabel(value) },
        { key: 'renter', label: 'Renter', render: (value) => getRenterLabel(value) },
        { key: 'monthly_rent', label: 'Monthly Rent', render: (value) => formatCurrency(value) },
        { key: 'deposit', label: 'Deposit', render: (value) => formatCurrency(value) },
        { key: 'payment_method', label: 'Payment Method', render: (value) => value || 'N/A' },
        { key: 'duration', label: 'Duration', render: (value) => `${value || 'N/A'} month(s)` },
        { key: 'term', label: 'Term', render: (_, row) => `${getStartDate(row)} to ${getEndDate(row)}` }
    ];

    return (
        <CrudPageLayout
            title="Lease Agreements"
            subtitle="Generate and manage rental contracts between available properties and renter clients."
            addButtonLabel="+ Create Lease"
            endpoint="/leases/"
            keyField="lease_no"
            columns={tableColumns}
            getDeleteModalItemName={(lease) => `Lease ${lease.lease_no || ''}`.trim()}
            
            // 🌟 Inject the Summary Cards dynamically based on the fetched data
            renderTopContent={(leases) => {
                const totalMonthlyRent = leases.reduce((accumulator, lease) => accumulator + (Number(lease.monthly_rent) || 0), 0);
                const depositPaid = leases.filter((lease) => Boolean(lease.deposit_paid)).length;
                const depositPending = leases.length - depositPaid;

                return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                            <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Total Leases</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{leases.length}</p>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                            <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Portfolio Monthly Rent</p>
                            <p className="text-2xl font-bold text-blue-700 mt-1">{formatCurrency(totalMonthlyRent)}</p>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                            <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Deposit Paid</p>
                            <p className="text-2xl font-bold text-green-700 mt-1">{depositPaid}</p>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                            <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Deposit Pending</p>
                            <p className="text-2xl font-bold text-amber-700 mt-1">{depositPending}</p>
                        </div>
                    </div>
                );
            }}

            // Form Modal Injection
            renderFormModal={({ isOpen, onClose, onSuccess, itemToEdit }) => (
                <LeaseFormModal
                    isOpen={isOpen}
                    onClose={onClose}
                    onSuccess={onSuccess}
                    leaseToEdit={itemToEdit}
                />
            )}
        />
    );
}