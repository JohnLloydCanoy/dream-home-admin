"use client";

import React, { useEffect, useState } from 'react';
import Button from '@components/ui/Button';
import Dialog from '@components/ui/Dialog';
import FormField from '@/components/ui/FormField';
import apiClient from '@/lib/apiClient';
import { useForm } from '@/hooks/useForm';
import { useCreate, useUpdate } from '@/hooks/useCrud';

const normalizeList = (data) => data?.results || data?.items || data || [];

const toId = (value, idField) => {
	if (!value) return '';
	if (typeof value === 'object') return value[idField] || '';
	return value;
};

const getInitialState = (lease) => ({
	property: toId(lease?.property, 'property_no') || lease?.property || '',
	renter: toId(lease?.renter, 'client_no') || lease?.renter || '',
	monthly_rent: lease?.monthly_rent || '',
	payment_method: lease?.payment_method || 'Transfer',
	deposit: lease?.deposit || '',
	start_date: lease?.start_date || lease?.rent_start || '',
	end_date: lease?.end_date || lease?.rent_finish || '',
	duration: lease?.duration || ''
});

const leaseValidators = {
	property: { required: true, label: 'Property' },
	renter: { required: true, label: 'Renter' },
	monthly_rent: {
		required: true,
		label: 'Monthly Rent',
		pattern: /^\d+(\.\d{1,2})?$/,
		patternMessage: 'Enter a valid rent amount'
	},
	payment_method: { required: true, label: 'Payment Method' },
	deposit: {
		required: true,
		label: 'Deposit',
		pattern: /^\d+(\.\d{1,2})?$/,
		patternMessage: 'Enter a valid deposit amount'
	},
	start_date: { required: true, label: 'Start Date' },
	end_date: { required: true, label: 'End Date' },
	duration: {
		required: true,
		label: 'Duration (Months)',
		pattern: /^\d+$/,
		patternMessage: 'Enter a valid month count'
	}
};

const sectionTheme = {
	wrapper: 'bg-gray-50/70 border border-gray-100 rounded-xl p-4 sm:p-5',
	heading: 'text-sm font-bold text-[#002147]',
	description: 'text-xs text-gray-500 mt-1'
};

const FormSection = ({ title, description, children }) => (
	<section className={sectionTheme.wrapper}>
		<h3 className={sectionTheme.heading}>{title}</h3>
		{description && <p className={sectionTheme.description}>{description}</p>}
		<div className="mt-4">{children}</div>
	</section>
);

const getPropertyLabel = (property) => {
	const propertyId = property?.property_no || property?.id || 'N/A';
	const location = [property?.street, property?.city].filter(Boolean).join(', ');
	return location ? `${propertyId} - ${location}` : `${propertyId}`;
};

const getRenterLabel = (renter) => {
	const fullName = `${renter?.first_name || ''} ${renter?.last_name || ''}`.trim();
	const renterId = renter?.client_no || renter?.id || 'N/A';
	return `${fullName || 'Unknown Renter'} (${renterId})`;
};

