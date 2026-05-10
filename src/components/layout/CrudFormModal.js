'use client';

import React from 'react';
import Dialog from '@/components/ui/Dialog'; 
import Button from '@/components/ui/Button'; 
import FormField from '@/components/ui/FormField'; // 👈 1. Added FormField import
import { useCreate, useUpdate } from '@/hooks/useCrud';

export default function CrudFormModal({
    isOpen,
    onClose,
    onSuccess,
    title,
    baseEndpoint,
    itemId,
    formData,
    validate,
    transformPayload = (data) => data,
    submitLabel = "Save",
    updateLabel = "Update",
    formClassName = "space-y-6 max-h-[75vh] overflow-y-auto px-2 pt-2 pb-6 custom-scrollbar",
    
    // 👈 2. New Props for Configuration-Driven Forms
    handleChange, 
    errors = {},  
    fields = [],  
    
    children // Retained for complex/custom layouts
}) {
    const isEditMode = Boolean(itemId);

    // API Hooks
    const { createRecord, isLoading: isCreating, error: createError } = useCreate(`${baseEndpoint}/`);
    const { updateRecord, isLoading: isUpdating, error: updateError } = useUpdate(baseEndpoint);

    const isSaving = isCreating || isUpdating;
    const submitError = isEditMode ? updateError : createError;

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // 1. Run validation
        if (validate && !validate()) return;

        // 2. Transform payload
        const payload = transformPayload({ ...formData });

        // 3. Execute API call
        const result = isEditMode 
            ? await updateRecord(itemId, payload)
            : await createRecord(payload);

        // 4. Handle success
        if (result.success) {
            onSuccess();
            onClose();
        }
    };

    return (
        <Dialog isOpen={isOpen} onClose={onClose} title={title}>
            <form onSubmit={handleSubmit} className={formClassName}>
                
                {/* Universal Error Display */}
                {submitError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 sticky top-0 z-10 animate-in fade-in zoom-in duration-200">
                        {submitError}
                    </div>
                )}

                {/* 👈 3. Auto-Generated Form Fields (Configuration-Driven) */}
                {fields.length > 0 && (
                    <div className="space-y-4">
                        {fields.map((config) => (
                            <FormField
                                key={config.field}
                                label={config.label}
                                field={config.field}
                                type={config.type || 'text'}
                                value={formData[config.field]}
                                onChange={handleChange}
                                error={errors[config.field]}
                                placeholder={config.placeholder}
                                required={config.required !== undefined ? config.required : true}
                                className={config.className}
                                {...config.extraProps}
                            >
                                {/* Handle Select Options if it's a dropdown */}
                                {config.options?.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </FormField>
                        ))}
                    </div>
                )}

                {/* Manual layout/fields passed as children (for complex nested forms like Staff) */}
                {children}

                {/* Universal Action Footer */}
                <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 mt-4">
                    <Button variant="ghost" onClick={onClose} type="button" disabled={isSaving}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="primary" isLoading={isSaving}>
                        {isEditMode ? updateLabel : submitLabel}
                    </Button>
                </div>
            </form>
        </Dialog>
    );
}