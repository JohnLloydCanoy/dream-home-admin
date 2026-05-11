// ─── Pagination Utility Functions ────────────────────────────────────────────
// Pure helpers — no React, no side-effects.
// Safe to import in any component, hook, or server context.
//
// Usage:
//   import { paginateData, getPageCount, getPageInfo, getPageRange } from '@/components/functions/paginationfunc';
//
//   const pageCount  = getPageCount(data.length, pageSize);
//   const pagedData  = paginateData(data, currentPage, pageSize);
//   const pageInfo   = getPageInfo(currentPage, pageSize, data.length);
//   const pageRange  = getPageRange(currentPage, pageCount);

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Returns the slice of data visible on the given page.
 *
 * @param {any[]}  data
 * @param {number} currentPage   1-indexed current page number.
 * @param {number} pageSize      Records per page. Pass 0 to disable (returns full array).
 * @returns {any[]}
 */
export function paginateData(data, currentPage, pageSize) {
    if (!Array.isArray(data)) return [];
    if (pageSize <= 0) return data;
    const start = (currentPage - 1) * pageSize;
    return data.slice(start, start + pageSize);
}

/**
 * Returns the total number of pages needed to display all records.
 *
 * @param {number} totalItems
 * @param {number} pageSize
 * @returns {number}  Always at least 1.
 */
export function getPageCount(totalItems, pageSize) {
    if (pageSize <= 0) return 1;
    return Math.max(1, Math.ceil(totalItems / pageSize));
}

/**
 * Returns a human-readable summary string, e.g. "Showing 11–20 of 47".
 *
 * @param {number} currentPage
 * @param {number} pageSize
 * @param {number} totalItems
 * @returns {string}
 */
export function getPageInfo(currentPage, pageSize, totalItems) {
    if (totalItems === 0) return 'No records';
    if (pageSize <= 0) return `${totalItems} record${totalItems !== 1 ? 's' : ''}`;
    const start = (currentPage - 1) * pageSize + 1;
    const end = Math.min(currentPage * pageSize, totalItems);
    return `Showing ${start}–${end} of ${totalItems}`;
}

/**
 * Returns an array of page numbers (and `null` as ellipsis markers) for a
 * numbered page control.  Always includes the first and last pages.
 *
 * @param {number} currentPage
 * @param {number} pageCount
 * @param {number} [delta=2]   How many pages to show on each side of the active page.
 * @returns {(number | null)[]}
 *
 * @example
 *   getPageRange(5, 10)
 *   // → [1, null, 3, 4, 5, 6, 7, null, 10]
 */
export function getPageRange(currentPage, pageCount, delta = 2) {
    if (pageCount <= 1) return [1];

    const left = Math.max(2, currentPage - delta);
    const right = Math.min(pageCount - 1, currentPage + delta);

    const range = [1];

    if (left > 2) range.push(null);                          // left ellipsis

    for (let i = left; i <= right; i++) range.push(i);

    if (right < pageCount - 1) range.push(null);             // right ellipsis

    range.push(pageCount);

    return range;
}

/**
 * Clamps a page number to the valid range [1, pageCount].
 *
 * @param {number} page
 * @param {number} pageCount
 * @returns {number}
 */
export function clampPage(page, pageCount) {
    return Math.max(1, Math.min(pageCount, page));
}
