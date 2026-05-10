"use client";

import React, { useEffect, useState } from 'react';
import Button from '@components/ui/Button';
import Dialog from '@components/ui/Dialog';
import FormField from '@/components/ui/FormField';
import apiClient from '@/lib/apiClient';
import { useForm } from '@/hooks/useForm';
import { useCreate, useUpdate } from '@/hooks/useCrud';
import { propertyValidators } from '@/lib/validator';

const toId = (value, idField) => {
    if (!value) return '';
    if (typeof value === 'object') return value[idField] || '';
    return value;
};

const getInitialState = (property = null) => ({
    street: property?.street || '',
    area: property?.area || '',
    city: property?.city || '',
    postcode: property?.postcode || '',
    property_type: property?.property_type || '',
    no_of_rooms: property?.no_of_rooms || '',
    monthly_rent: property?.monthly_rent || '',
    status: property?.status || 'Available',
    owner: toId(property?.owner, 'client_no'),
    staff: toId(property?.staff, 'staff_no'),
    branch: toId(property?.branch, 'branch_no'),
    date_withdrawn: property?.date_withdrawn || ''
});

const normalizeList = (data) => data?.results || data?.items || data || [];

export default function PropertyFormModal({ isOpen, onClose, onSuccess, propertyToEdit }) {
    const isEditMode = Boolean(propertyToEdit);
    const [owners, setOwners] = useState([]);
    const [staffList, setStaffList] = useState([]);
    const [branches, setBranches] = useState([]);

    const { createRecord, isLoading: isCreating, error: createError } = useCreate('/properties/');
    const { updateRecord, isLoading: isUpdating, error: updateError } = useUpdate('/properties');

    const isSaving = isCreating || isUpdating;
    const submitError = isEditMode ? updateError : createError;

    const { formData, errors, handleChange, validate, reset } = useForm(
        getInitialState(propertyToEdit),
        propertyValidators
    );

    useEffect(() => {
        if (!isOpen) return;

        Promise.all([
            apiClient('/users/clients/'),
            apiClient('/users/staff/'),
            apiClient('/branches/')
        ])
            .then(([ownersData, staffData, branchesData]) => {
                const ownerList = normalizeList(ownersData).filter(
                    (client) => String(client?.role || '').toLowerCase() === 'owner'
                );

                setOwners(ownerList);
                setStaffList(normalizeList(staffData));
                setBranches(normalizeList(branchesData));
            })
            .catch((error) => console.error('Failed to load property form options:', error));
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            reset(getInitialState(propertyToEdit));
        }
    }, [propertyToEdit?.property_no, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        const payload = {
            ...formData,
            area: formData.area || null,
            no_of_rooms: Number(formData.no_of_rooms),
            staff: formData.staff || null,
            date_withdrawn: formData.status === 'Withdrawn' ? (formData.date_withdrawn || null) : null
        };

        const result = isEditMode
            ? await updateRecord(propertyToEdit.property_no, payload)
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
            title={isEditMode ? `Edit Property ${propertyToEdit.property_no}` : 'Add New Property'}
        >
            <form onSubmit={handleSubmit} className="space-y-8 max-h-[75vh] overflow-y-auto px-2 pt-2 pb-6 custom-scrollbar">
    