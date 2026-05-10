'use client';

import React, { useState, useEffect } from 'react';
import FormField from '@/components/ui/FormField'; 
import CrudFormModal from '@/components/ui/CrudFormModal'; // Adjust path
import apiClient from '@/lib/apiClient';
import { useForm } from '@/hooks/useForm';
import { branchValidators } from '@/lib/validator'; 

export default function BranchFormModal({ isOpen, onClose, onSuccess, branchToEdit }) {
    const [staffList, setStaffList] = useState([]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [branchToEdit?.branch_no, isOpen]);

    // Format data before sending to the API
    const formatPayload = (data) => {
        if (!data.manager) data.manager = null;
        if (!data.fax_no) data.fax_no = null;
        return data;
    };

    return (
        <CrudFormModal
            isOpen={isOpen}
            onClose={onClose}
            onSuccess={onSuccess}
            title={branchToEdit ? `Edit Branch ${branchToEdit.branch_no}` : "Add New Branch"}
            baseEndpoint="/branches"
            itemId={branchToEdit?.branch_no}
            formData={formData}
            validate={validate}
            transformPayload={formatPayload}
            submitLabel="Save Branch"
            updateLabel="Update Branch"
            formClassName="space-y-8 max-h-[75vh] overflow-y-auto px-2 pt-2 pb-6 custom-scrollbar"
        >
            {/* --- SECTION 1: LOCATION DETAILS --- */}
            <section>
                <h3 className="text-sm font-bold text-[#002147] border-b pb-2 mb-4 flex items-center gap-2">
                    <span className="bg-[#002147] text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]">1</span>
                    Location Details
                </h3>
                <div className="space-y-5">
                    <FormField label="Street Address" field="street" value={formData.street} onChange={handleChange} error={errors.street} placeholder="e.g. C.M. Recto Avenue" />
                    <div className="grid grid-cols-2 gap-4">
                        <FormField label="Barangay / Area" field="area" type="select" value={formData.area} onChange={handleChange} error={errors.area}>
                            <option value="">— Select Area —</option> {/* Later add a loop */ }
                            <option value="Carmen">Carmen</option>
                            <option value="Lapasan">Lapasan</option>
                            <option value="Macasandig">Macasandig</option>
                            <option value="Poblacion">Poblacion</option>
                            <option value="Lumbia">Lumbia</option>
                        </FormField>
                        <FormField label="City" field="city" value={formData.city} onChange={handleChange} error={errors.city} placeholder="Cagayan de Oro" />
                    </div>
                    <FormField label="Postcode" field="postcode" value={formData.postcode} onChange={handleChange} error={errors.postcode} placeholder="9000" className="w-1/2" />
                </div>
            </section>

            {/* --- SECTION 2: CONTACT & MANAGEMENT --- */}
            <section>
                <h3 className="text-sm font-bold text-[#002147] border-b pb-2 mb-4 flex items-center gap-2">
                    <span className="bg-[#002147] text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]">2</span>
                    Contact & Management
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    <FormField label="Telephone No." field="telephone_no" value={formData.telephone_no} onChange={handleChange} error={errors.telephone_no} placeholder="09..." />
                    <FormField label="Fax No." field="fax_no" value={formData.fax_no} onChange={handleChange} required={false} placeholder="Optional" />
                </div>
                <div className="mt-5 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                    <FormField label="Branch Manager" field="manager" type="select" value={formData.manager} onChange={handleChange} required={false} labelClass="text-blue-900">
                        <option value="">— Unassigned —</option>
                        {staffList.map(s => (
                            <option key={s.staff_no} value={s.staff_no}>
                                {s.first_name} {s.last_name} ({s.staff_no})
                            </option>
                        ))}
                    </FormField>
                </div>
            </section>
        </CrudFormModal>
    );
}