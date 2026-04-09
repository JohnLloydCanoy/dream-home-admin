"use client";

import React, { useState, useEffect } from 'react';
import Button from '../../../global-components/ui/Button';
import Dialog from '../../../global-components/ui/Dialog';
import apiClient from '@/lib/apiClient';
import useForm from '@/hooks/useForm';
import { validateForm, branchValidators } from '../../lib/validator';
import { BARANGAY_CHOICES } from '../../components/constants';

export default function EditBranchModal({ isOpen, onClose, onSuccess, branch }) {
    const [submitError, setSubmitError] = useState('');

    const { formData, errors, isSubmitting, handleChange, handleSubmit, reset } = useForm({
        initialData: {
            street: branch?.street || '',
            area: branch?.area || '',
            city: branch?.city || '',
            postcode: branch?.postcode || '',
            telephone_no: branch?.telephone_no || '',
            fax_no: branch?.fax_no || '',
        },
        validateFn: (data) => validateForm(data, branchValidators),
        onSubmit: async (data) => {
            setSubmitError('');
            try {
                await apiClient(`/branches/${branch.branch_no}/`, { method: 'PUT', body: data });
                onSuccess();
            } catch (error) {
                setSubmitError(error.message);
                throw error;
            }
        },
    });

    // Sync form data when a different branch is selected
    useEffect(() => {
        if (branch && isOpen) {
            reset();
        }
    }, [branch?.branch_no, isOpen]);

    const FieldError = ({ field }) =>
        errors[field] ? <p className="text-red-500 text-xs mt-1">{errors[field]}</p> : null;

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            title={`Edit Branch ${branch?.branch_no || ''}`}
        >
            <form onSubmit={handleSubmit} className="space-y-4">

                {submitError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
                        {submitError}
                    </div>
                )}

                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 uppercase">Street Address <span className="text-red-500">*</span></label>
                    <input type="text" name="street" value={formData.street} onChange={handleChange} className={`w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 ${errors.street ? 'border-red-400' : 'border-gray-300'}`} placeholder="123 Main St" />
                    <FieldError field="street" />
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 uppercase">Area</label>
                    <select name="area" value={formData.area} onChange={handleChange} className={`w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white ${errors.area ? 'border-red-400' : 'border-gray-300'}`}>
                        <option value="">— Select Area (Optional) —</option>
                        {BARANGAY_CHOICES.map((b) => (
                            <option key={b.value} value={b.value}>{b.label}</option>
                        ))}
                    </select>
                    <FieldError field="area" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700 uppercase">City <span className="text-red-500">*</span></label>
                        <input type="text" name="city" value={formData.city} onChange={handleChange} className={`w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 ${errors.city ? 'border-red-400' : 'border-gray-300'}`} placeholder="Manila" />
                        <FieldError field="city" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700 uppercase">Postal Code <span className="text-red-500">*</span></label>
                        <input type="text" name="postcode" value={formData.postcode} onChange={handleChange} className={`w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 ${errors.postcode ? 'border-red-400' : 'border-gray-300'}`} placeholder="1000" />
                        <FieldError field="postcode" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pb-4 border-b border-gray-100">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700 uppercase">Telephone <span className="text-red-500">*</span></label>
                        <input type="text" name="telephone_no" value={formData.telephone_no} onChange={handleChange} className={`w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 ${errors.telephone_no ? 'border-red-400' : 'border-gray-300'}`} placeholder="+63 2..." />
                        <FieldError field="telephone_no" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700 uppercase">Fax No</label>
                        <input type="text" name="fax_no" value={formData.fax_no} onChange={handleChange} className={`w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 ${errors.fax_no ? 'border-red-400' : 'border-gray-300'}`} placeholder="(Optional)" />
                        <FieldError field="fax_no" />
                    </div>
                </div>

                {/* Dialog Actions */}
                <div className="flex justify-end gap-3 pt-2">
                    <Button variant="ghost" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="primary" isLoading={isSubmitting}>
                        Update Branch
                    </Button>
                </div>
            </form>
        </Dialog>
    );
}
