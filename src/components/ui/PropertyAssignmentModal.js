"use client";

import React, { useEffect, useMemo, useState } from 'react';
import Dialog from '@components/ui/Dialog';
import Button from '@components/ui/Button';
import FormField from '@/components/ui/FormField';
import apiClient from '@/lib/apiClient';
import { useForm } from '@/hooks/useForm';
import { useUpdate } from '@/hooks/useCrud';

const normalizeList = (data) => data?.results || data?.items || data || [];

const toId = (value, idField) => {
    if (!value) return '';
    if (typeof value === 'object') return value[idField] || '';
    return value;
};

const getPropertyAddress = (property) => {
    if (!property) return 'N/A';
    const lines = [property.street, property.area, property.city, property.postcode].filter(Boolean);
    return lines.join(', ') || 'N/A';
};

const getOwnerLabel = (owner) => {
    if (!owner) return 'Unassigned';
    if (typeof owner !== 'object') return owner;

    const fullName = `${owner?.first_name || ''} ${owner?.last_name || ''}`.trim();
    const ownerId = owner?.client_no || owner?.id || 'N/A';
    return `${fullName || 'Unknown Owner'} (${ownerId})`;
};

const getBranchLabel = (branch) => {
    if (!branch) return 'Unassigned';
    if (typeof branch === 'object') {
        if (branch.branch_no && branch.city) return `${branch.branch_no} - ${branch.city}`;
        return branch.branch_no || branch.city || 'Unassigned';
    }
    return branch;
};

const getInitialState = (property) => ({
    owner: toId(property?.owner, 'client_no'),
    branch: toId(property?.branch, 'branch_no')
});

const assignmentValidators = {
    owner: { required: true, label: 'Owner' },
    branch: { required: true, label: 'Branch' }
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

export default function PropertyAssignmentModal({
    isOpen,
    onClose,
    onSuccess,
    propertyToAssign
}) {
    const [owners, setOwners] = useState([]);
    const [branches, setBranches] = useState([]);
    const [loadError, setLoadError] = useState('');

    const {
        updateRecord,
        isLoading: isSaving,
        error: submitError,
        setError: setSubmitError
    } = useUpdate('/properties');

    const { formData, errors, handleChange, validate, reset } = useForm(
        getInitialState(propertyToAssign),
        assignmentValidators
    );

    useEffect(() => {
        if (!isOpen) return;

        setLoadError('');

        Promise.all([
            apiClient('/branches/'),
            apiClient('/users/client/').catch(() => apiClient('/users/clients/'))
        ])
            .then(([branchData, clientData]) => {
                const ownerOnly = normalizeList(clientData).filter(
                    (client) => String(client?.role || '').toLowerCase() === 'owner'
                );

                setBranches(normalizeList(branchData));
                setOwners(ownerOnly);
            })
            .catch((error) => {
                console.error('Failed to load property assignment options:', error);
                setLoadError('Unable to load owner and branch options right now.');
            });
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;

        reset(getInitialState(propertyToAssign));
        setSubmitError(null);
        setLoadError('');
    }, [isOpen, propertyToAssign?.property_no]);

    const propertySummary = useMemo(() => ({
        propertyNo: propertyToAssign?.property_no || 'N/A',
        address: getPropertyAddress(propertyToAssign),
        owner: propertyToAssign?.owner ? getOwnerLabel(propertyToAssign.owner) : 'Unassigned',
        branch: getBranchLabel(propertyToAssign?.branch)
    }), [propertyToAssign]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validate()) return;

        const propertyNo = propertyToAssign?.property_no;
        if (!propertyNo) {
            setLoadError('Property context is missing. Please close and reopen this modal.');
            return;
        }

        // Allocation-safe PATCH payload: only update owner and branch identifiers.
        const payload = {
            owner: formData.owner,
            branch: formData.branch
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
            title={propertyToAssign ? `Edit Assignment - ${propertySummary.propertyNo}` : 'Property Assignment'}
        >
            <form onSubmit={handleSubmit} className="space-y-5 max-h-[75vh] overflow-y-auto pr-1 pb-1 custom-scrollbar">
                {(loadError || submitError) && (
                    <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 sticky top-0 z-10">
                        {loadError || submitError}
                    </div>
                )}

                <FormSection
                    title="Property Context"
                    description="Review current assignment details before applying the allocation update."
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        <div className="bg-white rounded-lg border border-gray-200 p-3">
                            <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Property ID</p>
                            <p className="text-gray-900 font-semibold mt-1">{propertySummary.propertyNo}</p>
                        </div>
                        <div className="bg-white rounded-lg border border-gray-200 p-3">
                            <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Current Owner</p>
                            <p className="text-gray-900 font-semibold mt-1">{propertySummary.owner}</p>
                        </div>
                        <div className="bg-white rounded-lg border border-gray-200 p-3 sm:col-span-2">
                            <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Address</p>
                            <p className="text-gray-900 font-semibold mt-1">{propertySummary.address}</p>
                        </div>
                        <div className="bg-white rounded-lg border border-gray-200 p-3 sm:col-span-2">
                            <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Current Branch</p>
                            <p className="text-gray-900 font-semibold mt-1">{propertySummary.branch}</p>
                        </div>
                    </div>
                </FormSection>

                <FormSection
                    title="Assignment Update"
                    description="This action sends a PATCH request to update owner and branch only."
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                            label="Owner"
                            field="owner"
                            type="select"
                            value={formData.owner}
                            onChange={handleChange}
                            error={errors.owner}
                        >
                            <option value="">- Select Owner -</option>
                            {owners.map((owner) => (
                                <option key={owner.client_no} value={owner.client_no}>
                                    {getOwnerLabel(owner)}
                                </option>
                            ))}
                        </FormField>

                        <FormField
                            label="Branch"
                            field="branch"
                            type="select"
                            value={formData.branch}
                            onChange={handleChange}
                            error={errors.branch}
                        >
                            <option value="">- Select Branch -</option>
                            {branches.map((branch) => (
                                <option key={branch.branch_no} value={branch.branch_no}>
                                    {branch.branch_no} - {branch.city}
                                </option>
                            ))}
                        </FormField>
                    </div>
                </FormSection>

                <div className="flex justify-end gap-3 pt-2">
                    <Button type="button" variant="ghost" onClick={onClose} disabled={isSaving}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="primary" isLoading={isSaving}>
                        Save Assignment
                    </Button>
                </div>
            </form>
        </Dialog>
    );
}
