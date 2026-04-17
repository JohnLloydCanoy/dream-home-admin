"use client";

import React, { useEffect, useMemo, useState } from 'react';
import Button from '@components/ui/Button';
import Dialog from '@components/ui/Dialog';
import FormField from '@/components/ui/FormField';
import apiClient from '@/lib/apiClient';
import { useForm } from '@/hooks/useForm';
import { useCreate } from '@/hooks/useCrud';

const normalizeList = (data) => data?.results || data?.items || data || [];

const getTodayIso = () => new Date().toISOString().split('T')[0];

const toLeaseNo = (lease) => {
    if (!lease) return '';
    if (typeof lease === 'object') return lease.lease_no || lease.id || '';
    return lease;
};

const getInitialState = (preselectedLease) => ({
    lease: toLeaseNo(preselectedLease),
    amount_paid: '',
    payment_date: getTodayIso(),
    payment_method: 'Transfer',
    reference_number: ''
});

const paymentValidators = {
    lease: { required: true, label: 'Lease' },
    amount_paid: {
        required: true,
        label: 'Amount Paid',
        pattern: /^\d+(\.\d{1,2})?$/,
        patternMessage: 'Enter a valid payment amount'
    },
    payment_date: { required: true, label: 'Payment Date' },
    payment_method: { required: true, label: 'Payment Method' }
};

const sectionTheme = {
    wrapper: 'bg-gray-50/70 border border-gray-100 rounded-xl p-4 sm:p-5',
    heading: 'text-sm font-bold text-[#002147]',
    description: 'text-xs text-gray-500 mt-1'
};

const FormSection = ({ title, description, children }) => (
    <section className={sectionTheme.wrapper}>
        <h3 className={sectionTheme.heading}>{title}</h3>
        {description && <p className={sectionTheme.description}>{description}</p>}
        <div className="mt-4">{children}</div>
    </section>
);

const getRenterLabel = (renter) => {
    if (!renter) return 'Unknown Renter';
    if (typeof renter !== 'object') return renter;

    const fullName = `${renter.first_name || ''} ${renter.last_name || ''}`.trim();
    return fullName || renter.client_no || 'Unknown Renter';
};

const getPropertyLabel = (property) => {
    if (!property) return 'Unknown Property';
    if (typeof property !== 'object') return property;

    const propertyNo = property.property_no || property.id || 'N/A';
    const location = [property.street, property.city].filter(Boolean).join(', ');
    return location ? `${propertyNo} - ${location}` : `${propertyNo}`;
};

