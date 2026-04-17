"use client";

import React, { useEffect } from 'react';
import Button from '@components/ui/Button';
import Dialog from '@components/ui/Dialog';
import FormField from '@/components/ui/FormField';
import { useForm } from '@/hooks/useForm';
import { useCreate, useUpdate } from '@/hooks/useCrud';

const getPreference = (renter, field) => {
    if (renter?.[field] !== undefined && renter?.[field] !== null) return renter[field];
    if (renter?.renter_requirements?.[field] !== undefined && renter?.renter_requirements?.[field] !== null) {
        return renter.renter_requirements[field];
    }
    return '';
};

const getInitialState = (renter) => ({
    first_name: renter?.first_name || '',
    last_name: renter?.last_name || '',
    email: renter?.email || '',
    telephone_no: renter?.telephone_no || '',
    address: renter?.address || '',
    pref_property_type: getPreference(renter, 'pref_property_type') || '',
    max_monthly_rent: getPreference(renter, 'max_monthly_rent') || '',
    general_comments: getPreference(renter, 'general_comments') || '',
    password: ''
});

const getRenterValidators = (isEditMode) => {
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
        address: { required: true, maxLength: 255, label: 'Address' },
        pref_property_type: { required: true, label: 'Preferred Property Type' },
        max_monthly_rent: {
            required: true,
            label: 'Maximum Monthly Rent',
            pattern: /^\d+(\.\d{1,2})?$/,
            patternMessage: 'Enter a valid rent amount'
        },
        general_comments: { required: false, maxLength: 2000, label: 'General Comments' }
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

export default function RenterFormModal({ isOpen, onClose, onSuccess, renterToEdit }) {
    const isEditMode = Boolean(renterToEdit?.client_no);

    const { createRecord, isLoading: isCreating, error: createError, setError: setCreateError } = useCreate('/users/client/');
    const { updateRecord, isLoading: isUpdating, error: updateError, setError: setUpdateError } = useUpdate('/users/client');

    const isSaving = isCreating || isUpdating;
    const submitError = isEditMode ? updateError : createError;

    const { formData, errors, handleChange, validate, reset } = useForm(
        getInitialState(renterToEdit),
        getRenterValidators(isEditMode)
    );

    useEffect(() => {
        if (!isOpen) return;

        reset(getInitialState(renterToEdit));
        setCreateError(null);
        setUpdateError(null);
    }, [isOpen, renterToEdit?.client_no]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validate()) return;

        const payload = {
            first_name: formData.first_name.trim(),
            last_name: formData.last_name.trim(),
            email: formData.email.trim(),
            telephone_no: formData.telephone_no.trim(),
            address: formData.address.trim(),
            role: 'Renter',
            pref_property_type: formData.pref_property_type || null,
            max_monthly_rent: formData.max_monthly_rent ? Number(formData.max_monthly_rent) : null,
            general_comments: formData.general_comments.trim() || null
        };

        if (!isEditMode) {
            payload.password = formData.password;
        }

        const result = isEditMode
            ? await updateRecord(renterToEdit.client_no, payload, 'PATCH')
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
            title={isEditMode ? `Edit Renter - ${renterToEdit.client_no}` : 'Add New Renter'}
        >
            <form onSubmit={handleSubmit} className="space-y-5 max-h-[75vh] overflow-y-auto pr-1 pb-1 custom-scrollbar">
                {submitError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 sticky top-0 z-10">
                        {submitError}
                    </div>
                )}

                <FormSection
                    title="Core Details"
                    description="Capture primary renter profile details used for account and contact management."
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                            label="First Name"
                            field="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            error={errors.first_name}
                            placeholder="e.g. Maria"
                        />
                        <FormField
                            label="Last Name"
                            field="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            error={errors.last_name}
                            placeholder="e.g. Santos"
                        />
                        <FormField
                            label="Email"
                            field="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            error={errors.email}
                            placeholder="renter@dreamhome.ph"
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

                <FormSection
                    title="Property Preferences"
                    description="Store requirements used to match renters with suitable property listings."
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                            label="Preferred Property Type"
                            field="pref_property_type"
                            type="select"
                            value={formData.pref_property_type}
                            onChange={handleChange}
                            error={errors.pref_property_type}
                        >
                            <option value="">- Select Preference -</option>
                            <option value="House">House</option>
                            <option value="Flat">Flat</option>
                        </FormField>
                        <FormField
                            label="Maximum Monthly Rent"
                            field="max_monthly_rent"
                            type="number"
                            value={formData.max_monthly_rent}
                            onChange={handleChange}
                            error={errors.max_monthly_rent}
                            placeholder="e.g. 25000"
                        />
                        <FormField
                            label="General Comments"
                            field="general_comments"
                            type="textarea"
                            value={formData.general_comments}
                            onChange={handleChange}
                            error={errors.general_comments}
                            required={false}
                            className="sm:col-span-2"
                            placeholder="Special requirements, preferred locations, accessibility needs, and notes."
                        />
                    </div>
                </FormSection>

                {!isEditMode && (
                    <FormSection
                        title="Account Security"
                        description="Password is required only when creating a new renter account."
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
                        {isEditMode ? 'Update Renter' : 'Save Renter'}
                    </Button>
                </div>
            </form>
        </Dialog>
    );
}
