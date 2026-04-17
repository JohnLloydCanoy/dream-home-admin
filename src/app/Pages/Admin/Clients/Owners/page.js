'use client';

import React, { useEffect, useMemo, useState } from 'react';
import DataTable from '@/components/ui/DataTable';
import Button from '@components/ui/Button';
import ConfirmDeleteModal from '@/components/ui/ConfirmDeleteModal';
import OwnerFormModal from '@/components/ui/OwnerFormModal';
import apiClient from '@/lib/apiClient';

const normalizeList = (data) => data?.results || data?.items || data || [];

export default function OwnersPage() {
	const [owners, setOwners] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [loadError, setLoadError] = useState('');

	const [isFormOpen, setIsFormOpen] = useState(false);
	const [ownerToEdit, setOwnerToEdit] = useState(null);

	const [isDeleteOpen, setIsDeleteOpen] = useState(false);
	const [ownerToDelete, setOwnerToDelete] = useState(null);

	const loadOwners = async () => {
		setIsLoading(true);
		setLoadError('');

		try {
			const data = await apiClient('/users/client/');
			const ownerOnly = normalizeList(data).filter((client) => client.role === 'Owner');
			setOwners(ownerOnly);
		} catch (error) {
			console.error('Failed to load property owners:', error);
			setLoadError('Unable to load property owners right now.');
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		loadOwners();
	}, []);

	const summary = useMemo(() => {
		return {
			total: owners.length,
			withEmail: owners.filter((owner) => Boolean(owner.email)).length,
			withPhone: owners.filter((owner) => Boolean(owner.telephone_no)).length
		};
	}, [owners]);

	const handleAddClick = () => {
		setOwnerToEdit(null);
		setIsFormOpen(true);
	};

	const handleEditClick = (owner) => {
		setOwnerToEdit(owner);
		setIsFormOpen(true);
	};

	const handleDeleteClick = (owner) => {
		setOwnerToDelete(owner);
		setIsDeleteOpen(true);
	};

	const tableColumns = [
		{
			key: 'client_no',
			label: 'Owner ID',
			render: (value) => (
				<span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded text-xs">
					{value}
				</span>
			)
		},
		{
			key: 'owner_name',
			label: 'Full Name',
			render: (_, row) => (
				<span className="font-semibold text-gray-900">
					{row.first_name} {row.last_name}
				</span>
			)
		},
		{
			key: 'email',
			label: 'Email',
			render: (value) => value || 'N/A'
		},
		{
			key: 'telephone_no',
			label: 'Telephone',
			render: (value) => value || 'N/A'
		},
		{
			key: 'address',
			label: 'Address',
			render: (value) => value || 'N/A'
		},
		{
			key: 'role',
			label: 'Role',
			render: (value) => (
				<span className="px-2.5 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800">
					{value}
				</span>
			)
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
					<h1 className="text-3xl font-bold text-gray-900">Property Owners</h1>
					<p className="text-sm text-gray-500 mt-1">
						Manage client records for property owners only.
					</p>
				</div>

				<Button variant="primary" onClick={handleAddClick}>
					+ Add Property Owner
				</Button>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
				<div className="bg-white border border-gray-200 rounded-xl p-4">
					<p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Total Owners</p>
					<p className="text-2xl font-bold text-gray-900 mt-1">{summary.total}</p>
				</div>
				<div className="bg-white border border-gray-200 rounded-xl p-4">
					<p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">With Email</p>
					<p className="text-2xl font-bold text-blue-700 mt-1">{summary.withEmail}</p>
				</div>
				<div className="bg-white border border-gray-200 rounded-xl p-4">
					<p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">With Telephone</p>
					<p className="text-2xl font-bold text-green-700 mt-1">{summary.withPhone}</p>
				</div>
			</div>

			{loadError && (
				<div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
					{loadError}
				</div>
			)}

			<DataTable
				columns={tableColumns}
				data={owners}
				keyField="client_no"
				isLoading={isLoading}
				emptyMessage="No property owners found."
				onRowClick={handleEditClick}
				actions={renderActions}
			/>

			<OwnerFormModal
				isOpen={isFormOpen}
				onClose={() => setIsFormOpen(false)}
				onSuccess={loadOwners}
				ownerToEdit={ownerToEdit}
			/>

			<ConfirmDeleteModal
				isOpen={isDeleteOpen}
				onClose={() => setIsDeleteOpen(false)}
				onSuccess={loadOwners}
				endpoint="/users/client"
				idToDelete={ownerToDelete?.client_no}
				itemName={`${ownerToDelete?.first_name || ''} ${ownerToDelete?.last_name || ''}`.trim() || ownerToDelete?.client_no}
			/>
		</div>
	);
}
