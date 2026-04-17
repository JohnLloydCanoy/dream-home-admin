"use client";

import React, { useEffect, useMemo, useState } from 'react';
import Button from '@components/ui/Button';
import Dialog from '@components/ui/Dialog';
import FormField from '@/components/ui/FormField';
import apiClient from '@/lib/apiClient';
import { useForm } from '@/hooks/useForm';
import { useUpdate } from '@/hooks/useCrud';

const RESPONSIBILITY_OPTIONS = [
    { value: 'Staff', label: 'Standard Staff' },
    { value: 'Supervisor', label: 'Supervisor' },
    { value: 'Secretary', label: 'Secretary' },
    { value: 'Manager', label: 'Manager' }
];

const normalizeList = (data) => data?.results || data?.items || data || [];

const toId = (value, idField) => {
    if (!value) return '';
    if (typeof value === 'object') return value[idField] || '';
    return value;
};

const getStaffName = (staff) => {
    if (!staff) return 'Unknown staff';
    return `${staff.first_name || ''} ${staff.last_name || ''}`.trim() || staff.staff_no;
};

const getBranchLabel = (branch) => {
    if (!branch) return 'Unassigned';
    if (typeof branch === 'object') {
        if (branch.branch_no && branch.city) return `${branch.branch_no} - ${branch.city}`;
        return branch.branch_no || branch.city || 'Unassigned';
    }
    return branch;
};

const getInitialState = (allocation) => ({
    staff_no: allocation?.staff_no || '',
    branch: toId(allocation?.branch, 'branch_no'),
    position: allocation?.position || 'Staff',
    supervisor: toId(allocation?.supervisor, 'staff_no'),
    typing_speed: allocation?.typing_speed || '',
    manager_start_date: allocation?.manager_start_date || '',
    bonus_payment: allocation?.bonus_payment || '',
    car_allowance: allocation?.car_allowance || ''
});

const getValidators = (isEditMode) => {
    const validators = {
        branch: { required: true, label: 'Branch' },
        position: { required: true, label: 'Responsibility' }
    };

    if (!isEditMode) {
        validators.staff_no = { required: true, label: 'Staff Member' };
    }

    return validators;
};

const sectionToneClasses = {
    neutral: {
        wrapper: 'bg-gray-50/60 border-gray-100',
        badge: 'bg-gray-700'
    },
    accent: {
        wrapper: 'bg-blue-50/50 border-blue-100',
        badge: 'bg-[#002147]'
    },
    success: {
        wrapper: 'bg-green-50/60 border-green-100',
        badge: 'bg-green-700'
    }
};

