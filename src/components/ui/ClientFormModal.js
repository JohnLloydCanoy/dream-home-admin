"use client";

import React, { useState, useEffect } from 'react';
import Button from '../../../global-components/ui/Button';
import Dialog from '../../../global-components/ui/Dialog';
import FormField from '@/components/ui/FormField';
import { useForm } from '@/hooks/useForm';
import { useCreate, useUpdate } from '@/hooks/useCrud';

const clientValidators = {
    first_name: { required: true, maxLength: 100, label: 'First Name' },
    last_name: { required: true, maxLength: 100, label: 'Last Name' },
    email: {
        required: true,
        maxLength: 255,
        label: 'Email',
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        patternMessage: 'Enter a valid email address'
    },
    telephone_no: {
        required: false,
        maxLength: 50,
        label: 'Telephone Number',
        pattern: /^\+?[\d\s\-()]{7,50}$/,
        patternMessage: 'Enter a valid phone number'
    },
};

export default function ClientFormModal({ isOpen, onClose, onSuccess, clientToEdit }) {
    const isEditMode = Boolean(clientToEdit);

    // API Hooks
    const { createRecord, isLoading: isCreating, error: createError } = useCreate('/users/clients/');
    const { updateRecord, isLoading: isUpdating, error: updateError } = useUpdate('/users/clients');

    const isSaving = isCreating || isUpdating;
    const submitError = isEditMode ? updateError : createError;

    // Form fields
    const { formData, errors, handleChange, validate, reset } = useForm({
        first_name: clientToEdit?.first_name || '',
        last_name: clientToEdit?.last_name || '',
        email: clientToEdit?.email || '',
        telephone_no: clientToEdit?.telephone_no || '',
        address: clientToEdit?.address || '',
        role: clientToEdit?.role || 'Renter',
        password: '',
    }, clientValidators);

    useEffect(() => {
        if (isOpen) reset();
    }, [clientToEdit?.client_no, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        const payload = { ...formData };
        if (isEditMode) {
            delete payload.password; // Django client updates don't easily handle passwords directly without override or we skip it here
        } else if (!payload.password) {
            // Supply a default password if they left it blank
            payload.password = 'dreamhome2026';
        }

        const result = isEditMode
            ? await updateRecord(clientToEdit.client_no, payload)
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
            title={isEditMode ? `Edit Client: ${clientToEdit.first_name} ${clientToEdit.last_name}` : "Add New Client"}
        >
            <form onSubmit={handleSubmit} className="space-y-6 max-h-[75vh] overflow-y-auto px-2 pb-4">
                {submitError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 sticky top-0 z-10">
                        {submitError}
                    </div>
                )}

                {/* --- 1. PERSONAL DETAILS --- */}
                <div>
                    <h3 className="text-sm font-bold text-blue-900 border-b pb-2 mb-3 flex items-center gap-2">
                        <span className="bg-[#002147] text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]">1</span>
                        Personal Information
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <FormField label="First Name" field="first_name" value={formData.first_name} onChange={handleChange} error={errors.first_name} placeholder="e.g. Juan" />
                        <FormField label="Last Name" field="last_name" value={formData.last_name} onChange={handleChange} error={errors.last_name} placeholder="e.g. Dela Cruz" />
                        <FormField label="Email" field="email" type="email" value={formData.email} onChange={handleChange} error={errors.email} placeholder="user@dreamhome.ph" />
                        <FormField label="Telephone" field="telephone_no" value={formData.telephone_no} onChange={handleChange} error={errors.telephone_no} required={false} placeholder="09..." />
                        <FormField label="Address" field="address" value={formData.address} onChange={handleChange} error={errors.address} className="col-span-2" required={false} placeholder="Full address" />
                    </div>
                </div>

                {/* --- 2. ACCOUNT DETAILS --- */}
                <div>
                    <h3 className="text-sm font-bold text-blue-900 border-b pb-2 mb-3 flex items-center gap-2">
                        <span className="bg-[#002147] text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]">2</span>
                        Account Settings
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <FormField label="Role" field="role" type="select" value={formData.role} onChange={handleChange} error={errors.role}>
                            <option value="Renter">Renter</option>
                            <option value="Owner">Owner</option>
                        </FormField>
                        {!isEditMode && (
                            <FormField label="Password" field="password" type="password" value={formData.password} onChange={handleChange} required={false} placeholder="Default: dreamhome2026" />
                        )}
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                    <Button variant="ghost" onClick={onClose} type="button" disabled={isSaving}>Cancel</Button>
                    <Button type="submit" variant="primary" isLoading={isSaving}>
                        {isEditMode ? "Update Client" : "Save Client"}
                    </Button>
                </div>
            </form>
        </Dialog>
    );
}