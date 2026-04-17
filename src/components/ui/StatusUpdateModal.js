"use client";

import React, { useEffect, useMemo, useState } from 'react';
import Dialog from '@components/ui/Dialog';
import Button from '@components/ui/Button';
import FormField from '@/components/ui/FormField';
import { useForm } from '@/hooks/useForm';
import { useUpdate } from '@/hooks/useCrud';

const statusValidators = {
    status: { required: true, label: 'Status' }
};

const getInitialState = (property) => ({
    status: property?.status || 'Available'
});

const getOwnerLabel = (owner) => {
    if (!owner) return 'Unassigned';
    if (typeof owner === 'object') {
        const fullName = `${owner.first_name || ''} ${owner.last_name || ''}`.trim();
        return fullName || owner.client_no || 'Unassigned';
    }
    return owner;
};

const getBranchLabel = (branch) => {
    if (!branch) return 'Unassigned';
    if (typeof branch === 'object') {
        const branchNo = branch.branch_no || '';
        const city = branch.city || '';
        if (branchNo && city) return `${branchNo} - ${city}`;
        return branchNo || city || 'Unassigned';
    }
    return branch;
};

const getAddressLabel = (property) => {
    const lines = [property?.street, property?.area, property?.city, property?.postcode].filter(Boolean);
    return lines.join(', ') || 'N/A';
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

export default function StatusUpdateModal({
    isOpen,
    onClose,
    onSuccess,
    propertyToUpdate
}) {
    const [loadError, setLoadError] = useState('');

    const {
        updateRecord,
        isLoading: isSaving,
        error: submitError,
        setError: setSubmitError
    } = useUpdate('/properties');

    const { formData, errors, handleChange, validate, reset } = useForm(
        getInitialState(propertyToUpdate),
        statusValidators
    );

    useEffect(() => {
        if (!isOpen) return;

        reset(getInitialState(propertyToUpdate));
        setSubmitError(null);
        setLoadError('');
    }, [isOpen, propertyToUpdate?.property_no]);

    const summary = useMemo(() => ({
        propertyNo: propertyToUpdate?.property_no || 'N/A',
        address: getAddressLabel(propertyToUpdate),
        owner: getOwnerLabel(propertyToUpdate?.owner),
        branch: getBranchLabel(propertyToUpdate?.branch),
        currentStatus: propertyToUpdate?.status || 'N/A'
    }), [propertyToUpdate]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validate()) return;

        const propertyNo = propertyToUpdate?.property_no;
        if (!propertyNo) {
            setLoadError('Property context is missing. Please close and reopen this modal.');
            return;
        }

        // Status-only PATCH payload to avoid unintended property field overwrites.
        const payload = {
            status: formData.status
        };

        const result = await updateRecord(propertyNo, payload, 'PATCH');

        if (result.success) {
            onSuccess();
            onClose();
        }
    };

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            title={propertyToUpdate ? `Update Rental Status - ${summary.propertyNo}` : 'Update Rental Status'}
        >
            <form onSubmit={handleSubmit} className="space-y-5 max-h-[75vh] overflow-y-auto pr-1 pb-1 custom-scrollbar">
                {(loadError || submitError) && (
                    <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 sticky top-0 z-10">
                        {loadError || submitError}
                    </div>
                )}

                <FormSection
                    title="Property Details"
                    description="Review these read-only details before applying the new rental status."
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        <div className="bg-white rounded-lg border border-gray-200 p-3">
                            <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Property ID</p>
                            <p className="text-gray-900 font-semibold mt-1">{summary.propertyNo}</p>
                        </div>
                        <div className="bg-white rounded-lg border border-gray-200 p-3">
                            <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Current Status</p>
                            <p className="text-gray-900 font-semibold mt-1">{summary.currentStatus}</p>
                        </div>
                        <div className="bg-white rounded-lg border border-gray-200 p-3 sm:col-span-2">
                            <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Address</p>
                            <p className="text-gray-900 font-semibold mt-1">{summary.address}</p>
                        </div>
                        <div className="bg-white rounded-lg border border-gray-200 p-3">
                            <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Owner</p>
                            <p className="text-gray-900 font-semibold mt-1">{summary.owner}</p>
                        </div>
                        <div className="bg-white rounded-lg border border-gray-200 p-3">
                            <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Branch</p>
                            <p className="text-gray-900 font-semibold mt-1">{summary.branch}</p>
                        </div>
                    </div>
                </FormSection>

                <FormSection
                    title="Status Update"
                    description="Only the status field will be sent in a PATCH request."
                >
                    <FormField
                        label="New Status"
                        field="status"
                        type="select"
                        value={formData.status}
                        onChange={handleChange}
                        error={errors.status}
                    >
                        <option value="Available">Available</option>
                        <option value="Reserved">Reserved</option>
                        <option value="Rented">Rented</option>
                        <option value="Maintenance">Maintenance</option>
                    </FormField>
                </FormSection>

                <div className="flex justify-end gap-3 pt-2">
                    <Button type="button" variant="ghost" onClick={onClose} disabled={isSaving}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="primary" isLoading={isSaving}>
                        Save Status
                    </Button>
                </div>
            </form>
        </Dialog>
    );
}
