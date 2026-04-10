"use client";

import React, { useState, useEffect } from 'react';
import Button from '../../../global-components/ui/Button';
import Dialog from '../../../global-components/ui/Dialog';
import apiClient from '@/lib/apiClient';
import { useForm } from '@/hooks/useForm';
import { useCreate, useUpdate } from '@/hooks/useCrud';
import { validateForm, staffValidators } from '@/lib/validator';
import FormField from './FormField';



export default function StaffFormModal({ isOpen, onClose, onSuccess, staffToEdit }) {
    const isEditMode = Boolean(staffToEdit);
    const [branches, setBranches] = useState([]);
    const [staffList, setStaffList] = useState([]);

    // API Hooks
    const { createRecord, isLoading: isCreating, error: createError } = useCreate('/users/staff/');
    const { updateRecord, isLoading: isUpdating, error: updateError } = useUpdate('/users/staff');

    const isSaving = isCreating || isUpdating;
    const submitError = isEditMode ? updateError : createError;

    // Fetch dropdown options
    useEffect(() => {
        if (isOpen) {
            Promise.all([apiClient('/branches/'), apiClient('/users/staff/')])
                .then(([branchData, staffData]) => {
                    setBranches(branchData.items || branchData);
                    setStaffList(staffData.results || staffData.items || staffData);
                })
                .catch(err => console.error("Failed to load options:", err));
        }
    }, [isOpen]);

    // Flatten data for the form (merging Next of Kin)
    const { formData, errors, handleChange, validate, reset } = useForm({
        first_name: staffToEdit?.first_name || '',
        last_name: staffToEdit?.last_name || '',
        email: staffToEdit?.email || '',
        sex: staffToEdit?.sex || '',
        dob: staffToEdit?.dob || '',
        address: staffToEdit?.address || '',
        telephone_no: staffToEdit?.telephone_no || '',
        nin: staffToEdit?.nin || '',
        position: staffToEdit?.position || 'Staff',
        salary: staffToEdit?.salary || '',
        date_joined: staffToEdit?.date_joined || '',
        branch: (typeof staffToEdit?.branch === 'object' ? staffToEdit.branch?.branch_no : staffToEdit?.branch) || '',
        supervisor: (typeof staffToEdit?.supervisor === 'object' ? staffToEdit.supervisor?.staff_no : staffToEdit?.supervisor) || '',

        // Conditional Fields
        typing_speed: staffToEdit?.typing_speed || '',
        manager_start_date: staffToEdit?.manager_start_date || '',
        bonus_payment: staffToEdit?.bonus_payment || '',
        car_allowance: staffToEdit?.car_allowance || '',

        // Next of Kin Fields
        nok_full_name: staffToEdit?.next_of_kin?.full_name || '',
        nok_relationship: staffToEdit?.next_of_kin?.relationship || '',
        nok_address: staffToEdit?.next_of_kin?.address || '',
        nok_telephone_no: staffToEdit?.next_of_kin?.telephone_no || ''
    }, staffValidators);

    useEffect(() => {
        if (isOpen) reset();
    }, [staffToEdit?.staff_no, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        // Bundle payload for Django
        const payload = {
            ...formData,
            supervisor: formData.supervisor || null,
            branch: formData.branch || null,
            // Re-nest Next of Kin for the Django OneToOne field
            next_of_kin: {
                full_name: formData.nok_full_name,
                relationship: formData.nok_relationship,
                address: formData.nok_address,
                telephone_no: formData.nok_telephone_no
            }
        };

        // Clean up conditional data based on position
        if (payload.position !== 'Secretary') payload.typing_speed = null;
        if (payload.position !== 'Manager') {
            payload.manager_start_date = null;
            payload.bonus_payment = null;
            payload.car_allowance = null;
        }

        const result = isEditMode
            ? await updateRecord(staffToEdit.staff_no, payload)
            : await createRecord(payload);

        if (result.success) {
            onSuccess();
            onClose();
        }
    };

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            title={isEditMode ? `Edit Staff ${staffToEdit.staff_no}` : "Register New Staff"}
        >
            <form onSubmit={handleSubmit} className="space-y-6 max-h-[75vh] overflow-y-auto px-2 pb-4">
                {submitError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 sticky top-0 z-10">
                        {submitError}
                    </div>
                )}

                {/* --- 1. CORE DETAILS --- */}
                <div>
                    <h3 className="text-sm font-bold text-blue-900 border-b pb-2 mb-3">Core Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <FormField label="First Name" field="first_name" value={formData.first_name} onChange={handleChange} error={errors.first_name} />
                        <FormField label="Last Name" field="last_name" value={formData.last_name} onChange={handleChange} error={errors.last_name} />
                        <FormField label="Email" field="email" type="email" value={formData.email} onChange={handleChange} error={errors.email} />
                        <FormField label="Telephone" field="telephone_no" value={formData.telephone_no} onChange={handleChange} error={errors.telephone_no} />
                        <FormField label="Address" field="address" value={formData.address} onChange={handleChange} error={errors.address} className="col-span-2" />
                        <FormField label="Gender" field="sex" type="select" value={formData.sex} onChange={handleChange} error={errors.sex}>
                            <option value="">— Select —</option>
                            <option value="M">Male</option>
                            <option value="F">Female</option>
                        </FormField>
                        <FormField label="Date of Birth" field="dob" type="date" value={formData.dob} onChange={handleChange} error={errors.dob} />
                        <FormField label="National Insurance No." field="nin" value={formData.nin} onChange={handleChange} error={errors.nin} />
                        <FormField label="Date Joined" field="date_joined" type="date" value={formData.date_joined} onChange={handleChange} error={errors.date_joined} />
                    </div>
                </div>

                {/* --- 2. EMPLOYMENT DETAILS --- */}
                <div>
                    <h3 className="text-sm font-bold text-blue-900 border-b pb-2 mb-3">Employment</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <FormField label="Position" field="position" type="select" value={formData.position} onChange={handleChange} error={errors.position}>
                            <option value="Staff">Standard Staff</option>
                            <option value="Manager">Manager</option>
                            <option value="Supervisor">Supervisor</option>
                            <option value="Secretary">Secretary</option>
                        </FormField>
                        <FormField label="Salary" field="salary" type="number" value={formData.salary} onChange={handleChange} error={errors.salary} />
                        <FormField label="Branch" field="branch" type="select" value={formData.branch} onChange={handleChange} error={errors.branch}>
                            <option value="">— Select Branch —</option>
                            {branches.map(b => <option key={b.branch_no} value={b.branch_no}>{b.city}</option>)}
                        </FormField>
                        <FormField label="Supervisor" field="supervisor" type="select" value={formData.supervisor} onChange={handleChange} error={errors.supervisor} required={false}>
                            <option value="">— None —</option>
                            {staffList.map(s => <option key={s.staff_no} value={s.staff_no}>{s.first_name} {s.last_name}</option>)}
                        </FormField>
                    </div>
                </div>

                {/* --- 3. CONDITIONAL FIELDS --- */}
                {formData.position === 'Secretary' && (
                    <div className="bg-orange-50 p-3 rounded-lg border border-orange-100">
                        <FormField label="Typing Speed (WPM)" field="typing_speed" type="number" value={formData.typing_speed} onChange={handleChange} error={errors.typing_speed} placeholder="e.g., 60" labelClass="text-orange-900" />
                    </div>
                )}

                {formData.position === 'Manager' && (
                    <div className="bg-green-50 p-3 rounded-lg border border-green-100 grid grid-cols-3 gap-3">
                        <FormField label="Manager Start" field="manager_start_date" type="date" value={formData.manager_start_date} onChange={handleChange} error={errors.manager_start_date} labelClass="text-green-900" />
                        <FormField label="Bonus" field="bonus_payment" type="number" value={formData.bonus_payment} onChange={handleChange} error={errors.bonus_payment} required={false} labelClass="text-green-900" />
                        <FormField label="Car Allowance" field="car_allowance" type="number" value={formData.car_allowance} onChange={handleChange} error={errors.car_allowance} required={false} labelClass="text-green-900" />
                    </div>
                )}

                {/* --- 4. NEXT OF KIN --- */}
                <div>
                    <h3 className="text-sm font-bold text-blue-900 border-b pb-2 mb-3">Next of Kin</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <FormField label="Full Name" field="nok_full_name" value={formData.nok_full_name} onChange={handleChange} required={false} />
                        <FormField label="Relationship" field="nok_relationship" value={formData.nok_relationship} onChange={handleChange} required={false} />
                        <FormField label="Address" field="nok_address" value={formData.nok_address} onChange={handleChange} required={false} />
                        <FormField label="Telephone No." field="nok_telephone_no" value={formData.nok_telephone_no} onChange={handleChange} required={false} />
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                    <Button variant="ghost" onClick={onClose} type="button" disabled={isSaving}>Cancel</Button>
                    <Button type="submit" variant="primary" isLoading={isSaving}>
                        {isEditMode ? "Update Staff" : "Save Staff Member"}
                    </Button>
                </div>
            </form>
        </Dialog>
    );
}