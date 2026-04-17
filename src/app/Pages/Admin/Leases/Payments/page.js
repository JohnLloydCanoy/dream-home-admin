'use client';

import React, { useEffect, useMemo, useState } from 'react';
import DataTable from '@/components/ui/DataTable';
import Button from '@components/ui/Button';
import PaymentModal from '@/components/ui/PaymentModal';
import apiClient from '@/lib/apiClient';

const normalizeList = (data) => data?.results || data?.items || data || [];

const toLeaseNo = (lease) => {
    if (!lease) return '';
    if (typeof lease === 'object') return lease.lease_no || lease.id || '';
    return lease;
};

const getRenterLabel = (renter) => {
    if (!renter) return 'N/A';
    if (typeof renter === 'object') {
        const fullName = `${renter.first_name || ''} ${renter.last_name || ''}`.trim();
        const renterId = renter.client_no || renter.id || 'N/A';
        return `${fullName || 'Unknown Renter'} (${renterId})`;
    }
    return renter;
};

const getPropertyLabel = (property) => {
    if (!property) return 'N/A';
    if (typeof property === 'object') {
        const propertyNo = property.property_no || property.id || 'N/A';
        const location = [property.street, property.city].filter(Boolean).join(', ');
        return location ? `${propertyNo} - ${location}` : `${propertyNo}`;
    }
    return property;
};

const formatCurrency = (value) => {
    if (value === null || value === undefined || value === '') return 'N/A';

    const amount = Number(value);
    if (Number.isNaN(amount)) return value;

    return `₱${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const getPaymentLeaseNo = (payment) => {
    if (!payment) return '';
    if (typeof payment.lease === 'object') return payment.lease.lease_no || payment.lease.id || '';
    return payment.lease || '';
};

const getLatestDate = (current, candidate) => {
    if (!candidate) return current;
    if (!current) return candidate;
    return candidate > current ? candidate : current;
};

export default function PaymentsBalancesPage() {
    const [leases, setLeases] = useState([]);
    const [payments, setPayments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState('');

    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [selectedLease, setSelectedLease] = useState(null);

    const loadData = async () => {
        setIsLoading(true);
        setLoadError('');

        try {
            const [leaseData, paymentData] = await Promise.all([
                apiClient('/leases/'),
                apiClient('/payments/')
            ]);

            setLeases(normalizeList(leaseData));
            setPayments(normalizeList(paymentData));
        } catch (error) {
            console.error('Failed to load payments and balances data:', error);
            setLoadError('Unable to load payment ledger and balances right now.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const leaseBalances = useMemo(() => {
        const paidByLease = {};

        payments.forEach((payment) => {
            const leaseNo = toLeaseNo(getPaymentLeaseNo(payment));
            if (!leaseNo) return;

            if (!paidByLease[leaseNo]) {
                paidByLease[leaseNo] = {
                    amountPaid: 0,
                    paymentCount: 0,
                    lastPaymentDate: null
                };
            }

            paidByLease[leaseNo].amountPaid += Number(payment.amount_paid) || 0;
            paidByLease[leaseNo].paymentCount += 1;
            paidByLease[leaseNo].lastPaymentDate = getLatestDate(
                paidByLease[leaseNo].lastPaymentDate,
                payment.payment_date
            );
        });

        return leases.map((lease) => {
            const leaseNo = toLeaseNo(lease);
            const rentDue = Number(lease.monthly_rent) || 0;
            const leasePayment = paidByLease[leaseNo] || { amountPaid: 0, paymentCount: 0, lastPaymentDate: null };
            const outstanding = rentDue - leasePayment.amountPaid;

            return {
                ...lease,
                rent_due: rentDue,
                paid_so_far: leasePayment.amountPaid,
                outstanding_balance: outstanding > 0 ? outstanding : 0,
                payment_count: leasePayment.paymentCount,
                last_payment_date: leasePayment.lastPaymentDate || 'No payment yet'
            };
        });
    }, [leases, payments]);

    const summary = useMemo(() => {
        const totalRentDue = leaseBalances.reduce((sum, lease) => sum + lease.rent_due, 0);
        const totalPaid = leaseBalances.reduce((sum, lease) => sum + lease.paid_so_far, 0);
        const totalOutstanding = leaseBalances.reduce((sum, lease) => sum + lease.outstanding_balance, 0);

        return {
            totalLeases: leaseBalances.length,
            totalRentDue,
            totalPaid,
            totalOutstanding
        };
    }, [leaseBalances]);

    const openPaymentModal = (lease = selectedLease) => {
        setSelectedLease(lease || null);
        setIsPaymentModalOpen(true);
    };

    const closePaymentModal = () => {
        setIsPaymentModalOpen(false);
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
            key: 'renter',
            label: 'Renter',
            render: (value) => getRenterLabel(value)
        },
        {
            key: 'property',
            label: 'Property',
            render: (value) => getPropertyLabel(value)
        },
        {
            key: 'rent_due',
            label: 'Total Rent Due',
            render: (value) => formatCurrency(value)
        },
        {
            key: 'paid_so_far',
            label: 'Amount Paid So Far',
            render: (value) => (
                <span className="font-medium text-green-700">{formatCurrency(value)}</span>
            )
        },
        {
            key: 'outstanding_balance',
            label: 'Balance',
            render: (value) => (
                <span className={`font-semibold ${value > 0 ? 'text-red-700' : 'text-green-700'}`}>
                    {formatCurrency(value)}
                </span>
            )
        },
        {
            key: 'last_payment_date',
            label: 'Last Payment',
            render: (value) => value || 'No payment yet'
        }
    ];

    const renderActions = (row) => (
        <Button
            variant="secondary"
            size="sm"
            onClick={(event) => {
                event.stopPropagation();
                openPaymentModal(row);
            }}
        >
            Log Payment
        </Button>
    );

    return (
        <div className="w-full max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Payments & Balances</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Log rental payments and monitor outstanding balances per lease agreement.
                    </p>
                </div>

                <div className="flex gap-2">
                    <Button variant="secondary" onClick={loadData}>
                        Refresh
                    </Button>
                    <Button variant="primary" onClick={() => openPaymentModal()}>
                        + Log Payment
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Tracked Leases</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{summary.totalLeases}</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Total Rent Due</p>
                    <p className="text-2xl font-bold text-blue-700 mt-1">{formatCurrency(summary.totalRentDue)}</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Total Paid</p>
                    <p className="text-2xl font-bold text-green-700 mt-1">{formatCurrency(summary.totalPaid)}</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Outstanding</p>
                    <p className="text-2xl font-bold text-red-700 mt-1">{formatCurrency(summary.totalOutstanding)}</p>
                </div>
            </div>

            {selectedLease && (
                <div className="bg-blue-50 border border-blue-200 text-blue-900 rounded-lg p-3 text-sm">
                    Selected Lease: <strong>{selectedLease.lease_no}</strong> ({getRenterLabel(selectedLease.renter)})
                </div>
            )}

            {loadError && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
                    {loadError}
                </div>
            )}

            <DataTable
                columns={tableColumns}
                data={leaseBalances}
                keyField="lease_no"
                isLoading={isLoading}
                emptyMessage="No lease agreements available for payment tracking."
                onRowClick={setSelectedLease}
                actions={renderActions}
            />

            <PaymentModal
                isOpen={isPaymentModalOpen}
                onClose={closePaymentModal}
                onSuccess={loadData}
                preselectedLease={selectedLease}
            />
        </div>
    );
}
