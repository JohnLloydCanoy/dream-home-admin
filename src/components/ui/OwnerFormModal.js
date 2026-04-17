"use client";

import React, { useEffect } from 'react';
import Button from '@components/ui/Button';
import Dialog from '@components/ui/Dialog';
import FormField from '@/components/ui/FormField';
import { useForm } from '@/hooks/useForm';
import { useCreate, useUpdate } from '@/hooks/useCrud';

const getInitialState = (owner) => ({
    first_name: owner?.first_name || '',
    last_name: owner?.last_name || '',
    email: owner?.email || '',
    telephone_no: owner?.telephone_no || '',
    address: owner?.address || '',
    password: ''
});

const getOwnerValidators = (isEditMode) => {
    const validators = {
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
            required: true,
            maxLength: 50,
            label: 'Telephone Number',
            pattern: /^\+?[\d\s\-()]{7,50}$/,
            patternMessage: 'Enter a valid phone number'
        },
        address: { required: true, maxLength: 255, label: 'Address' }
    };

    if (!isEditMode) {
        validators.password = {
            required: true,
            maxLength: 128,
            label: 'Password'
        };
    }

    return validators;
};

const sectionTone = {
    wrapper: 'bg-gray-50/70 border border-gray-100 rounded-xl p-4 sm:p-5',
    heading: 'text-sm font-bold text-[#002147]',
    description: 'text-xs text-gray-500 mt-1'
};

const FormSection = ({ title, description, children }) => (
    <section className={sectionTone.wrapper}>
        <h3 className={sectionTone.heading}>{title}</h3>
        {description && <p className={sectionTone.description}>{description}</p>}
        <div className="mt-4">{children}</div>
    </section>
);

export default function OwnerFormModal({ isOpen, onClose, onSuccess, ownerToEdit }) {
    const isEditMode = Boolean(ownerToEdit?.client_no);

    const { createRecord, isLoading: isCreating, error: createError, setError: setCreateError } = useCreate('/users/client/');
    const { updateRecord, isLoading: isUpdating, error: updateError, setError: setUpdateError } = useUpdate('/users/client');

    const isSaving = isCreating || isUpdating;
    const submitError = isEditMode ? updateError : createError;

    const { formData, errors, handleChange, validate, reset } = useForm(
        getInitialState(ownerToEdit),
        getOwnerValidators(isEditMode)
    );

    useEffect(() => {
        if (!isOpen) return;

        reset(getInitialState(ownerToEdit));
        setCreateError(null);
        setUpdateError(null);
    }, [isOpen, ownerToEdit?.client_no]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validate()) return;

        const payload = {
            first_name: formData.first_name.trim(),
            last_name: formData.last_name.trim(),
            email: formData.email.trim(),
            telephone_no: formData.telephone_no.trim(),
            address: formData.address.trim(),
            role: 'Owner'
        };

        if (!isEditMode) {
            payload.password = formData.password;
        }

        const result = isEditMode
            ? await updateRecord(ownerToEdit.client_no, payload, 'PATCH')
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
            title={isEditMode ? `Edit Property Owner - ${ownerToEdit.client_no}` : 'Add Property Owner'}
        >
            <form onSubmit={handleSubmit} className="space-y-5 max-h-[75vh] overflow-y-auto pr-1 pb-1 custom-scrollbar">
                {submitError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 sticky top-0 z-10">
                        {submitError}
                    </div>
                )}

                <FormSection
                    title="Owner Profile"
                    description="Capture core client details for a property owner account."
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                            label="First Name"
                            field="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            error={errors.first_name}
                            placeholder="e.g. Juan"
                        />
                        <FormField
                            label="Last Name"
                            field="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            error={errors.last_name}
                            placeholder="e.g. Dela Cruz"
                        />
                        <FormField
                            label="Email"
                            field="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            error={errors.email}
                            placeholder="owner@dreamhome.ph"
                        />
                        <FormField
                            label="Telephone"
                            field="telephone_no"
                            value={formData.telephone_no}
                            onChange={handleChange}
                            error={errors.telephone_no}
                            placeholder="09..."
                        />
                        <FormField
                            label="Address"
                            field="address"
                            value={formData.address}
                            onChange={handleChange}
                            error={errors.address}
                            placeholder="Full address"
                            className="sm:col-span-2"
                        />
                    </div>
                </FormSection>

                {!isEditMode && (
                    <FormSection
                        title="Account Security"
                        description="Password is required only when creating a new owner account."
                    >
                        <FormField
                            label="Password"
                            field="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            error={errors.password}
                            placeholder="Enter secure password"
                        />
                    </FormSection>
                )}

                <div className="flex justify-end gap-3 pt-2">
                    <Button type="button" variant="ghost" onClick={onClose} disabled={isSaving}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="primary" isLoading={isSaving}>
                        {isEditMode ? 'Update Owner' : 'Save Owner'}
                    </Button>
                </div>
            </form>
        </Dialog>
    );
}
