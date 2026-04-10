'use client';

import { useState } from 'react';
import { validateForm } from '@/lib/validator'; 

export function useForm(initialState = {}, validators) {
    // initialState is passed directly from the modal, so formData is never undefined
    const [formData, setFormData] = useState(initialState);
    const [errors, setErrors] = useState({});

    // Handles user typing and automatically clears the error for that specific field
    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }));
        }
    };

    // Runs your centralized validation engine
    const validate = () => {
        if (!validators) return true; 
        
        const validationErrors = validateForm(formData, validators);
        setErrors(validationErrors);
        
        return Object.keys(validationErrors).length === 0; 
    };

    // Resets the form when the modal opens/closes or switches between Add/Edit
    const reset = (newState) => {
        setFormData(newState || initialState);
        setErrors({});
    };

    return { formData, setFormData, handleChange, errors, validate, reset };
}