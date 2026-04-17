"use client";

import React, { useEffect, useState } from 'react';
import Button from '@components/ui/Button';
import Dialog from '@components/ui/Dialog';
import FormField from '@/components/ui/FormField';
import apiClient from '@/lib/apiClient';
import { useForm } from '@/hooks/useForm';
import { useCreate, useUpdate } from '@/hooks/useCrud';

const normalizeList = (data) => data?.results || data?.items || data || [];

const toId = (value, idFields) => {
    if (!value) return '';
    if (typeof value !== 'object') return value;

    for (const key of idFields) {
        if (value[key]) return value[key];
    }

    return '';
};

const getViewingId = (viewing) => viewing?.id || viewing?.pk || viewing?.viewing_id || null;

const getInitialState = (viewing) => ({
    property: toId(viewing?.property, ['property_no', 'id']) || viewing?.property || '',
    client: toId(viewing?.client, ['client_no', 'id']) || toId(viewing?.renter, ['client_no', 'id']) || viewing?.client || '',
    viewing_date: viewing?.viewing_date || viewing?.view_date || '',
    viewing_time: viewing?.viewing_time || '',
    comments: viewing?.comments || ''
});

const viewingValidators = {
    property: { required: true, label: 'Property' },
    client: { required: true, label: 'Client' },
    viewing_date: { required: true, label: 'Viewing Date' },
    viewing_time: { required: true, label: 'Viewing Time' },
    comments: { required: true, maxLength: 2000, label: 'Comments' }
};

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

const getPropertyLabel = (property) => {
    const propertyId = property?.property_no || property?.id || 'N/A';
    const location = [property?.street, property?.city].filter(Boolean).join(', ');

    return location ? `${propertyId} - ${location}` : `${propertyId}`;
};

const getClientLabel = (client) => {
    const fullName = `${client?.first_name || ''} ${client?.last_name || ''}`.trim();
    const clientNo = client?.client_no || client?.id || 'N/A';
    return `${fullName || 'Unknown Client'} (${clientNo})`;
};

export default function ViewingFormModal({ isOpen, onClose, onSuccess, viewingToEdit }) {
    const isEditMode = Boolean(getViewingId(viewingToEdit));

    const [properties, setProperties] = useState([]);
    const [renterClients, setRenterClients] = useState([]);
    const [loadError, setLoadError] = useState('');

    const { createRecord, isLoading: isCreating, error: createError, setError: setCreateError } = useCreate('/properties/viewings/');
    const { updateRecord, isLoading: isUpdating, error: updateError, setError: setUpdateError } = useUpdate('/properties/viewings');

    const isSaving = isCreating || isUpdating;
    const submitError = isEditMode ? updateError : createError;

    const { formData, errors, handleChange, validate, reset } = useForm(
        getInitialState(viewingToEdit),
        viewingValidators
    );

    useEffect(() => {
        if (!isOpen) return;

        setLoadError('');

        const loadOptions = async () => {
            try {
                const [propertyData, clientData] = await Promise.all([
                    apiClient('/properties/'),
                    apiClient('/users/client/').catch(() => apiClient('/users/clients/'))
                ]);

                setProperties(normalizeList(propertyData));

                const renters = normalizeList(clientData).filter(
                    (client) => String(client?.role || '').toLowerCase() === 'renter'
                );
                setRenterClients(renters);
            } catch (error) {
                console.error('Failed to load viewing form options:', error);
                setLoadError('Unable to load properties and clients right now.');
            }
        };

        loadOptions();
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;

        reset(getInitialState(viewingToEdit));
        setCreateError(null);
        setUpdateError(null);
        setLoadError('');
    }, [isOpen, getViewingId(viewingToEdit)]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validate()) return;

        const payload = {
            property: formData.property,
            client: formData.client,
            viewing_date: formData.viewing_date,
            viewing_time: formData.viewing_time,
            comments: formData.comments.trim()
        };

        const result = isEditMode
            ? await updateRecord(getViewingId(viewingToEdit), payload, 'PATCH')
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
            title={isEditMode ? `Edit Viewing #${getViewingId(viewingToEdit)}` : 'Record New Viewing'}
        >
            <form onSubmit={handleSubmit} className="space-y-5 max-h-[75vh] overflow-y-auto pr-1 pb-1 custom-scrollbar">
                {(loadError || submitError) && (
                    <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 sticky top-0 z-10">
                        {loadError || submitError}
                    </div>
                )}

                <FormSection
                    title="Viewing Details"
                    description="Capture the property, renter client, and schedule details."
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                            label="Property"
                            field="property"
                            type="select"
                            value={formData.property}
                            onChange={handleChange}
                            error={errors.property}
                            className="sm:col-span-2"
                        >
                            <option value="">- Select Property -</option>
                            {properties.map((property) => (
                                <option key={property.property_no || property.id} value={property.property_no || property.id}>
                                    {getPropertyLabel(property)}
                                </option>
                            ))}
                        </FormField>

                        <FormField
                            label="Client (Renter)"
                            field="client"
                            type="select"
                            value={formData.client}
                            onChange={handleChange}
                            error={errors.client}
                            className="sm:col-span-2"
                        >
                            <option value="">- Select Renter Client -</option>
                            {renterClients.map((client) => (
                                <option key={client.client_no || client.id} value={client.client_no || client.id}>
                                    {getClientLabel(client)}
                                </option>
                            ))}
                        </FormField>

                        <FormField
                            label="Viewing Date"
                            field="viewing_date"
                            type="date"
                            value={formData.viewing_date}
                            onChange={handleChange}
                            error={errors.viewing_date}
                        />

                        <FormField
                            label="Viewing Time"
                            field="viewing_time"
                            type="time"
                            value={formData.viewing_time}
                            onChange={handleChange}
                            error={errors.viewing_time}
                        />
                    </div>
                </FormSection>

                <FormSection
                    title="Client Feedback"
                    description="Record client comments after the viewing."
                >
                    <FormField
                        label="Comments"
                        field="comments"
                        type="textarea"
                        value={formData.comments}
                        onChange={handleChange}
                        error={errors.comments}
                        placeholder="Enter client feedback, concerns, and level of interest."
                    />
                </FormSection>

                <div className="flex justify-end gap-3 pt-2">
                    <Button type="button" variant="ghost" onClick={onClose} disabled={isSaving}>
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