const FormSection = ({ step, title, description, tone = 'neutral', children }) => {
    const toneClass = sectionToneClasses[tone] || sectionToneClasses.neutral;

    return (
        <section className={`rounded-xl border p-4 sm:p-5 ${toneClass.wrapper}`}>
            <div className="flex items-start gap-3 mb-4">
                <span className={`text-white w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${toneClass.badge}`}>
                    {step}
                </span>
                <div>
                    <h3 className="text-sm font-bold text-[#002147]">{title}</h3>
                    {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
                </div>
            </div>
            {children}
        </section>
    );
};

export default function ResourceAllocationFormModal({
    isOpen,
    onClose,
    onSuccess,
    allocationToEdit
}) {
    const isEditMode = Boolean(allocationToEdit?.staff_no);

    const [staffList, setStaffList] = useState([]);
    const [branchList, setBranchList] = useState([]);
    const [loadError, setLoadError] = useState('');
    const [localErrors, setLocalErrors] = useState({});

    const { updateRecord, isLoading: isSaving, error: submitError, setError: setSubmitError } = useUpdate('/users/staff');

    const { formData, errors, handleChange, validate, reset } = useForm(
        getInitialState(allocationToEdit),
        getValidators(isEditMode)
    );

    useEffect(() => {
        if (!isOpen) return;

        setLoadError('');

        Promise.all([apiClient('/users/staff/'), apiClient('/branches/')])
            .then(([staffData, branchesData]) => {
                setStaffList(normalizeList(staffData));
                setBranchList(normalizeList(branchesData));
            })
            .catch((error) => {
                console.error('Failed to load resource allocation options:', error);
                setLoadError('Failed to load staff or branch options. Please try again.');
            });
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;

        reset(getInitialState(allocationToEdit));
        setLocalErrors({});
        setLoadError('');
        setSubmitError(null);
    }, [isOpen, allocationToEdit?.staff_no]);

    const selectedStaffNo = isEditMode ? allocationToEdit?.staff_no || '' : formData.staff_no;

    const availableStaffOptions = useMemo(() => {
        return staffList.filter((staff) => {
            const assignedBranch = toId(staff.branch, 'branch_no');
            return !assignedBranch || staff.staff_no === selectedStaffNo;
        });
    }, [staffList, selectedStaffNo]);

    const supervisorOptions = useMemo(() => {
        return staffList.filter((staff) => {
            if (staff.position !== 'Supervisor') return false;
            if (staff.staff_no === selectedStaffNo) return false;

            const supervisorBranch = toId(staff.branch, 'branch_no');
            if (!formData.branch) return true;

            return !supervisorBranch || supervisorBranch === formData.branch;
        });
    }, [staffList, formData.branch, selectedStaffNo]);

    const showSecretaryFields = formData.position === 'Secretary';
    const showManagerFields = formData.position === 'Manager';

    const selectedStaff = useMemo(() => {
        if (!selectedStaffNo) return null;
        return staffList.find((staff) => staff.staff_no === selectedStaffNo) || null;
    }, [staffList, selectedStaffNo]);

    const handleFieldChange = (field, value) => {
        handleChange(field, value);

        if (localErrors[field]) {
            setLocalErrors((prev) => ({ ...prev, [field]: null }));
        }

        if (field === 'position') {
            if (value !== 'Secretary') {
                handleChange('typing_speed', '');
                setLocalErrors((prev) => ({ ...prev, typing_speed: null }));
            }

            if (value !== 'Manager') {
                handleChange('manager_start_date', '');
                handleChange('bonus_payment', '');
                handleChange('car_allowance', '');
                setLocalErrors((prev) => ({ ...prev, manager_start_date: null }));
            }
        }

        if (field === 'branch' && formData.supervisor) {
            const supervisor = staffList.find((staff) => staff.staff_no === formData.supervisor);
            const supervisorBranch = toId(supervisor?.branch, 'branch_no');

            if (supervisorBranch && supervisorBranch !== value) {
                handleChange('supervisor', '');
            }
        }
    };

    const validateConditionalFields = () => {
        const nextErrors = {};

        if (showSecretaryFields && !String(formData.typing_speed || '').trim()) {
            nextErrors.typing_speed = 'Typing speed is required for Secretary responsibility.';
        }

        if (showManagerFields && !String(formData.manager_start_date || '').trim()) {
            nextErrors.manager_start_date = 'Manager start date is required for Manager responsibility.';
        }

        setLocalErrors(nextErrors);

        return Object.keys(nextErrors).length === 0;
    };

    const buildSanitizedPayload = () => {
        const payload = {
            branch: formData.branch || null,
            position: formData.position,
            supervisor: formData.supervisor || null,
            typing_speed: null,
            manager_start_date: null,
            bonus_payment: null,
            car_allowance: null
        };

        if (showSecretaryFields) {
            payload.typing_speed = formData.typing_speed ? Number(formData.typing_speed) : null;
        }

        if (showManagerFields) {
            payload.manager_start_date = formData.manager_start_date || null;
            payload.bonus_payment = formData.bonus_payment ? Number(formData.bonus_payment) : null;
            payload.car_allowance = formData.car_allowance ? Number(formData.car_allowance) : null;
        }

        return payload;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validate()) return;
        if (!validateConditionalFields()) return;

        const targetStaffNo = selectedStaffNo;
        if (!targetStaffNo) {
            setLoadError('Please choose a staff member before submitting the assignment.');
            return;
        }

        const staffExists = staffList.some((staff) => staff.staff_no === targetStaffNo);
        if (!staffExists) {
            setLoadError('The selected staff member is no longer available. Reload and try again.');
            return;
        }

        const result = await updateRecord(targetStaffNo, buildSanitizedPayload(), 'PATCH');

        if (result.success) {
            onSuccess();
            onClose();
        }
    };

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            title={isEditMode ? `Edit Allocation - ${allocationToEdit.staff_no}` : 'Assign Staff to Branch'}
        >
            <form onSubmit={handleSubmit} className="space-y-5 max-h-[75vh] overflow-y-auto px-1 pb-2 custom-scrollbar">
                {(submitError || loadError) && (
                    <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 sticky top-0 z-10">
                        {submitError || loadError}
                    </div>
                )}

                <FormSection
                    step="1"
                    title="Staff Target"
                    description="Choose who will receive this branch assignment and responsibility."
                    tone="neutral"
                >
                    {isEditMode ? (
                        <div className="rounded-lg border border-gray-200 bg-white p-3">
                            <p className="text-sm font-semibold text-gray-900">{getStaffName(selectedStaff || allocationToEdit)}</p>
                            <p className="text-xs text-gray-500 mt-1">Staff No: {selectedStaffNo}</p>
                            <p className="text-xs text-gray-500">Current Branch: {getBranchLabel(allocationToEdit?.branch)}</p>
                        </div>
                    ) : (
                        <>
                            <FormField
                                label="Staff Member"
                                field="staff_no"
                                type="select"
                                value={formData.staff_no}
                                onChange={handleFieldChange}
                                error={errors.staff_no || localErrors.staff_no}
                            >
                                <option value="">- Select unassigned staff -</option>
                                {availableStaffOptions.map((staff) => (
                                    <option key={staff.staff_no} value={staff.staff_no}>
                                        {getStaffName(staff)} ({staff.staff_no})
                                    </option>
                                ))}
                            </FormField>

                            {availableStaffOptions.length === 0 && (
                                <p className="text-xs text-amber-700 mt-2 bg-amber-50 border border-amber-200 rounded-md p-2">
                                    No unassigned staff available. Edit an existing allocation instead.
                                </p>
                            )}
                        </>
                    )}
                </FormSection>

                <FormSection
                    step="2"
                    title="Branch and Responsibility"
                    description="Allocate the selected staff member to a branch and role."
                    tone="accent"
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                            label="Branch"
                            field="branch"
                            type="select"
                            value={formData.branch}
                            onChange={handleFieldChange}
                            error={errors.branch || localErrors.branch}
                        >
                            <option value="">- Select branch -</option>
                            {branchList.map((branch) => (
                                <option key={branch.branch_no} value={branch.branch_no}>
                                    {branch.branch_no} - {branch.city}
                                </option>
                            ))}
                        </FormField>

                        <FormField
                            label="Responsibility"
                            field="position"
                            type="select"
                            value={formData.position}
                            onChange={handleFieldChange}
                            error={errors.position || localErrors.position}
                        >
                            {RESPONSIBILITY_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </FormField>

                        <FormField
                            label="Supervisor"
                            field="supervisor"
                            type="select"
                            value={formData.supervisor}
                            onChange={handleFieldChange}
                            required={false}
                            className="sm:col-span-2"
                        >
                            <option value="">- None -</option>
                            {supervisorOptions.map((staff) => (
                                <option key={staff.staff_no} value={staff.staff_no}>
                                    {getStaffName(staff)} ({staff.staff_no})
                                </option>
                            ))}
                        </FormField>
                    </div>
                </FormSection>

                {(showSecretaryFields || showManagerFields) && (
                    <FormSection
                        step="3"
                        title="Conditional Responsibility Fields"
                        description="Only fields for the active responsibility are submitted to the API."
                        tone="success"
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {showSecretaryFields && (
                                <FormField
                                    label="Typing Speed (WPM)"
                                    field="typing_speed"
                                    type="number"
                                    value={formData.typing_speed}
                                    onChange={handleFieldChange}
                                    error={errors.typing_speed || localErrors.typing_speed}
                                    placeholder="e.g. 65"
                                    className="sm:col-span-3"
                                />
                            )}

                            {showManagerFields && (
                                <>
                                    <FormField
                                        label="Manager Start Date"
                                        field="manager_start_date"
                                        type="date"
                                        value={formData.manager_start_date}
                                        onChange={handleFieldChange}
                                        error={errors.manager_start_date || localErrors.manager_start_date}
                                    />
                                    <FormField
                                        label="Bonus Payment"
                                        field="bonus_payment"
                                        type="number"
                                        value={formData.bonus_payment}
                                        onChange={handleFieldChange}
                                        required={false}
                                        placeholder="Optional"
                                    />
                                    <FormField
                                        label="Car Allowance"
                                        field="car_allowance"
                                        type="number"
                                        value={formData.car_allowance}
                                        onChange={handleFieldChange}
                                        required={false}
                                        placeholder="Optional"
                                    />
                                </>
                            )}
                        </div>
                    </FormSection>
                )}

                <div className="flex justify-end gap-3 pt-2">
                    <Button type="button" variant="ghost" onClick={onClose} disabled={isSaving}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="primary" isLoading={isSaving}>
                        {isEditMode ? 'Update Allocation' : 'Assign Staff'}
                    </Button>
                </div>
            </form>
        </Dialog>
    );
}
