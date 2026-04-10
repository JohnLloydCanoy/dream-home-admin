"use client";

import React, { useState, useEffect } from 'react';
import Button from '../../../global-components/ui/Button';
import Dialog from '../../../global-components/ui/Dialog';
import apiClient from '@/lib/apiClient';
import { useForm } from '@/hooks/useForm'; // Ensure this matches your export
import { useCreate } from '@/hooks/useCrud'; // 🌟 Import your new hook
import { validateForm, staffValidators } from './validator';

const INITIAL_STAFF_DATA = {
    first_name: '', last_name: '', email: '', sex: '', dob: '', 
    address: '', telephone_no: '', nin: '', position: '', 
    salary: '', date_joined: '', branch: '', supervisor: ''
};

export default function AddStaffModal({ isOpen, onClose, onSuccess }) {
    const [branches, setBranches] = useState([]);
    const [staffList, setStaffList] = useState([]);

    // 🌟 Initialize the useCreate hook for the /users/staff/ endpoint
    const { createRecord, isLoading: isSubmitting, error: submitError } = useCreate('/users/staff/');

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

    // Setup useForm for validation and state management
    const { formData, errors, handleChange, validate } = useForm(INITIAL_STAFF_DATA, staffValidators);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // 1. Run frontend validation
        if (!validate()) return;

        // 2. Format payload (handle empty supervisor)
        const payload = { ...formData };
        if (!payload.supervisor) payload.supervisor = null;

        // 🌟 3. Use the centralized create function
        const result = await createRecord(payload);
        
        if (result.success) {
            onSuccess(); // Refresh table
            onClose();   // Close modal
        }
    };

    const FieldError = ({ field }) =>
        errors[field] ? <p className="text-red-500 text-xs mt-1">{errors[field]}</p> : null;

    return (
        <Dialog isOpen={isOpen} onClose={onClose} title="Register New Staff">
            {/* The rest of your JSX form stays EXACTLY the same! */}
            <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
                
                {/* Error handling is now powered by useCreate's 'submitError' state */}
                {submitError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 sticky top-0 z-10">
                        {submitError}
                    </div>
                )}
                
                {/* ... all your inputs ... */}
                
                <div className="flex justify-end gap-3 pt-2">
                    <Button variant="ghost" onClick={onClose} type="button">Cancel</Button>
                    <Button type="submit" variant="primary" isLoading={isSubmitting}>Save Staff</Button>
                </div>
            </form>
        </Dialog>
    );
}