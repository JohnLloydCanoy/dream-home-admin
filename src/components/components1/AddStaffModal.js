"use client";

import React, { useState, useEffect } from 'react';
import Button from '../../../global-components/ui/Button';
import Dialog from '../../../global-components/ui/Dialog';
import apiClient from '@/lib/apiClient';
import useForm from '@/hooks/useForm';
import { validateForm, staffValidators } from './validator';

const INITIAL_STAFF_DATA = {
    first_name: '',
    last_name: '',
    email: '',
    sex: '',
    dob: '',
    address: '',
    telephone_no: '',
    nin: '',
    position: '',
    salary: '',
    date_joined: '',
    branch: '',
    supervisor: ''
};

export default function AddStaffModal({ isOpen, onClose, onSuccess }) {
    const [submitError, setSubmitError] = useState('');
    const [branches, setBranches] = useState([]);
    const [staffList, setStaffList] = useState([]);

    useEffect(() => {
        if (isOpen) {
            const fetchData = async () => {
                try {
                    const [branchData, staffData] = await Promise.all([
                        apiClient('/branches/'),
                        apiClient('/users/staff/')
                    ]);
                    setBranches(branchData);
                    setStaffList(staffData.results || staffData);
                } catch (error) {
                    console.error("Failed to load options", error);
                }
            };
            fetchData();
        }
    }, [isOpen]);

    const { formData, errors, isSubmitting, handleChange, handleSubmit } = useForm({
        initialData: INITIAL_STAFF_DATA,
        validateFn: (data) => validateForm(data, staffValidators),
        onSubmit: async (data) => {
            setSubmitError('');
            try {
                // Ensure properly formatted nulls for foreign keys if empty
                const payload = { ...data };
                if (!payload.supervisor) payload.supervisor = null;

                await apiClient('/users/staff/', { method: 'POST', body: payload });
                onSuccess();
            } catch (error) {
                setSubmitError(error.message);
                throw error;
            }
        },
    });

    const FieldError = ({ field }) =>
        errors[field] ? <p className="text-red-500 text-xs mt-1">{errors[field]}</p> : null;

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            title="Register New Staff"
        >
            <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto px-1">

                {submitError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 sticky top-0 z-10">
                        {submitError}
                    </div>
                )}

                <div className="bg-blue-50 text-blue-800 text-xs p-2 rounded-lg mb-4">
                    <strong>Note:</strong> A user account will automatically be created for this staff member.
                    The default password is <strong>dreamhome2026</strong>.
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700 uppercase">First Name <span className="text-red-500">*</span></label>
                        <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} className={`w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 ${errors.first_name ? 'border-red-400' : 'border-gray-300'}`} placeholder="John" />
                        <FieldError field="first_name" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700 uppercase">Last Name <span className="text-red-500">*</span></label>
                        <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} className={`w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 ${errors.last_name ? 'border-red-400' : 'border-gray-300'}`} placeholder="Doe" />
                        <FieldError field="last_name" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700 uppercase">Email <span className="text-red-500">*</span></label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} className={`w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-400' : 'border-gray-300'}`} placeholder="john.doe@dreamhome.com" />
                        <FieldError field="email" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700 uppercase">Telephone <span className="text-red-500">*</span></label>
                        <input type="text" name="telephone_no" value={formData.telephone_no} onChange={handleChange} className={`w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 ${errors.telephone_no ? 'border-red-400' : 'border-gray-300'}`} placeholder="+44 20..." />
                        <FieldError field="telephone_no" />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 uppercase">Address <span className="text-red-500">*</span></label>
                    <input type="text" name="address" value={formData.address} onChange={handleChange} className={`w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 ${errors.address ? 'border-red-400' : 'border-gray-300'}`} placeholder="123 Example Street" />
                    <FieldError field="address" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700 uppercase">Gender <span className="text-red-500">*</span></label>
                        <select name="sex" value={formData.sex} onChange={handleChange} className={`w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white ${errors.sex ? 'border-red-400' : 'border-gray-300'}`}>
                            <option value="">— Select Gender —</option>
                            <option value="M">Male</option>
                            <option value="F">Female</option>
                            <option value="O">Other</option>
                            <option value="P">Prefer not to say</option>
                        </select>
                        <FieldError field="sex" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700 uppercase">Date of Birth <span className="text-red-500">*</span></label>
                        <input type="date" name="dob" value={formData.dob} onChange={handleChange} className={`w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 ${errors.dob ? 'border-red-400' : 'border-gray-300'}`} />
                        <FieldError field="dob" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700 uppercase">National Insurance No. <span className="text-red-500">*</span></label>
                        <input type="text" name="nin" value={formData.nin} onChange={handleChange} className={`w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 ${errors.nin ? 'border-red-400' : 'border-gray-300'}`} placeholder="AB123456C" />
                        <FieldError field="nin" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700 uppercase">Date Joined <span className="text-red-500">*</span></label>
                        <input type="date" name="date_joined" value={formData.date_joined} onChange={handleChange} className={`w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 ${errors.date_joined ? 'border-red-400' : 'border-gray-300'}`} />
                        <FieldError field="date_joined" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700 uppercase">Position <span className="text-red-500">*</span></label>
                        <input type="text" name="position" value={formData.position} onChange={handleChange} className={`w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 ${errors.position ? 'border-red-400' : 'border-gray-300'}`} placeholder="Manager" />
                        <FieldError field="position" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700 uppercase">Salary <span className="text-red-500">*</span></label>
                        <input type="number" step="0.01" name="salary" value={formData.salary} onChange={handleChange} className={`w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 ${errors.salary ? 'border-red-400' : 'border-gray-300'}`} placeholder="45000.00" />
                        <FieldError field="salary" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pb-4 border-b border-gray-100">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700 uppercase">Branch <span className="text-red-500">*</span></label>
                        <select name="branch" value={formData.branch} onChange={handleChange} className={`w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white ${errors.branch ? 'border-red-400' : 'border-gray-300'}`}>
                            <option value="">— Select Branch —</option>
                            {branches.map(b => (
                                <option key={b.branch_no} value={b.branch_no}>{b.branch_no} - {b.city}</option>
                            ))}
                        </select>
                        <FieldError field="branch" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700 uppercase">Supervisor</label>
                        <select name="supervisor" value={formData.supervisor} onChange={handleChange} className={`w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white ${errors.supervisor ? 'border-red-400' : 'border-gray-300'}`}>
                            <option value="">— None —</option>
                            {staffList.map(s => (
                                <option key={s.staff_no} value={s.staff_no}>{s.staff_no} - {s.first_name} {s.last_name}</option>
                            ))}
                        </select>
                        <FieldError field="supervisor" />
                    </div>
                </div>

                {/* Dialog Actions */}
                <div className="flex justify-end gap-3 pt-2">
                    <Button variant="ghost" onClick={onClose} type="button">
                        Cancel
                    </Button>
                    <Button type="submit" variant="primary" isLoading={isSubmitting}>
                        Save Staff
                    </Button>
                </div>
            </form>
        </Dialog>
    );
}
