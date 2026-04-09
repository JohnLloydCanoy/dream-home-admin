"use client";

import React, { useState } from 'react';
import Button from '../../../global-components/ui/Button';
import Dialog from '../../../global-components/ui/Dialog';
import apiClient from '@/lib/apiClient';

export default function DeleteBranchModal({ isOpen, onClose, onSuccess, branch }) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState('');

    const handleDelete = async () => {
        setIsDeleting(true);
        setError('');

        try {
            await apiClient(`/branches/${branch.branch_no}/`, { method: 'DELETE' });
            onSuccess();
        } catch (err) {
            setError(err.message);
        } finally {
            setIsDeleting(false);
        }
    };

    if (!branch) return null;

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            title="Delete Branch"
        >
            <div className="space-y-4">

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
                        {error}
                    </div>
                )}

                {/* Warning message */}
                <div className="bg-red-50 border border-red-100 rounded-lg p-4">
                    <div className="flex gap-3">
                        <div className="shrink-0 mt-0.5">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-red-800">This action cannot be undone.</h4>
                            <p className="text-sm text-red-700 mt-1">
                                Are you sure you want to delete branch <strong className="font-bold">#{branch.branch_no}</strong> located at{' '}
                                <strong className="font-bold">{branch.street}, {branch.city}</strong>?
                            </p>
                            <p className="text-xs text-red-500 mt-2">
                                All associated data for this branch may also be affected.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Confirmation details */}
                <div className="bg-gray-50 rounded-lg p-3 text-sm space-y-1">
                    <div className="flex justify-between">
                        <span className="text-gray-500">Branch No.</span>
                        <span className="font-bold text-gray-800">{branch.branch_no}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">Address</span>
                        <span className="font-medium text-gray-800">{branch.street}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">City</span>
                        <span className="font-medium text-gray-800">{branch.city}, {branch.postcode}</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                    <Button variant="ghost" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDelete} isLoading={isDeleting}>
                        Delete Branch
                    </Button>
                </div>
            </div>
        </Dialog>
    );
}
