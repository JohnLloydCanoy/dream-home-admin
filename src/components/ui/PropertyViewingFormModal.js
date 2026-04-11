"use client";

import React, { useEffect, useState } from 'react';
import Button from '@components/ui/Button';
import Dialog from '@components/ui/Dialog';
import FormField from '@/components/ui/FormField';
import apiClient from '@/lib/apiClient';
import { useForm } from '@/hooks/useForm';
import { useCreate, useUpdate } from '@/hooks/useCrud';
import { propertyViewingValidators } from '@/lib/validator';

const toId = (value, idField) => {
    if (!value) return '';
    if (typeof value === 'object') return value[idField] || '';
    return value;
};

const normalizeList = (data) => data?.results || data?.items || data || [];

const getInitialState = (viewing = null) => ({
    property: toId(viewing?.property, 'property_no'),
    renter: toId(viewing?.renter, 'client_no'),
    view_date: viewing?.view_date || '',
    comments: viewing?.comments || ''
});

export default function PropertyViewingFormModal({ isOpen, onClose, onSuccess, viewingToEdit }) {
    const isEditMode = Boolean(viewingToEdit);
    const [properties, setProperties] = useState([]);
    const [renters, setRenters] = useState([]);

    const { createRecord, isLoading: isCreating, error: createError } = useCreate('/properties/viewings/');
    const { updateRecord, isLoading: isUpdating, error: updateError } = useUpdate('/properties/viewings');

    const isSaving = isCreating || isUpdating;
    const submitError = isEditMode ? updateError : createError;

    const { formData, errors, handleChange, validate, reset } = useForm(
        getInitialState(viewingToEdit),
        propertyViewingValidators
    );

    useEffect(() => {
        if (!isOpen) return;

        Promise.all([
            apiClient('/properties/'),
            apiClient('/users/clients/')
        ])
            .then(([propertiesData, clientsData]) => {
                const allClients = normalizeList(clientsData);
                const renterList = allClients.filter(
                    (client) => String(client?.role || '').toLowerCase() === 'renter'
                );

                setProperties(normalizeList(propertiesData));
                setRenters(renterList);
            })
            .catch((error) => console.error('Failed to load viewing options:', error));
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            reset(getInitialState(viewingToEdit));
        }
    }, [viewingToEdit?.id, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        const payload = {
            ...formData,
            comments: formData.comments || null
        };

        const result = isEditMode
            ? await updateRecord(viewingToEdit.id, payload)
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
            title={isEditMode ? `Edit Viewing #${viewingToEdit.id}` : 'Schedule New Viewing'}
        >
            <form onSubmit={handleSubmit} className="space-y-8 max-h-[75vh] overflow-y-auto px-2 pt-2 pb-6 custom-scrollbar">
                {submitError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 sticky top-0 z-10 animate-in fade-in zoom-in duration-200">
                        {submitError}
                    </div>
                )}

                <section>
                    <h3 className="text-sm font-bold text-[#002147] border-b pb-2 mb-4 flex items-center gap-2">
                        <span className="bg-[#002147] text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]">1</span>
                        Viewing Details
                    </h3>

                    <div className="space-y-5">
                        <FormField
                            label="Property"
                            field="property"
                            type="select"
                            value={formData.property}
                            onChange={handleChange}
                            error={errors.property}
                        >
                            <option value="">- Select Property -</option>
                            {properties.map((property) => (
                                <option key={property.property_no} value={property.property_no}>
                                    {property.property_no} - {property.city}
                                </option>
                            ))}
                        </FormField>

                        <FormField
                            label="Renter"
                            field="renter"
                            type="select"
                            value={formData.renter}
                            onChange={handleChange}
                            error={errors.renter}
                        >
                            <option value="">- Select Renter -</option>
                            {renters.map((renter) => (
                                <option key={renter.client_no} value={renter.client_no}>
                                    {renter.first_name} {renter.last_name} ({renter.client_no})
                                </option>
                            ))}
                        </FormField>

                        <FormField
                            label="Viewing Date"
                            field="view_date"
                            type="date"
                            value={formData.view_date}
                            onChange={handleChange}
                            error={errors.view_date}
                        />

                        <FormField
                            label="Comments"
                            field="comments"
                            value={formData.comments}
                            onChange={handleChange}
                            required={false}
                            placeholder="Optional notes"
                        />
                    </div>
                </section>

                <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 mt-4">
                    <Button variant="ghost" onClick={onClose} type="button" disabled={isSaving}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="primary" isLoading={isSaving}>
                        {isEditMode ? 'Update Viewing' : 'Save Viewing'}
                    </Button>
                </div>
            </form>
        </Dialog>
    );
}