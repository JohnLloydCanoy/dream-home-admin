// ─── Sorting Utility Functions ───────────────────────────────────────────────
// Pure helpers — no React, no side-effects.
// Safe to import in any component, hook, or server context.
//
// Usage:
//   import { applySort } from '@/components/functions/SortingFunc';
//
//   const sorted = applySort(data, sortConfig, 'name', 'created_at');
//   const sorted = applySort(data, sortConfig, ['first_name', 'last_name'], 'date_joined');

// ─── Internal helpers ─────────────────────────────────────────────────────────

/**
 * Coerces any value to a lowercase trimmed string for locale-aware comparison.
 */
function toComparableString(value) {
    if (value === null || value === undefined) return '';
    return String(value).toLowerCase().trim();
}

/**
 * Resolves the sort string from a row given a nameKey.
 *
 * @param {object} row
 * @param {string | string[]} nameKey
 *   Single key:  'name'                      → row.name
 *   Array keys:  ['first_name', 'last_name'] → "john doe"
 */
function resolveName(row, nameKey) {
    if (Array.isArray(nameKey)) {
        return nameKey
            .map((k) => toComparableString(row?.[k]))
            .filter(Boolean)
            .join(' ');
    }
    return toComparableString(row?.[nameKey]);
}

/**
 * Converts a date field value to a Unix timestamp for numeric comparison.
 * Returns 0 for null / unparseable values so they sort to the bottom.
 */
function resolveTimestamp(row, dateKey) {
    const raw = row?.[dateKey];
    if (!raw) return 0;
    const ts = new Date(raw).getTime();
    return Number.isNaN(ts) ? 0 : ts;
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Returns a new array sorted alphabetically by a name field.
 *
 * @param {object[]} data
 * @param {string | string[]} nameKey   Field key(s) to sort on.  Default: 'name'.
 *                                      Pass an array like ['first_name', 'last_name']
 *                                      to sort on a composite full name.
 * @param {'asc' | 'desc'}  direction   Sort direction.  Default: 'asc'.
 * @returns {object[]}
 */
export function sortByName(data, nameKey = 'name', direction = 'asc') {
    if (!Array.isArray(data) || data.length === 0) return data;
    const multiplier = direction === 'desc' ? -1 : 1;

    return [...data].sort((a, b) => {
        const aName = resolveName(a, nameKey);
        const bName = resolveName(b, nameKey);
        return aName.localeCompare(bName, undefined, { sensitivity: 'base' }) * multiplier;
    });
}

/**
 * Returns a new array sorted chronologically by a date field.
 *
 * @param {object[]} data
 * @param {string}          dateKey    Field key that holds the date value.  Default: 'created_at'.
 *                                     Accepts ISO strings, timestamps, or any value parseable by new Date().
 * @param {'asc' | 'desc'} direction   Sort direction.  Default: 'asc' (oldest first).
 *                                     Pass 'desc' for newest-first (most common in dashboards).
 * @returns {object[]}
 */
export function sortByDate(data, dateKey = 'created_at', direction = 'asc') {
    if (!Array.isArray(data) || data.length === 0) return data;
    const multiplier = direction === 'desc' ? -1 : 1;

    return [...data].sort((a, b) => {
        const diff = (resolveTimestamp(a, dateKey) - resolveTimestamp(b, dateKey)) * multiplier;
        if (diff !== 0) return diff;

        // ── Tiebreaker: sort by the first key of the object so equal-date rows
        //    always produce a deterministic and visibly different order.
        const fallbackKey = Object.keys(a || {})[0];
        if (!fallbackKey) return 0;
        return toComparableString(a[fallbackKey]).localeCompare(
            toComparableString(b[fallbackKey]),
            undefined,
            { sensitivity: 'base' }
        ) * multiplier;
    });
}

/**
 * Applies the active sort configuration from the SortControls component.
 * Returns the original array reference unchanged when no sort is active.
 *
 * @param {object[]}  data
 * @param {{ field: 'name' | 'date' | null, direction: 'asc' | 'desc' }} sortConfig
 * @param {string | string[]} nameKey   Forwarded to sortByName.   Default: 'name'.
 * @param {string}            dateKey   Forwarded to sortByDate.   Default: 'created_at'.
 * @returns {object[]}
 *
 * @example
 *   const [sortConfig, setSortConfig] = useState({ field: null, direction: 'asc' });
 *
 *   const handleSort = (field) =>
 *       setSortConfig((prev) => ({
 *           field,
 *           direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc',
 *       }));
 *
 *   const sortedData = applySort(rawData, sortConfig, ['first_name', 'last_name'], 'date_joined');
 */
export function applySort(data, sortConfig, nameKey = 'name', dateKey = 'created_at') {
    if (!sortConfig?.field) return data;

    if (sortConfig.field === 'name') {
        return sortByName(data, nameKey, sortConfig.direction);
    }

    if (sortConfig.field === 'date') {
        return sortByDate(data, dateKey, sortConfig.direction);
    }

    return data;
}

/**
 * Creates a standard sort handler function — use this in your page component
 * to avoid re-writing the toggle logic every time.
 *
 * @param {Function} setSortConfig   The state setter from useState.
 * @returns {(field: 'name' | 'date') => void}
 *
 * @example
 *   const [sortConfig, setSortConfig] = useState({ field: null, direction: 'asc' });
 *   const handleSort = createSortHandler(setSortConfig);
 *
 *   <SortControls sortConfig={sortConfig} onSort={handleSort} />
 */
export function createSortHandler(setSortConfig) {
    return (field) => {
        setSortConfig((prev) => ({
            field,
            direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc',
        }));
    };
}
