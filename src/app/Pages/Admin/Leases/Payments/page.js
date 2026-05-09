'use client';

import React, { useState } from 'react';
import CrudPageLayout from '@/components/layout/CrudPageLayout';
import Button from '../../../../../../global-components/ui/Button';
import PaymentModal from '@/components/ui/PaymentModal';
import apiClient from '@/lib/apiClient';

// --- Helper Functions ---
const normalizeList = (data) => data?.results || data?.items || data || [];
const toLeaseNo = (lease) => (typeof lease === 'object' ? lease?.lease_no || lease?.id : lease) || '';
const getRenterLabel = (renter) => typeof renter === 'object' ? `${renter.first_name || ''} ${renter.last_name || ''}`.trim() + ` (${renter.client_no || renter.id || 'N/A'})` : (renter || 'N/A');
const getPropertyLabel = (property) => typeof property === 'object' ? `${property.property_no || property.id} - ${[property.street, property.city].filter(Boolean).join(', ')}` : (property || 'N/A');
const formatCurrency = (value) => Number.isNaN(Number(value)) ? (value || 'N/A') : `₱${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const getPaymentLeaseNo = (payment) => toLeaseNo(payment?.lease);
const getLatestDate = (current, candidate) => (!candidate ? current : !current ? candidate : (candidate > current ? candidate : current));

// --- Main Component ---
export default function PaymentsBalancesPage() {
    const [selectedLease, setSelectedLease] = useState(null);

    // 🌟 Custom Fetch Logic: Merges Leases and Payments into one array for the table
    const fetchLedgerData = async () => {
        const [leaseData, paymentData] = await Promise.all([
            apiClient('/leases/'),
            apiClient('/payments/')
        ]);

        const leases = normalizeList(leaseData);
        const payments = normalizeList(paymentData);
        const paidByLease = {};

        payments.forEach((payment) => {
            const leaseNo = getPaymentLeaseNo(payment);
            if (!leaseNo) return;
            if (!paidByLease[leaseNo]) paidByLease[leaseNo] = { amountPaid: 0, paymentCount: 0, lastPaymentDate: null };
            
            paidByLease[leaseNo].amountPaid += Number(payment.amount_paid) || 0;
            paidByLease[leaseNo].paymentCount += 1;
            paidByLease[leaseNo].lastPaymentDate = getLatestDate(paidByLease[leaseNo].lastPaymentDate, payment.payment_date);
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
    };

    const tableColumns = [
        { key: 'lease_no', label: 'Lease No', render: (val) => <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded text-xs">{val}</span> },
        { key: 'renter', label: 'Renter', render: getRenterLabel },
        { key: 'property', label: 'Property', render: getPropertyLabel },
        { key: 'rent_due', label: 'Total Rent Due', render: formatCurrency },
        { key: 'paid_so_far', label: 'Amount Paid So Far', render: (val) => <span className="font-medium text-green-700">{formatCurrency(val)}</span> },
        { key: 'outstanding_balance', label: 'Balance', render: (val) => <span className={`font-semibold ${val > 0 ? 'text-red-700' : 'text-green-700'}`}>{formatCurrency(val)}</span> },
        { key: 'last_payment_date', label: 'Last Payment', render: (val) => val || 'No payment yet' }
    ];

    return (
        <CrudPageLayout
            title="Payments & Balances"
            subtitle="Log rental payments and monitor outstanding balances per lease agreement."
            addButtonLabel="+ Log Payment"
            keyField="lease_no"
            columns={tableColumns}
            fetchData={fetchLedgerData} // 👈 Pass our custom merger function
            onRowClick={setSelectedLease} // 👈 Tracks row selection for the banner
            
            // 🌟 Override standard Edit/Delete with custom "Log Payment" button
            customActions={(row, handleEditClick) => (
                <Button variant="secondary" size="sm" onClick={(e) => {
                    e.stopPropagation();
                    setSelectedLease(row); // Update our banner state
                    handleEditClick(row);  // Triggers the layout's modal state
                }}>
                    Log Payment
                </Button>
            )}

            // 🌟 Custom Top UI Grid & Selection Banner
            renderTopContent={(leaseBalances) => {
                const summary = {
                    totalRentDue: leaseBalances.reduce((sum, l) => sum + l.rent_due, 0),
                    totalPaid: leaseBalances.reduce((sum, l) => sum + l.paid_so_far, 0),
                    totalOutstanding: leaseBalances.reduce((sum, l) => sum + l.outstanding_balance, 0),
                };

                return (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                            <div className="bg-white border border-gray-200 rounded-xl p-4">
                                <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Tracked Leases</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{leaseBalances.length}</p>
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
                            <div className="bg-blue-50 border border-blue-200 text-blue-900 rounded-lg p-3 text-sm mb-4">
                                Selected Lease: <strong>{selectedLease.lease_no}</strong> ({getRenterLabel(selectedLease.renter)})
                            </div>
                        )}
                    </>
                );
            }}

            // 🌟 Inject PaymentModal instead of a standard FormModal
            renderFormModal={({ isOpen, onClose, onSuccess, itemToEdit }) => (
                <PaymentModal
                    isOpen={isOpen}
                    onClose={onClose}
                    onSuccess={onSuccess}
                    preselectedLease={itemToEdit || selectedLease} // Uses layout's active item
                />
            )}
        />
    );
}