export default function LeaseFormModal({ isOpen, onClose, onSuccess, leaseToEdit }) {
	const isEditMode = Boolean(leaseToEdit?.lease_no);

	const [properties, setProperties] = useState([]);
	const [renters, setRenters] = useState([]);
	const [loadError, setLoadError] = useState('');

	const { createRecord, isLoading: isCreating, error: createError, setError: setCreateError } = useCreate('/leases/');
	const { updateRecord, isLoading: isUpdating, error: updateError, setError: setUpdateError } = useUpdate('/leases');

	const isSaving = isCreating || isUpdating;
	const submitError = isEditMode ? updateError : createError;

	const { formData, errors, handleChange, validate, reset } = useForm(
		getInitialState(leaseToEdit),
		leaseValidators
	);

	useEffect(() => {
		if (!isOpen) return;

		const currentPropertyId = toId(leaseToEdit?.property, 'property_no') || leaseToEdit?.property || '';
		setLoadError('');

		Promise.all([
			apiClient('/properties/'),
			apiClient('/users/client/').catch(() => apiClient('/users/clients/'))
		])
			.then(([propertyData, clientData]) => {
				const propertyList = normalizeList(propertyData);
				const availableProperties = propertyList.filter((property) => {
					const propertyId = property.property_no || property.id;
					const status = String(property.status || '').toLowerCase();
					return status === 'available' || propertyId === currentPropertyId;
				});

				const renterOnly = normalizeList(clientData).filter(
					(client) => String(client?.role || '').toLowerCase() === 'renter'
				);

				setProperties(availableProperties);
				setRenters(renterOnly);
			})
			.catch((error) => {
				console.error('Failed to load lease form options:', error);
				setLoadError('Unable to load property and renter options right now.');
			});
	}, [isOpen, leaseToEdit?.lease_no]);

	useEffect(() => {
		if (!isOpen) return;

		reset(getInitialState(leaseToEdit));
		setCreateError(null);
		setUpdateError(null);
		setLoadError('');
	}, [isOpen, leaseToEdit?.lease_no]);

	const handleSubmit = async (event) => {
		event.preventDefault();

		if (!validate()) return;

		if (formData.start_date && formData.end_date && formData.start_date >= formData.end_date) {
			setLoadError('End date must be later than start date.');
			return;
		}

		const payload = {
			property: formData.property,
			renter: formData.renter,
			monthly_rent: Number(formData.monthly_rent),
			payment_method: formData.payment_method,
			deposit: Number(formData.deposit),
			rent_start: formData.start_date,
			rent_finish: formData.end_date,
			duration: Number(formData.duration)
		};

		const result = isEditMode
			? await updateRecord(leaseToEdit.lease_no, payload, 'PATCH')
			: await createRecord(payload);

		if (result.success) {
			onSuccess();
			onClose();
		}
	};

	return (
		<Dialog
			isOpen={isOpen}
			onClose={onClose}
			title={isEditMode ? `Edit Lease - ${leaseToEdit.lease_no}` : 'Create Lease Agreement'}
		>
			<form onSubmit={handleSubmit} className="space-y-5 max-h-[75vh] overflow-y-auto pr-1 pb-1 custom-scrollbar">
				{(loadError || submitError) && (
					<div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 sticky top-0 z-10">
						{loadError || submitError}
					</div>
				)}

				<FormSection
					title="Parties Involved"
					description="Select the available property and renter for this contract."
				>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<FormField
							label="Property"
							field="property"
							type="select"
							value={formData.property}
							onChange={handleChange}
							error={errors.property}
						>
							<option value="">- Select Property -</option>
							{properties.map((property) => (
								<option key={property.property_no || property.id} value={property.property_no || property.id}>
									{getPropertyLabel(property)}
								</option>
							))}
						</FormField>

						<FormField
							label="Renter"
							field="renter"
							type="select"
							value={formData.renter}
							onChange={handleChange}
							error={errors.renter}
						>
							<option value="">- Select Renter -</option>
							{renters.map((renter) => (
								<option key={renter.client_no || renter.id} value={renter.client_no || renter.id}>
									{getRenterLabel(renter)}
								</option>
							))}
						</FormField>
					</div>
				</FormSection>

				<FormSection
					title="Financial Terms"
					description="Define the rent, payment channel, and contract deposit values."
				>
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
						<FormField
							label="Monthly Rent"
							field="monthly_rent"
							type="number"
							value={formData.monthly_rent}
							onChange={handleChange}
							error={errors.monthly_rent}
							placeholder="e.g. 25000"
						/>

						<FormField
							label="Payment Method"
							field="payment_method"
							type="select"
							value={formData.payment_method}
							onChange={handleChange}
							error={errors.payment_method}
						>
							<option value="Cash">Cash</option>
							<option value="Transfer">Bank Transfer</option>
							<option value="Cheque">Cheque</option>
						</FormField>

						<FormField
							label="Deposit"
							field="deposit"
							type="number"
							value={formData.deposit}
							onChange={handleChange}
							error={errors.deposit}
							placeholder="e.g. 50000"
						/>
					</div>
				</FormSection>

				<FormSection
					title="Lease Duration"
					description="Capture the lease period and total contract months."
				>
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
						<FormField
							label="Start Date"
							field="start_date"
							type="date"
							value={formData.start_date}
							onChange={handleChange}
							error={errors.start_date}
						/>

						<FormField
							label="End Date"
							field="end_date"
							type="date"
							value={formData.end_date}
							onChange={handleChange}
							error={errors.end_date}
						/>

						<FormField
							label="Duration (Months)"
							field="duration"
							type="number"
							value={formData.duration}
							onChange={handleChange}
							error={errors.duration}
							placeholder="e.g. 12"
						/>
					</div>
				</FormSection>

				<div className="flex justify-end gap-3 pt-2">
					<Button type="button" variant="ghost" onClick={onClose} disabled={isSaving}>
						Cancel
					</Button>
					<Button type="submit" variant="primary" isLoading={isSaving}>
						{isEditMode ? 'Update Lease' : 'Save Lease'}
					</Button>
				</div>
			</form>
		</Dialog>
	);
}
