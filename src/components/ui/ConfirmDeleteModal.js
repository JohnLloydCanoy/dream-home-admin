import React from 'react';
import Dialog from './Dialog';
import Button from './Button';
import { useDelete } from '@/hooks/useCrud';

export default function ConfirmDeleteModal({ isOpen, onClose, onSuccess, endpoint, idToDelete, itemName }) {
    // It dynamically takes whatever endpoint you pass it!
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
                <p>Are you sure you want to delete <strong>{itemName}</strong>?</p>
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