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

