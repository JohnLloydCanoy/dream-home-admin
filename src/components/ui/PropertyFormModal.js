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
                {submitError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 sticky top-0 z-10 animate-in fade-in zoom-in duration-200">
                        {submitError}
                    </div>
                )}

                <section>
                    <h3 className="text-sm font-bold text-[#002147] border-b pb-2 mb-4 flex items-center gap-2">
                        <span className="bg-[#002147] text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]">1</span>
                        Property Details
                    </h3>

                    <div className="space-y-5">
                        <FormField
                            label="Street Address"
                            field="street"
                            value={formData.street}
                            onChange={handleChange}
                            error={errors.street}
                            placeholder="e.g. 12 Rosefield Drive"
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                label="Barangay / Area"
                                field="area"
                                value={formData.area}
                                onChange={handleChange}
                                required={false}
                                placeholder="Optional"
                            />

                            <FormField
                                label="City"
                                field="city"
                                value={formData.city}
                                onChange={handleChange}
                                error={errors.city}
                                placeholder="e.g. Glasgow"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                label="Postcode"
                                field="postcode"
                                value={formData.postcode}
                                onChange={handleChange}
                                error={errors.postcode}
                                placeholder="e.g. G1 2AB"
                            />

                            <FormField
                                label="Type"
                                field="property_type"
                                type="select"
                                value={formData.property_type}
                                onChange={handleChange}
                                error={errors.property_type}
                            >
                                <option value="">- Select Type -</option>
                                <option value="Flat">Flat</option>
                                <option value="House">House</option>
                            </FormField>
                        </div>
                    </div>
                </section>

                <section>
                    <h3 className="text-sm font-bold text-[#002147] border-b pb-2 mb-4 flex items-center gap-2">
                        <span className="bg-[#002147] text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]">2</span>
                        Rental Details
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            label="No. of Rooms"
                            field="no_of_rooms"
                            type="number"
                            value={formData.no_of_rooms}
                            onChange={handleChange}
                            error={errors.no_of_rooms}
                            placeholder="e.g. 3"
                        />

                        <FormField
                            label="Monthly Rent"
                            field="monthly_rent"
                            type="number"
                            value={formData.monthly_rent}
                            onChange={handleChange}
                            error={errors.monthly_rent}
                            placeholder="e.g. 850"
                        />

                        <FormField
                            label="Status"
                            field="status"
                            type="select"
                            value={formData.status}
                            onChange={handleChange}
                            error={errors.status}
                        >
                            <option value="Available">Available</option>
                            <option value="Rented">Rented</option>
                            <option value="Withdrawn">Withdrawn</option>
                        </FormField>

                        <FormField
                            label="Date Withdrawn"
                            field="date_withdrawn"
                            type="date"
                            value={formData.date_withdrawn}
                            onChange={handleChange}
                            required={false}
                        />
                    </div>
                </section>

                <section>
                    <h3 className="text-sm font-bold text-[#002147] border-b pb-2 mb-4 flex items-center gap-2">
                        <span className="bg-[#002147] text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]">3</span>
                        Assignment
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            label="Owner"
                            field="owner"
                            type="select"
                            value={formData.owner}
                            onChange={handleChange}
                            error={errors.owner}
                        >
                            <option value="">- Select Owner -</option>
                            {owners.map((owner) => (
                                <option key={owner.client_no} value={owner.client_no}>
                                    {owner.first_name} {owner.last_name} ({owner.client_no})
                                </option>
                            ))}
                        </FormField>

                        <FormField
                            label="Managed By"
                            field="staff"
                            type="select"
                            value={formData.staff}
                            onChange={handleChange}
                            required={false}
                        >
                            <option value="">- Unassigned -</option>
                            {staffList.map((staff) => (
                                <option key={staff.staff_no} value={staff.staff_no}>
                                    {staff.first_name} {staff.last_name} ({staff.staff_no})
                                </option>
                            ))}
                        </FormField>

                        <FormField
                            label="Branch"
                            field="branch"
                            type="select"
                            value={formData.branch}
                            onChange={handleChange}
                            error={errors.branch}
                            className="col-span-2"
                        >
                            <option value="">- Select Branch -</option>
                            {branches.map((branch) => (
                                <option key={branch.branch_no} value={branch.branch_no}>
                                    {branch.branch_no} - {branch.city}
                                </option>
                            ))}
                        </FormField>
                    </div>
                </section>

                <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 mt-4">
                    <Button variant="ghost" onClick={onClose} type="button" disabled={isSaving}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="primary" isLoading={isSaving}>
                        {isEditMode ? 'Update Property' : 'Save Property'}
                    </Button>
                </div>
            </form>
        </Dialog>
    );
}