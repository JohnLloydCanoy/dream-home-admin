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

const getStaffLabel = (staff) => {
    if (!staff) return 'Unknown Staff';
    const fullName = `${staff.first_name || ''} ${staff.last_name || ''}`.trim();
    const branchNo = toId(staff.branch, 'branch_no');
    const role = staff.position || 'Staff';

    if (branchNo) {
        return `${fullName || staff.staff_no} (${staff.staff_no}) • ${role} • ${branchNo}`;
    }

    return `${fullName || staff.staff_no} (${staff.staff_no}) • ${role}`;
};

const getInitialState = (client) => ({
    assigned_staff: toId(client?.assigned_staff, 'staff_no')
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

export default function ClientAssignmentModal({
    isOpen,
    onClose,
    onSuccess,
    clientToAssign
}) {
    const [staffOptions, setStaffOptions] = useState([]);
    const [loadError, setLoadError] = useState('');

    const { updateRecord, isLoading: isSaving, error: submitError, setError: setSubmitError } = useUpdate('/users/client');

    const { formData, errors, handleChange, validate, reset } = useForm(
        getInitialState(clientToAssign),
        {}
    );

    useEffect(() => {
        if (!isOpen) return;

        setLoadError('');

        apiClient('/users/staff/')
            .then((data) => {
                setStaffOptions(normalizeList(data));
            })
            .catch((error) => {
                console.error('Failed to load staff options for client assignment:', error);
                setLoadError('Unable to load staff options right now.');
            });
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;

        reset(getInitialState(clientToAssign));
        setSubmitError(null);
        setLoadError('');
    }, [isOpen, clientToAssign?.client_no]);

    const clientSummary = useMemo(() => {
        return {
            name: getClientName(clientToAssign),
            clientNo: clientToAssign?.client_no || 'N/A',
            role: clientToAssign?.role || 'N/A',
            currentStaff: toId(clientToAssign?.assigned_staff, 'staff_no') || 'Unassigned'
        };
    }, [clientToAssign]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validate()) return;

        const clientNo = clientToAssign?.client_no;
        if (!clientNo) {
            setLoadError('Client context is missing. Please close and reopen this modal.');
            return;
        }

        const payload = {
            assigned_staff: formData.assigned_staff || null
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
            title={clientToAssign ? `Assign Staff - ${clientSummary.clientNo}` : 'Assign Staff'}
        >
            <form onSubmit={handleSubmit} className="space-y-5 max-h-[75vh] overflow-y-auto pr-1 pb-1 custom-scrollbar">
                {(loadError || submitError) && (
                    <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 sticky top-0 z-10">
                        {loadError || submitError}
                    </div>
                )}

                <FormSection
                    title="Client Context"
                    description="Review the client details before assigning a relationship manager."
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
                            <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Current Assigned Staff</p>
                            <p className="text-gray-900 font-semibold mt-1">{clientSummary.currentStaff}</p>
                        </div>
                    </div>
                </FormSection>

                <FormSection
                    title="Staff Assignment"
                    description="Only assigned_staff is sent in the PATCH payload for this update."
                >
                    <FormField
                        label="Assigned Staff"
                        field="assigned_staff"
                        type="select"
                        value={formData.assigned_staff}
                        onChange={handleChange}
                        error={errors.assigned_staff}
                        required={false}
                    >
                        <option value="">- Unassigned -</option>
                        {staffOptions.map((staff) => (
                            <option key={staff.staff_no} value={staff.staff_no}>
                                {getStaffLabel(staff)}
                            </option>
                        ))}
                    </FormField>
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
