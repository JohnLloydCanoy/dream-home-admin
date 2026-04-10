"use client";

import React, { useState, useEffect } from 'react';
import Button from '@components/ui/Button'; 
import Dialog from '@components/ui/Dialog';
import apiClient from '@/lib/apiClient';
import { useForm } from '@/hooks/useForm';
import { useCreate, useUpdate } from '@/hooks/useCrud';
import { validateForm, branchValidators } from '@/lib/validator'; 

export default function BranchFormModal({ isOpen, onClose, onSuccess, branchToEdit }) {
    const isEditMode = Boolean(branchToEdit);
    const [staffList, setStaffList] = useState([]);


    const { createRecord, isLoading: isCreating, error: createError } = useCreate('/branches/');
    const { updateRecord, isLoading: isUpdating, error: updateError } = useUpdate('/branches');

    const isSaving = isCreating || isUpdating;
    const submitError = isEditMode ? updateError : createError;


    useEffect(() => {
        if (isOpen) {
            apiClient('/users/staff/')
                .then(data => setStaffList(data.results || data))
                .catch(err => console.error("Failed to load staff:", err));
        }
    }, [isOpen]);

    const { formData, errors, handleChange, validate, reset } = useForm({
        street: branchToEdit?.street || '',
        area: branchToEdit?.area || '',
        city: branchToEdit?.city || '',
        postcode: branchToEdit?.postcode || '',
        telephone_no: branchToEdit?.telephone_no || '',
        fax_no: branchToEdit?.fax_no || '',
        manager: (typeof branchToEdit?.manager === 'object' ? branchToEdit.manager?.staff_no : branchToEdit?.manager) || ''
    }, branchValidators);

    useEffect(() => {
        if (isOpen) reset();
    }, [branchToEdit?.branch_no, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        const payload = { ...formData };
        if (!payload.manager) payload.manager = null;
        if (!payload.fax_no) payload.fax_no = null;

        let result;
        if (isEditMode) {
            result = await updateRecord(branchToEdit.branch_no, payload);
        } else {
            result = await createRecord(payload);
        }

        if (result.success) {
            onSuccess();
            onClose();
        }
    };

    const FieldError = ({ field }) => errors[field] ? <p className="text-red-500 text-xs mt-1">{errors[field]}</p> : null;

    return (
        <Dialog 
            isOpen={isOpen} 
            onClose={onClose} 
            title={isEditMode ? `Edit Branch ${branchToEdit.branch_no}` : "Add New Branch"}
        >
            <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
                {submitError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 sticky top-0 z-10">
                        {submitError}
                    </div>
                )}

                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 uppercase">Street Address *</label>
                    <input type="text" value={formData.street} onChange={(e) => handleChange('street', e.target.value)} className={`w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 ${errors.street ? 'border-red-400' : 'border-gray-300'}`} placeholder="C.M. Recto Avenue" />
                    <FieldError field="street" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700 uppercase">Barangay / Area *</label>
                        <select value={formData.area} onChange={(e) => handleChange('area', e.target.value)} className={`w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white ${errors.area ? 'border-red-400' : 'border-gray-300'}`}>
                            <option value="">— Select Area —</option>
                            <option value="Carmen">Carmen</option>
                            <option value="Lapasan">Lapasan</option>
                            <option value="Macasandig">Macasandig</option>
                            <option value="Poblacion">Poblacion</option>
                            <option value="Lumbia">Lumbia</option>
                        </select>
                        <FieldError field="area" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700 uppercase">City *</label>
                        <input type="text" value={formData.city} onChange={(e) => handleChange('city', e.target.value)} className={`w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 ${errors.city ? 'border-red-400' : 'border-gray-300'}`} placeholder="Cagayan de Oro" />
                        <FieldError field="city" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700 uppercase">Postcode *</label>
                        <input type="text" value={formData.postcode} onChange={(e) => handleChange('postcode', e.target.value)} className={`w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 ${errors.postcode ? 'border-red-400' : 'border-gray-300'}`} placeholder="9000" />
                        <FieldError field="postcode" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700 uppercase">Telephone No. *</label>
                        <input type="text" value={formData.telephone_no} onChange={(e) => handleChange('telephone_no', e.target.value)} className={`w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 ${errors.telephone_no ? 'border-red-400' : 'border-gray-300'}`} />
                        <FieldError field="telephone_no" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700 uppercase">Fax No.</label>
                        <input type="text" value={formData.fax_no} onChange={(e) => handleChange('fax_no', e.target.value)} className="w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700 uppercase">Branch Manager</label>
                        <select value={formData.manager} onChange={(e) => handleChange('manager', e.target.value)} className="w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                            <option value="">— Unassigned —</option>
                            {staffList.map(s => (
                                <option key={s.staff_no} value={s.staff_no}>{s.first_name} {s.last_name} ({s.staff_no})</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                    <Button variant="ghost" onClick={onClose} type="button" disabled={isSaving}>Cancel</Button>
                    <Button type="submit" variant="primary" isLoading={isSaving}>
                        {isEditMode ? "Update Branch" : "Save New Branch"}
                    </Button>
                </div>
            </form>
        </Dialog>
    );
}