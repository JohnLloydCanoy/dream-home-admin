'use client';

import React, { useEffect, useMemo, useState } from 'react';
import DataTable from '@/components/ui/DataTable';
import FormField from '@/components/ui/FormField';
import Button from '@components/ui/Button';
import ClientBranchModal from '@/components/ui/ClientBranchModal';
import apiClient from '@/lib/apiClient';
import { useForm } from '@/hooks/useForm';

const normalizeList = (data) => data?.results || data?.items || data || [];

const toId = (value, idField) => {
    if (!value) return '';
    if (typeof value === 'object') return value[idField] || '';
    return value;
};

const getClientName = (client) => {
    if (!client) return 'Unknown Client';
    return `${client.first_name || ''} ${client.last_name || ''}`.trim() || client.client_no;
};

const getBranchLabel = (branch) => {
    if (!branch) return 'Unregistered';
    if (typeof branch === 'object') {
        const branchNo = branch.branch_no || '';
        const city = branch.city || '';
        if (branchNo && city) return `${branchNo} - ${city}`;
        return branchNo || city || 'Unregistered';
    }
    return branch;
};

const roleBadgeStyles = {
    renter: 'bg-blue-100 text-blue-800',
    owner: 'bg-orange-100 text-orange-800'
};

export default function RegistrationsPage() {
    const [clients, setClients] = useState([]);
    const [branches, setBranches] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState('');

    const [selectedClient, setSelectedClient] = useState(null);
    const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);

    const { formData, handleChange, reset } = useForm({ branch_filter: 'all' }, {});

    const loadData = async () => {
        setIsLoading(true);
        setLoadError('');

        try {
            const [clientsData, branchesData] = await Promise.all([
                apiClient('/users/clients/'),
                apiClient('/branches/')
            ]);

            setClients(normalizeList(clientsData));
            setBranches(normalizeList(branchesData));
        } catch (error) {
            console.error('Failed to load branch registrations:', error);
            setLoadError('Unable to load client branch registrations right now.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const filteredClients = useMemo(() => {
        const selectedFilter = String(formData.branch_filter || 'all').toLowerCase();

        if (selectedFilter === 'all') return clients;
        if (selectedFilter === 'unregistered') {
            return clients.filter((client) => !toId(client.registration_branch, 'branch_no'));
        }

        return clients.filter((client) => toId(client.registration_branch, 'branch_no') === formData.branch_filter);
    }, [clients, formData.branch_filter]);

    const summary = useMemo(() => {
        const registered = clients.filter((client) => Boolean(toId(client.registration_branch, 'branch_no'))).length;

        return {
            totalClients: clients.length,
            totalBranches: branches.length,
            registered,
            unregistered: clients.length - registered
        };
    }, [clients, branches]);

    const openBranchModal = (client = selectedClient) => {
        if (!client) return;
        setSelectedClient(client);
        setIsBranchModalOpen(true);
    };

    const closeBranchModal = () => {
        setIsBranchModalOpen(false);
    };

    const tableColumns = [
        {
            key: 'client_no',
            label: 'Client ID',
            render: (value) => (
                <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded text-xs">
                    {value}
                </span>
            )
        },
        {
            key: 'client_name',
            label: 'Client',
            render: (_, row) => (
                <div>
                    <p className="font-semibold text-gray-900">{getClientName(row)}</p>
                    <p className="text-xs text-gray-500">{row.email || 'No email on file'}</p>
                </div>
            )
        },
        {
            key: 'role',
            label: 'Role',
            render: (value) => {
                const normalizedRole = String(value || '').toLowerCase();
                return (
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${roleBadgeStyles[normalizedRole] || 'bg-gray-100 text-gray-700'}`}>
                        {value || 'N/A'}
                    </span>
                );
            }
        },
        {
            key: 'registration_branch',
            label: 'Registration Branch',
            render: (value) => {
                const label = getBranchLabel(value);
                const isRegistered = label !== 'Unregistered';
                return (
                    <span className={isRegistered ? 'text-gray-900 font-medium' : 'text-gray-400 italic'}>
                        {label}
                    </span>
                );
            }
        },
        {
            key: 'telephone_no',
            label: 'Telephone',
            render: (value) => value || 'N/A'
        }
    ];

    const renderActions = (row) => {
        const isRegistered = Boolean(toId(row.registration_branch, 'branch_no'));

        return (
            <Button
                variant={isRegistered ? 'secondary' : 'primary'}
                size="sm"
                onClick={(event) => {
                    event.stopPropagation();
                    openBranchModal(row);
                }}
            >
                {isRegistered ? 'Transfer Branch' : 'Register Branch'}
            </Button>
        );
    };

    return (
        <div className="w-full max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Client Relations - Branch Registrations</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Register and transfer existing clients to specific regional branches.
                    </p>
                </div>

                <div className="flex gap-2">
                    <Button variant="secondary" onClick={loadData}>
                        Refresh
                    </Button>
                    <Button variant="primary" onClick={() => openBranchModal()} disabled={!selectedClient}>
                        Transfer/Register Branch
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Total Clients</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{summary.totalClients}</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Branches</p>
                    <p className="text-2xl font-bold text-blue-700 mt-1">{summary.totalBranches}</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Registered</p>
                    <p className="text-2xl font-bold text-green-700 mt-1">{summary.registered}</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Unregistered</p>
                    <p className="text-2xl font-bold text-amber-700 mt-1">{summary.unregistered}</p>
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="w-full sm:w-80">
                    <FormField
                        label="Branch Filter"
                        field="branch_filter"
                        type="select"
                        value={formData.branch_filter}
                        onChange={handleChange}
                        required={false}
                    >
                        <option value="all">All Branches</option>
                        <option value="unregistered">Unregistered Clients</option>
                        {branches.map((branch) => (
                            <option key={branch.branch_no} value={branch.branch_no}>
                                {branch.branch_no} - {branch.city}
                            </option>
                        ))}
                    </FormField>
                </div>

                <div className="mt-2 flex justify-end">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => reset({ branch_filter: 'all' })}
                        disabled={formData.branch_filter === 'all'}
                    >
                        Reset Filter
                    </Button>
                </div>
            </div>

            {selectedClient && (
                <div className="bg-blue-50 border border-blue-200 text-blue-900 rounded-lg p-3 text-sm">
                    Selected Client: <strong>{getClientName(selectedClient)}</strong> ({selectedClient.client_no})
                </div>
            )}

            {loadError && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
                    {loadError}
                </div>
            )}

            <DataTable
                columns={tableColumns}
                data={filteredClients}
                keyField="client_no"
                isLoading={isLoading}
                emptyMessage="No clients found for the selected branch filter."
                onRowClick={setSelectedClient}
                actions={renderActions}
            />

            <ClientBranchModal
                isOpen={isBranchModalOpen}
                onClose={closeBranchModal}
                onSuccess={loadData}
                clientToRegister={selectedClient}
            />
        </div>
    );
}
