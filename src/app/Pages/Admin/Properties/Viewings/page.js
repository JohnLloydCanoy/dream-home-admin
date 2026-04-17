'use client';

import React, { useEffect, useState } from 'react';
import DataTable from '@/components/ui/DataTable';
import Button from '@components/ui/Button';
import ConfirmDeleteModal from '@/components/ui/ConfirmDeleteModal';
import ViewingFormModal from '@/components/ui/ViewingFormModal';
import apiClient from '@/lib/apiClient';

const normalizeList = (data) => data?.results || data?.items || data || [];

const getViewingId = (viewing) => viewing?.id || viewing?.pk || viewing?.viewing_id || null;

const getPropertyLabel = (value) => {
	if (!value) return 'N/A';
	if (typeof value === 'object') {
		const id = value.property_no || value.id || 'N/A';
		const location = [value.street, value.city].filter(Boolean).join(', ');
		return location ? `${id} - ${location}` : `${id}`;
	}
	return value;
};

const getClientLabel = (row) => {
	const value = row.client || row.renter;
	if (!value) return 'N/A';
	if (typeof value === 'object') {
		const fullName = `${value.first_name || ''} ${value.last_name || ''}`.trim();
		const id = value.client_no || value.id || 'N/A';
		return `${fullName || 'Unknown Client'} (${id})`;
	}
	return value;
};

const getViewingDate = (row) => row.viewing_date || row.view_date || 'N/A';
const getViewingTime = (row) => row.viewing_time || 'N/A';

export default function PropertyViewingsPage() {
	const [viewings, setViewings] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [loadError, setLoadError] = useState('');

	const [isFormOpen, setIsFormOpen] = useState(false);
	const [viewingToEdit, setViewingToEdit] = useState(null);

	const [isDeleteOpen, setIsDeleteOpen] = useState(false);
	const [viewingToDelete, setViewingToDelete] = useState(null);

	const loadViewings = async () => {
		setIsLoading(true);
		setLoadError('');

		try {
			const data = await apiClient('/properties/viewings/');
			setViewings(normalizeList(data));
		} catch (error) {
			console.error('Failed to load property viewings:', error);
			setLoadError('Unable to load property viewings right now.');
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		loadViewings();
	}, []);

	const handleAddClick = () => {
		setViewingToEdit(null);
		setIsFormOpen(true);
	};

	const handleEditClick = (viewing) => {
		setViewingToEdit(viewing);
		setIsFormOpen(true);
	};

	const handleDeleteClick = (viewing) => {
		setViewingToDelete(viewing);
		setIsDeleteOpen(true);
	};

	const tableColumns = [
		{
			key: 'viewing_id',
			label: 'Viewing ID',
			render: (_, row) => (
				<span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded text-xs">
					{getViewingId(row) || 'N/A'}
				</span>
			)
		},
		{
			key: 'property',
			label: 'Property',
			render: (value) => <span className="text-gray-900 font-medium">{getPropertyLabel(value)}</span>
		},
		{
			key: 'client',
			label: 'Client',
			render: (_, row) => <span className="text-gray-900">{getClientLabel(row)}</span>
		},
		{
			key: 'viewing_date',
			label: 'Date',
			render: (_, row) => getViewingDate(row)
		},
		{
			key: 'viewing_time',
			label: 'Time',
			render: (_, row) => getViewingTime(row)
		},
		{
			key: 'comments',
			label: 'Comments',
			render: (value) => {
				const text = value || '';
				if (!text) return 'No feedback';
				return text.length > 80 ? `${text.slice(0, 80)}...` : text;
			}
		}
	];

	const renderActions = (row) => (
		<div className="flex justify-end gap-2">
			<Button
				variant="secondary"
				size="sm"
				onClick={(event) => {
					event.stopPropagation();
					handleEditClick(row);
				}}
			>
				Edit
			</Button>
			<Button
				variant="danger"
				size="sm"
				onClick={(event) => {
					event.stopPropagation();
					handleDeleteClick(row);
				}}
			>
				Delete
			</Button>
		</div>
	);

	return (
		<div className="w-full max-w-7xl mx-auto space-y-6">
			<div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">Property Viewings</h1>
					<p className="text-sm text-gray-500 mt-1">
						Record and review client viewings with schedule and feedback details.
					</p>
				</div>

				<Button variant="primary" onClick={handleAddClick}>
					+ Record New Viewing
				</Button>
			</div>

			{loadError && (
				<div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
					{loadError}
				</div>
			)}

			<DataTable
				columns={tableColumns}
				data={viewings}
				keyField="id"
				isLoading={isLoading}
				emptyMessage="No property viewings recorded yet."
				onRowClick={handleEditClick}
				actions={renderActions}
			/>

			<ViewingFormModal
				isOpen={isFormOpen}
				onClose={() => setIsFormOpen(false)}
				onSuccess={loadViewings}
				viewingToEdit={viewingToEdit}
			/>

			<ConfirmDeleteModal
				isOpen={isDeleteOpen}
				onClose={() => setIsDeleteOpen(false)}
				onSuccess={loadViewings}
				endpoint="/properties/viewings"
				idToDelete={getViewingId(viewingToDelete)}
				itemName={`Viewing #${getViewingId(viewingToDelete) || 'N/A'}`}
			/>
		</div>
	);
}
