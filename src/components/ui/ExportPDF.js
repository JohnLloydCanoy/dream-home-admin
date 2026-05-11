'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Button from '@components/ui/Button';
import Dialog from '@components/ui/Dialog';

const escapeHtml = (value) => {
	return String(value)
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
};

const formatCellValue = (value) => {
	if (value === null || value === undefined) return '';
	if (Array.isArray(value)) return value.map(formatCellValue).join(', ');
	if (value instanceof Date) return value.toLocaleDateString();
	if (typeof value === 'object') return JSON.stringify(value);
	return String(value);
};

const buildPrintableHtml = ({ title, subtitle, columns, rows, includeTimestamp }) => {
	const timestamp = includeTimestamp ? new Date().toLocaleString() : '';

	const headerCells = columns
		.map((column) => `<th>${escapeHtml(column.label)}</th>`)
		.join('');

	const bodyRows = rows.length
		? rows
			.map((row) => {
				const cells = columns
					.map((column) => {
						const raw = column.getValue(row);
						const formatted = escapeHtml(formatCellValue(raw)).replace(/\n/g, '<br/>');
						return `<td>${formatted}</td>`;
					})
					.join('');
				return `<tr>${cells}</tr>`;
			})
			.join('')
		: `<tr><td class="empty" colspan="${columns.length}">No records to export.</td></tr>`;

	return `<!doctype html>
<html>
	<head>
		<meta charset="utf-8" />
		<title>${escapeHtml(title)}</title>
		<style>
			* { box-sizing: border-box; }
			body { font-family: 'Segoe UI', Arial, sans-serif; color: #0f172a; margin: 24px; }
			h1 { font-size: 20px; margin: 0 0 4px; }
			p { margin: 0; }
			.meta { margin-bottom: 16px; color: #475569; font-size: 12px; }
			table { width: 100%; border-collapse: collapse; font-size: 12px; }
			th, td { border: 1px solid #e2e8f0; padding: 8px; text-align: left; vertical-align: top; }
			th { background: #f8fafc; font-weight: 700; text-transform: uppercase; font-size: 11px; letter-spacing: 0.04em; }
			tr:nth-child(even) td { background: #f9fafb; }
			.empty { text-align: center; padding: 20px; color: #64748b; }
			@page { margin: 12mm; }
		</style>
	</head>
	<body>
		<h1>${escapeHtml(title)}</h1>
		${subtitle ? `<p class="meta">${escapeHtml(subtitle)}</p>` : '<div class="meta"></div>'}
		${timestamp ? `<p class="meta">Generated: ${escapeHtml(timestamp)}</p>` : ''}
		<table>
			<thead>
				<tr>${headerCells}</tr>
			</thead>
			<tbody>
				${bodyRows}
			</tbody>
		</table>
	</body>
</html>`;
};

export default function ExportPDF({
	title = 'Report',
	subtitle = '',
	fileName = 'export',
	columns = [],
	data = [],
	buttonLabel = 'Export PDF',
	buttonVariant = 'secondary',
	buttonSize = 'sm',
	confirmLabel = 'Export',
	cancelLabel = 'Cancel',
	includeTimestamp = true,
	className = '',
	disabled = false
}) {
	const [isOpen, setIsOpen] = useState(false);
	const [exportName, setExportName] = useState(fileName || title);
	const [error, setError] = useState('');

	useEffect(() => {
		if (isOpen) {
			setExportName(fileName || title || 'export');
			setError('');
		}
	}, [fileName, title, isOpen]);

	const exportColumns = useMemo(() => {
		const sourceColumns = columns.length
			? columns
			: (Array.isArray(data) && data[0] ? Object.keys(data[0]).map((key) => ({ key, label: key })) : []);

		return sourceColumns
			.filter((column) => column && column.export !== false)
			.map((column) => ({
				label: column.exportLabel || column.label || column.key || '',
				getValue: (row) => {
					if (typeof column.exportValue === 'function') return column.exportValue(row);
					if (column.exportKey) return row?.[column.exportKey];
					if (column.key) return row?.[column.key];
					return '';
				}
			}))
			.filter((column) => column.label);
	}, [columns, data]);

	const canExport = exportColumns.length > 0 && Array.isArray(data);

	const handleExport = () => {
		if (!canExport) {
			setError('Nothing to export yet.');
			return;
		}

		const html = buildPrintableHtml({
			title: exportName || title,
			subtitle,
			columns: exportColumns,
			rows: data,
			includeTimestamp
		});

		const printWindow = window.open('', '_blank', 'width=1000,height=700');
		if (!printWindow) {
			setError('Popup blocked. Please allow popups and try again.');
			return;
		}

		printWindow.document.open();
		printWindow.document.write(html);
		printWindow.document.close();
		printWindow.document.title = exportName || title || 'export';
		printWindow.focus();

		setTimeout(() => {
			printWindow.print();
			printWindow.onafterprint = () => printWindow.close();
		}, 200);

		setIsOpen(false);
	};

	return (
		<>
			<Button
				onClick={() => setIsOpen(true)}
				variant={buttonVariant}
				size={buttonSize}
				className={className}
				disabled={disabled}
			>
				{buttonLabel}
			</Button>

			<Dialog isOpen={isOpen} onClose={() => setIsOpen(false)} title="Export PDF">
				<div className="space-y-4">
					<div>
						<label className="text-[11px] font-bold uppercase tracking-wider text-gray-700">
							File name
						</label>
						<input
							value={exportName}
							onChange={(event) => setExportName(event.target.value)}
							className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none"
							placeholder="export"
						/>
					</div>

					<div className="text-sm text-gray-600">
						<p>Columns: {exportColumns.length}</p>
						<p>Rows: {Array.isArray(data) ? data.length : 0}</p>
					</div>

					{error && (
						<div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
							{error}
						</div>
					)}

					<div className="flex justify-end gap-3">
						<Button variant="ghost" onClick={() => setIsOpen(false)}>
							{cancelLabel}
						</Button>
						<Button variant="primary" onClick={handleExport} disabled={!canExport}>
							{confirmLabel}
						</Button>
					</div>
				</div>
			</Dialog>
		</>
	);
}