const formatCurrency = (value) => {
    if (value === null || value === undefined || value === '') return 'N/A';

    const amount = Number(value);
    if (Number.isNaN(amount)) return value;

    return `₱${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export default function PaymentModal({ isOpen, onClose, onSuccess, preselectedLease }) {
    const [leaseOptions, setLeaseOptions] = useState([]);
    const [loadError, setLoadError] = useState('');

    const { createRecord, isLoading: isSaving, error: submitError, setError: setSubmitError } = useCreate('/payments/');

    const { formData, errors, handleChange, validate, reset } = useForm(
        getInitialState(preselectedLease),
        paymentValidators
    );

    useEffect(() => {
        if (!isOpen) return;

        const selectedLeaseNo = toLeaseNo(preselectedLease);
        const today = getTodayIso();

        setLoadError('');

        apiClient('/leases/')
            .then((leaseData) => {
                const leases = normalizeList(leaseData);

                const activeLeases = leases.filter((lease) => {
                    const finishDate = lease.rent_finish || lease.end_date || null;
                    if (!finishDate) return true;
                    return finishDate >= today;
                });

                if (selectedLeaseNo) {
                    const alreadyIncluded = activeLeases.some((lease) => toLeaseNo(lease) === selectedLeaseNo);
                    if (!alreadyIncluded) {
                        const matched = leases.find((lease) => toLeaseNo(lease) === selectedLeaseNo);
                        if (matched) activeLeases.unshift(matched);
                    }
                }

                setLeaseOptions(activeLeases);
            })
            .catch((error) => {
                console.error('Failed to load lease options for payment logging:', error);
                setLoadError('Unable to load lease options right now.');
            });
    }, [isOpen, preselectedLease?.lease_no]);

    useEffect(() => {
        if (!isOpen) return;

        reset(getInitialState(preselectedLease));
        setSubmitError(null);
        setLoadError('');
    }, [isOpen, preselectedLease?.lease_no]);

    const selectedLease = useMemo(
        () => leaseOptions.find((lease) => toLeaseNo(lease) === formData.lease) || null,
        [leaseOptions, formData.lease]
    );

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validate()) return;

        const payload = {
            lease: formData.lease,
            amount_paid: Number(formData.amount_paid),
            payment_date: formData.payment_date,
            payment_method: formData.payment_method,
            reference_number: formData.reference_number.trim() || null
        };

        const result = await createRecord(payload);

        if (result.success) {
            onSuccess();
            onClose();
        }
    };

    return (
        <Dialog isOpen={isOpen} onClose={onClose} title="Log Payment">
            <form onSubmit={handleSubmit} className="space-y-5 max-h-[75vh] overflow-y-auto pr-1 pb-1 custom-scrollbar">
                {(loadError || submitError) && (
                    <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 sticky top-0 z-10">
                        {loadError || submitError}
                    </div>
                )}

                <FormSection
                    title="Lease Allocation"
                    description="Select the lease agreement this payment should be posted to."
                >
                    <FormField
                        label="Lease"
                        field="lease"
                        type="select"
                        value={formData.lease}
                        onChange={handleChange}
                        error={errors.lease}
                    >
                        <option value="">- Select Active Lease -</option>
                        {leaseOptions.map((lease) => (
                            <option key={toLeaseNo(lease)} value={toLeaseNo(lease)}>
                                {toLeaseNo(lease)} • {getRenterLabel(lease.renter)}
                            </option>
                        ))}
                    </FormField>

                    {selectedLease && (
                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                            <div className="bg-white rounded-lg border border-gray-200 p-3">
                                <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Property</p>
                                <p className="text-gray-900 font-semibold mt-1">{getPropertyLabel(selectedLease.property)}</p>
                            </div>
                            <div className="bg-white rounded-lg border border-gray-200 p-3">
                                <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Monthly Rent</p>
                                <p className="text-gray-900 font-semibold mt-1">{formatCurrency(selectedLease.monthly_rent)}</p>
                            </div>
                        </div>
                    )}
                </FormSection>

                <FormSection
                    title="Payment Details"
                    description="Capture transaction amount, date, method, and optional reference ID."
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                            label="Amount Paid"
                            field="amount_paid"
                            type="number"
                            value={formData.amount_paid}
                            onChange={handleChange}
                            error={errors.amount_paid}
                            placeholder="e.g. 25000"
                        />

                        <FormField
                            label="Payment Date"
                            field="payment_date"
                            type="date"
                            value={formData.payment_date}
                            onChange={handleChange}
                            error={errors.payment_date}
                        />

                        <FormField
                            label="Payment Method"
                            field="payment_method"
                            type="select"
                            value={formData.payment_method}
                            onChange={handleChange}
                            error={errors.payment_method}
                        >
                            <option value="Cash">Cash</option>
                            <option value="Transfer">Bank Transfer</option>
                            <option value="Cheque">Cheque</option>
                        </FormField>

                        <FormField
                            label="Reference Number"
                            field="reference_number"
                            value={formData.reference_number}
                            onChange={handleChange}
                            error={errors.reference_number}
                            required={false}
                            placeholder="Optional transaction ID or cheque number"
                        />
                    </div>
                </FormSection>

                <div className="flex justify-end gap-3 pt-2">
                    <Button type="button" variant="ghost" onClick={onClose} disabled={isSaving}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="primary" isLoading={isSaving}>
                        Save Payment
                    </Button>
                </div>
            </form>
        </Dialog>
    );
}
