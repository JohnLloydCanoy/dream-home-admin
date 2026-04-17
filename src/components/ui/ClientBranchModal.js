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

const getClientName = (client) => {
    if (!client) return 'Unknown Client';
    return `${client.first_name || ''} ${client.last_name || ''}`.trim() || client.client_no;
};

const getBranchLabel = (branch) => {
    if (!branch) return 'Unregistered';
    if (typeof branch === 'object') {
        const branchNo = branch.branch_no || '';
        const city = branch.city || '';
        if (branchNo && city) return `${branchNo} - ${city}`;
        return branchNo || city || 'Unregistered';
    }
    return branch;
};

const getInitialState = (client) => ({
    registration_branch: toId(client?.registration_branch, 'branch_no')
});

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

export default function ClientBranchModal({
    isOpen,
    onClose,
    onSuccess,
    clientToRegister
}) {
    const [branches, setBranches] = useState([]);
    const [loadError, setLoadError] = useState('');

    const { updateRecord, isLoading: isSaving, error: submitError, setError: setSubmitError } = useUpdate('/users/client');

    const { formData, errors, handleChange, validate, reset } = useForm(
        getInitialState(clientToRegister),
        {}
    );

    useEffect(() => {
        if (!isOpen) return;

        setLoadError('');

        apiClient('/branches/')
            .then((data) => {
                setBranches(normalizeList(data));
            })
            .catch((error) => {
                console.error('Failed to load branch options for client registration:', error);
                setLoadError('Unable to load branch options right now.');
            });
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;

        reset(getInitialState(clientToRegister));
        setSubmitError(null);
        setLoadError('');
    }, [isOpen, clientToRegister?.client_no]);

    const clientSummary = useMemo(() => {
        return {
            name: getClientName(clientToRegister),
            clientNo: clientToRegister?.client_no || 'N/A',
            role: clientToRegister?.role || 'N/A',
            currentBranch: getBranchLabel(clientToRegister?.registration_branch)
        };
    }, [clientToRegister]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validate()) return;

        const clientNo = clientToRegister?.client_no;
        if (!clientNo) {
            setLoadError('Client context is missing. Please close and reopen this modal.');
            return;
        }

        // Security: allocation-only payload, patch only the registration branch field.
        const payload = {
            registration_branch: formData.registration_branch || null
        };

        const result = await updateRecord(clientNo, payload, 'PATCH');

        if (result.success) {
            onSuccess();
            onClose();
        }
    };

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            title={clientToRegister ? `Branch Registration - ${clientSummary.clientNo}` : 'Client Branch Registration'}
        >
            <form onSubmit={handleSubmit} className="space-y-5 max-h-[75vh] overflow-y-auto pr-1 pb-1 custom-scrollbar">
                {(loadError || submitError) && (
                    <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 sticky top-0 z-10">
                        {loadError || submitError}
                    </div>
                )}

                <FormSection
                    title="Client Context"
                    description="Review the current registration profile before assigning a branch."
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        <div className="bg-white rounded-lg border border-gray-200 p-3">
                            <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Client</p>
                            <p className="text-gray-900 font-semibold mt-1">{clientSummary.name}</p>
                        </div>
                        <div className="bg-white rounded-lg border border-gray-200 p-3">
                            <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Client No</p>
                            <p className="text-gray-900 font-semibold mt-1">{clientSummary.clientNo}</p>
                        </div>
                        <div className="bg-white rounded-lg border border-gray-200 p-3">
                            <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Role</p>
                            <p className="text-gray-900 font-semibold mt-1">{clientSummary.role}</p>
                        </div>
                        <div className="bg-white rounded-lg border border-gray-200 p-3">
                            <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Current Registration Branch</p>
                            <p className="text-gray-900 font-semibold mt-1">{clientSummary.currentBranch}</p>
                        </div>
                    </div>
                </FormSection>

                <FormSection
                    title="Branch Registration"
                    description="Only registration_branch is sent in the PATCH payload for this allocation update."
                >
                    <FormField
                        label="Registration Branch"
                        field="registration_branch"
                        type="select"
                        value={formData.registration_branch}
                        onChange={handleChange}
                        error={errors.registration_branch}
                        required={false}
                    >
                        <option value="">- Unregistered -</option>
                        {branches.map((branch) => (
                            <option key={branch.branch_no} value={branch.branch_no}>
                                {branch.branch_no} - {branch.city}
                            </option>
                        ))}
                    </FormField>
                </FormSection>

                <div className="flex justify-end gap-3 pt-2">
                    <Button type="button" variant="ghost" onClick={onClose} disabled={isSaving}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="primary" isLoading={isSaving}>
                        Save Registration
                    </Button>
                </div>
            </form>
        </Dialog>
    );
}
