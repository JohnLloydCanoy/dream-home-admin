'use client';

import React, { useEffect, useState } from 'react';
import apiClient from '@/lib/apiClient';
import FormField from '@/components/ui/FormField';
import Button from '@components/ui/Button';

const normalizeList = (data) => data?.results || data?.items || data || [];

const getAddressLabel = (property) => {
    const lines = [property?.street, property?.area, property?.city, property?.postcode].filter(Boolean);
    return lines.join(', ') || 'N/A';
};

/**
 * PropertyAssignmentModal
 *
 * A lightweight modal for updating the branch and owner of an existing property
 * via a PATCH request.  Intentionally does NOT allow editing other fields.
 *
 * Props:
 *   isOpen           – boolean
 *   onClose          – () => void
 *   onSuccess        – () => void  (called after a successful update)
 *   propertyToAssign – the property row object selected in the table
 */
export default function PropertyAssignmentModal({ isOpen, onClose, onSuccess, propertyToAssign }) {
    const [branches, setBranches] = useState([]);
    const [owners, setOwners] = useState([]);
    const [branchValue, setBranchValue] = useState('');
    const [ownerValue, setOwnerValue] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');

    // Load dropdown options when the modal opens
    useEffect(() => {
        if (!isOpen) return;

        Promise.all([
            apiClient('/branches/'),
            apiClient('/users/clients/?role=Owner')
        ])
            .then(([branchData, ownerData]) => {
                setBranches(normalizeList(branchData));
                setOwners(normalizeList(ownerData));
            })
            .catch((err) => console.error('Failed to load assignment options:', err));
    }, [isOpen]);

    // Seed form values whenever a different property is selected
    useEffect(() => {
        if (!propertyToAssign) return;
        const resolveBranch = (val) => {
            if (!val) return '';
            if (typeof val === 'object') return val.branch_no || '';
            return val;
        };
        const resolveOwner = (val) => {
            if (!val) return '';
            if (typeof val === 'object') return val.client_no || '';
            return val;
        };
        setBranchValue(resolveBranch(propertyToAssign.branch_no ?? propertyToAssign.branch));
        setOwnerValue(resolveOwner(propertyToAssign.owner_no ?? propertyToAssign.owner));
        setError('');
    }, [propertyToAssign]);

    const handleSave = async () => {
        if (!propertyToAssign) return;
        setIsSaving(true);
        setError('');

        try {
            await apiClient(`/properties/${propertyToAssign.property_no}/`, {
                method: 'PATCH',
                body: JSON.stringify({
                    branch_no: branchValue || null,
                    owner_no: ownerValue || null,
                }),
            });
            onSuccess?.();
            onClose();
        } catch (err) {
            console.error('Assignment save failed:', err);
            setError('Failed to save assignment. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 space-y-5">

                {/* Header */}
                <div>
                    <h2 className="text-lg font-bold text-gray-900">Edit Assignment</h2>
                    {propertyToAssign && (
                        <p className="text-xs text-gray-400 mt-0.5">
                            {propertyToAssign.property_no} — {getAddressLabel(propertyToAssign)}
                        </p>
                    )}
                </div>

                {/* Branch */}
                <FormField
                    label="Branch"
                    field="branch"
                    type="select"
                    value={branchValue}
                    onChange={(e) => setBranchValue(e.target.value)}
                    required={false}
                >
                    <option value="">— Unassigned —</option>
                    {branches.map((b) => (
                        <option key={b.branch_no} value={b.branch_no}>
                            {b.branch_no} - {b.city}
                        </option>
                    ))}
                </FormField>

                {/* Owner */}
                <FormField
                    label="Owner"
                    field="owner"
                    type="select"
                    value={ownerValue}
                    onChange={(e) => setOwnerValue(e.target.value)}
                    required={false}
                >
                    <option value="">— Unassigned —</option>
                    {owners.map((o) => (
                        <option key={o.client_no} value={o.client_no}>
                            {o.first_name} {o.last_name} ({o.client_no})
                        </option>
                    ))}
                </FormField>

                {/* Error */}
                {error && (
                    <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                        {error}
                    </p>
                )}

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-2">
                    <Button variant="secondary" onClick={onClose} disabled={isSaving}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSave} disabled={isSaving || !propertyToAssign}>
                        {isSaving ? 'Saving…' : 'Save Assignment'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
