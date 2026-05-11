'use client';

import React, { useEffect } from 'react';
import CrudPageLayout from '@/components/layout/CrudPageLayout';
import CrudFormModal from '@/components/layout/CrudFormModal';
import MITrimmer from '@/components/functions/MITrimmer';
import FormField from '@/components/ui/FormField';
import { useForm } from '@/hooks/useForm';

const roleOptions = [
    { value: 'Renter', label: 'Renter' },
    { value: 'Owner', label: 'Owner' }
];

const getClientValidators = (isEditMode) => ({
    first_name: { required: true, maxLength: 100, label: 'First Name' },
    last_name: { required: true, maxLength: 100, label: 'Last Name' },
    middle_name: { maxLength: 100, label: 'Middle Name' },
    suffixes: { maxLength: 10, label: 'Suffix' },
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
    role: { required: true, maxLength: 20, label: 'Role' },
    password: { required: !isEditMode, maxLength: 128, label: 'Password' }
});

function ClientModal({ isOpen, onClose, onSuccess, itemToEdit }) {
    const isEditMode = Boolean(itemToEdit?.client_no);

    const { formData, errors, handleChange, validate, reset } = useForm({
        first_name: itemToEdit?.first_name || '',
        last_name: itemToEdit?.last_name || '',
        middle_name: itemToEdit?.middle_name || '',
        suffixes: itemToEdit?.suffixes || '',
        email: itemToEdit?.email || '',
        password: '',
        telephone_no: itemToEdit?.telephone_no || '',
        address: itemToEdit?.address || '',
        role: itemToEdit?.role || 'Renter'
    }, getClientValidators(isEditMode));

    useEffect(() => {
        if (isOpen) reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [itemToEdit?.client_no, isOpen]);

    const formatPayload = (data) => {
        const payload = { ...data };

        if (!payload.password) delete payload.password;
        if (!payload.middle_name) payload.middle_name = null;
        if (!payload.suffixes) payload.suffixes = null;
        if (!payload.address) payload.address = 'Unknown Address';
        if (!payload.role) payload.role = 'Renter';

        return payload;
    };

    return (
        <CrudFormModal
            isOpen={isOpen}
            onClose={onClose}
            onSuccess={onSuccess}
            title={isEditMode ? `Edit Client ${itemToEdit.client_no}` : 'Add New Client'}
            baseEndpoint="/users/clients"
            itemId={itemToEdit?.client_no}
            formData={formData}
            validate={validate}
            transformPayload={formatPayload}
            submitLabel="Save Client"
            updateLabel="Update Client"
        >
            <section>
                <h3 className="text-sm font-bold text-[#002147] border-b pb-2 mb-4">Client Details</h3>
                <div className="grid grid-cols-2 gap-4">
                    <FormField label="First Name" field="first_name" value={formData.first_name} onChange={handleChange} error={errors.first_name} />
                    <FormField label="Last Name" field="last_name" value={formData.last_name} onChange={handleChange} error={errors.last_name} />
                    <FormField label="Middle Name" field="middle_name" value={formData.middle_name} onChange={handleChange} error={errors.middle_name} required={false} />
                    <FormField label="Suffix" field="suffixes" value={formData.suffixes} onChange={handleChange} error={errors.suffixes} required={false} />
                    <FormField label="Role" field="role" type="select" value={formData.role} onChange={handleChange} error={errors.role}>
                        <option value="">-- Select Role --</option>
                        {roleOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </FormField>
                </div>
            </section>

            <section>
                <h3 className="text-sm font-bold text-[#002147] border-b pb-2 mb-4">Contact Details</h3>
                <div className="grid grid-cols-2 gap-4">
                    <FormField label="Email" field="email" type="email" value={formData.email} onChange={handleChange} error={errors.email} />
                    <FormField label="Telephone" field="telephone_no" value={formData.telephone_no} onChange={handleChange} error={errors.telephone_no} />
                    <FormField label="Address" field="address" value={formData.address} onChange={handleChange} error={errors.address} className="col-span-2" />
                    <FormField
                        label={isEditMode ? 'New Password' : 'Password'}
                        field="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        error={errors.password}
                        required={!isEditMode}
                        placeholder={isEditMode ? 'Leave blank to keep current password' : ''}
                        className="col-span-2"
                    />
                </div>
            </section>
        </CrudFormModal>
    );
}

export default function DashboardPage() {
    const tableColumns = [
        {
            key: 'client_no', label: 'Client ID',
            render: (val) => <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">{val}</span>
        },
        {
            key: 'name', label: 'Full Name',
            render: (val, row) => <span className="font-medium text-gray-900">{row.last_name}, {row.first_name} {MITrimmer(row.middle_name)}. {row.suffixes || ''}</span>
        },
        {
            key: 'email', label: 'Email',
            render: (val) => <span className="text-gray-700">{val}</span>
        },
        {
            key: 'telephone_no', label: 'Telephone',
            render: (val) => <span className="text-gray-700">{val || 'N/A'}</span>
        },
        {
            key: 'address', label: 'Address',
            render: (val) => <span className="text-gray-700">{val || 'N/A'}</span>
        },
        {
            key: 'role', label: 'Role',
            render: (val) => {
                const colors = {
                    'renter': 'bg-blue-100 text-blue-800',
                    'owner': 'bg-orange-100 text-orange-800',
                };
                const normalizedVal = val ? val.toLowerCase() : '';
                return (
                    <span
                        className={`px-2 py-1 rounded-full text-xs font-bold ${colors[normalizedVal] || 'bg-gray-100 text-gray-800'}`}
                    >
                        {val || 'N/A'}
                    </span>
                );
            }
        }
    ];

    return (
        <CrudPageLayout
            title="Clients Dashboard"
            subtitle="Manage DreamHome clients, both renters and owners."
            addButtonLabel="+ Add Client"
            endpoint="/users/clients/"
            keyField="client_no"
            columns={tableColumns}
            getDeleteModalItemName={(client) => `${client.first_name} ${client.last_name} (${client.role})`}
            renderFormModal={({ isOpen, onClose, onSuccess, itemToEdit }) => (
                <ClientModal
                    isOpen={isOpen}
                    onClose={onClose}
                    onSuccess={onSuccess}
                    itemToEdit={itemToEdit}
                />
            )}
        />
    );
}