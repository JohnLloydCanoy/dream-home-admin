"use client";

import React, { useState, useEffect } from 'react';
import Button from '../../../global-components/ui/Button';
import Dialog from '../../../global-components/ui/Dialog';
import apiClient from '@/lib/apiClient';
import { useForm } from '@/hooks/useForm';
import { useUpdate } from '@/hooks/useCrud'; // 🌟 Import the update hook
import { validateForm, staffValidators } from './validator';

export default function EditStaffModal({ isOpen, onClose, onSuccess, staff }) {
    const [branches, setBranches] = useState([]);
    const [staffList, setStaffList] = useState([]);

    // 🌟 Initialize the useUpdate hook with the base endpoint
    const { updateRecord, isLoading: isSubmitting, error: submitError } = useUpdate('/users/staff');

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

    const { formData, errors, handleChange, handleSubmit, reset, validate } = useForm({
        initialData: {
            first_name: staff?.first_name || '',
            last_name: staff?.last_name || '',
            email: staff?.email || '',
            sex: staff?.sex || '',
            dob: staff?.dob || '',
            address: staff?.address || '',
            telephone_no: staff?.telephone_no || '',
            nin: staff?.nin || '',
            position: staff?.position || '',
            salary: staff?.salary || '',
            date_joined: staff?.date_joined || '',
            branch: (typeof staff?.branch === 'object' ? staff.branch?.branch_no : staff?.branch) || '',
            supervisor: (typeof staff?.supervisor === 'object' ? staff.supervisor?.staff_no : staff?.supervisor) || ''
        },
        validateFn: (data) => validateForm(data, staffValidators),
        onSubmit: async (data) => {
            // 🌟 Use the centralized update function!
            const payload = { ...data };
            if (!payload.supervisor) payload.supervisor = null;

            const result = await updateRecord(staff.staff_no, payload);
            
            if (result.success) {
                onSuccess();
                onClose(); // Automatically close on success
            }
        },
    });

    useEffect(() => {
        if (staff && isOpen) {
            reset();
        }
    }, [staff?.staff_no, isOpen]);

    const FieldError = ({ field }) =>
        errors[field] ? <p className="text-red-500 text-xs mt-1">{errors[field]}</p> : null;

    return (
        <Dialog isOpen={isOpen} onClose={onClose} title={`Edit Staff ${staff?.staff_no || ''}`}>
            <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto px-1">

                {/* 🌟 Error handling is now powered by useUpdate's state */}
                {submitError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 sticky top-0 z-10">
                        {submitError}
                    </div>
                )}

                {/* ... YOUR EXISTING INPUT FIELDS STAY EXACTLY THE SAME HERE ... */}
                {/* (I omitted them here for brevity, keep all your grid cols and inputs!) */}

                <div className="flex justify-end gap-3 pt-2">
                    <Button variant="ghost" onClick={onClose} type="button">
                        Cancel
                    </Button>
                    <Button type="submit" variant="primary" isLoading={isSubmitting}>
                        Update Staff
                    </Button>
                </div>
            </form>
        </Dialog>
    );
}