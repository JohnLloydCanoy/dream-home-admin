"use client";

import React, { useState, useEffect } from 'react';
import Button from '@components/ui/Button'; 
import Dialog from '@components/ui/Dialog';
import FormField from '@/components/ui/FormField'; 
import apiClient from '@/lib/apiClient';
import { useForm } from '@/hooks/useForm';
import { useCreate, useUpdate } from '@/hooks/useCrud';
import { branchValidators } from '@/lib/validator'; 

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

        const result = isEditMode 
            ? await updateRecord(branchToEdit.branch_no, payload)
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
            title={isEditMode ? `Edit Branch ${branchToEdit.branch_no}` : "Add New Branch"}
        >
            <form onSubmit={handleSubmit} className="space-y-8 max-h-[75vh] overflow-y-auto px-2 pt-2 pb-6 custom-scrollbar">
                
                {submitError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 sticky top-0 z-10 animate-in fade-in zoom-in duration-200">
                        {submitError}
                    </div>
                )}

                {/* --- SECTION 1: LOCATION DETAILS --- */}
                <section>
                    <h3 className="text-sm font-bold text-[#002147] border-b pb-2 mb-4 flex items-center gap-2">
                        <span className="bg-[#002147] text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]">1</span>
                        Location Details
                    </h3>
                    
                    <div className="space-y-5">
                        <FormField 
                            label="Street Address" 
                            field="street" 
                            value={formData.street} 
                            onChange={handleChange} 
                            error={errors.street} 
                            placeholder="e.g. C.M. Recto Avenue"
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField 
                                label="Barangay / Area" 
                                field="area" 
                                type="select"
                                value={formData.area} 
                                onChange={handleChange} 
                                error={errors.area}
                            >
                                <option value="">— Select Area —</option>
                                <option value="Carmen">Carmen</option>
                                <option value="Lapasan">Lapasan</option>
                                <option value="Macasandig">Macasandig</option>
                                <option value="Poblacion">Poblacion</option>
                                <option value="Lumbia">Lumbia</option>
                            </FormField>

                            <FormField 
                                label="City" 
                                field="city" 
                                value={formData.city} 
                                onChange={handleChange} 
                                error={errors.city} 
                                placeholder="Cagayan de Oro"
                            />
                        </div>

                        <FormField 
                            label="Postcode" 
                            field="postcode" 
                            value={formData.postcode} 
                            onChange={handleChange} 
                            error={errors.postcode} 
                            placeholder="9000"
                            className="w-1/2"
                        />
                    </div>
                </section>

                {/* --- SECTION 2: CONTACT & MANAGEMENT --- */}
                <section>
                    <h3 className="text-sm font-bold text-[#002147] border-b pb-2 mb-4 flex items-center gap-2">
                        <span className="bg-[#002147] text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]">2</span>
                        Contact & Management
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <FormField 
                            label="Telephone No." 
                            field="telephone_no" 
                            value={formData.telephone_no} 
                            onChange={handleChange} 
                            error={errors.telephone_no} 
                            placeholder="09..."
                        />
                        <FormField 
                            label="Fax No." 
                            field="fax_no" 
                            value={formData.fax_no} 
                            onChange={handleChange} 
                            required={false}
                            placeholder="Optional"
                        />
                    </div>

                    <div className="mt-5 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                        <FormField 
                            label="Branch Manager" 
                            field="manager" 
                            type="select"
                            value={formData.manager} 
                            onChange={handleChange}
                            required={false}
                            labelClass="text-blue-900"
                        >
                            <option value="">— Unassigned —</option>
                            {staffList.map(s => (
                                <option key={s.staff_no} value={s.staff_no}>
                                    {s.first_name} {s.last_name} ({s.staff_no})
                                </option>
                            ))}
                        </FormField>
                    </div>
                </section>

                {/* --- ACTIONS --- */}
                <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 mt-4">
                    <Button variant="ghost" onClick={onClose} type="button" disabled={isSaving}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="primary" isLoading={isSaving}>
                        {isEditMode ? "Update Branch" : "Save Branch"}
                    </Button>
                </div>
            </form>
        </Dialog>
    );
}