export const REGEX = {
    // Matches exactly 4 digits, specifically ranging from 0400 to 9811
    PH_POSTCODE: /^(0[4-9]\d{2}|[1-8]\d{3}|9[0-7]\d{2}|980\d|981[0-1])$/,

    // Matches PH Mobile (11 digits) and PH Landline/Fax (10 digits), allowing spaces and hyphens.
    // Must start with '0' or '+63', followed by exactly 9 or 10 digits.
    PH_PHONE_FAX: /^(?:\+63|0)(?:[-\s]*\d){9,10}$/,
    // Standard email format
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

    // Matches numbers up to 3 digits (1 - 999)
    WHOLE_NUMBER: /^[1-9]\d{0,2}$/,

    // Matches monetary amounts with optional 2 decimal places (e.g. 1500 or 1500.50)
    MONEY: /^\d+(\.\d{1,2})?$/,

    // Matches names (letters, spaces, hyphens, periods, apostrophes, and ñ/Ñ)
    NAME: /^[A-Za-z\s\-.'ñÑ]+$/,

    // Matches government IDs (letters, numbers, hyphens only)
    ID_NUMBER: /^[A-Za-z0-9\-]+$/,

    // Matches addresses: letters, numbers, spaces, periods, commas, and #
    ADDRESS: /^[A-Za-z0-9\s\-.,'#ñÑ]+$/,

    // Matches strict alphabetic text only (no numbers or symbols other than spaces/hyphens)
    ALPHA_ONLY: /^[A-Za-z\s\-ñÑ]+$/,

    // Matches strictly YYYY-MM-DD date format
    DATE_YYYY_MM_DD: /^\d{4}-\d{2}-\d{2}$/,

    // Matches passwords (min 8 chars, at least one letter and one number)
    PASSWORD: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/,
};
