import React from 'react';
import Dialog from '@components/ui/Dialog';
import Button from '@components/ui/Button'; 
import { useDelete } from '@/hooks/useCrud';

export default function ConfirmDeleteModal({ isOpen, onClose, onSuccess, endpoint, idToDelete, itemName }) {
    const { deleteRecord, isLoading, error } = useDelete(endpoint);

    const handleDelete = async () => {
        const result = await deleteRecord(idToDelete);
        if (result.success) {
            onSuccess();
            onClose();
        }
    };

    if (!idToDelete) return null;

    return (
        <Dialog isOpen={isOpen} onClose={onClose} title="Confirm Deletion">
            <div className="p-4">
                <p className="text-gray-700 mb-8">Are you sure you want to delete <strong>{itemName}</strong>?</p>
                <Button variant="danger" onClick={handleDelete} isLoading={isLoading}>
                    Delete
                </Button>
                <Button variant="ghost" onClick={onClose}>
                    Cancel
                </Button>
            </div>
        </Dialog>
    );
}