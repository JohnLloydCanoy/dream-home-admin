import { REGEX } from '@/components/functions/RegEx';


export function validateForm(data, validators) {
    const errors = {};
    for (const [field, rules] of Object.entries(validators)) {
        // Handle undefined or null values
        let value = data[field];
        if (value === null || value === undefined) {
             value = '';
        } else {
             value = String(value).trim();
        }
        
        // 1. Check if required
        if (rules.required && !value) {
            errors[field] = `${rules.label} is required.`;
        } 
        // 2. Check max length
        else if (value && rules.maxLength && value.length > rules.maxLength) {
            errors[field] = `${rules.label} must be under ${rules.maxLength} characters.`;
        } 
        // 3. Check Regex patterns (like email or phone format)
        else if (value && rules.pattern && !rules.pattern.test(value)) {
            errors[field] = rules.patternMessage;
        }
    }
    return errors;
}

/**
 * 🏢 Branch Validation Rules
 */
export const branchValidators = {
    street:       { required: true, maxLength: 255, label: 'Street Address' },
    city:         { required: true, maxLength: 100, label: 'City' },
    telephone_no: { 
        required: true, 
        maxLength: 50, 
        label: 'Telephone Number',
        pattern: REGEX.PH_PHONE_FAX,
        patternMessage: 'Enter a valid PH phone number (e.g. 0912-345-6789 or 02-8123-4567)' 
    },
    fax_no: { 
        maxLength: 50, 
        label: 'Fax Number',
        pattern: REGEX.PH_PHONE_FAX,
        patternMessage: 'Enter a valid PH fax number (e.g. 02-8123-4567)' 
    },
    area:         { required: true, label: 'Barangay/Area' },
    postcode: { 
        required: true, 
        maxLength: 4, 
        label: 'Postcode',
        pattern: REGEX.PH_POSTCODE,
        patternMessage: 'Enter a valid PH postcode (0400 - 9811)'
    }
};

/**
 * 👥 Staff Validation Rules
 */
export const staffValidators = {
    first_name:   { required: true, maxLength: 100, label: 'First Name', pattern: REGEX.NAME, patternMessage: "Only letters, spaces, hyphens, and apostrophes allowed" },
    last_name:    { required: true, maxLength: 100, label: 'Last Name', pattern: REGEX.NAME, patternMessage: "Only letters, spaces, hyphens, and apostrophes allowed" },
    middle_name:  { maxLength: 100, label: 'Middle Name', pattern: REGEX.NAME, patternMessage: "Only letters, spaces, hyphens, and apostrophes allowed" },
    suffix:       { maxLength: 10, label: 'Suffix' },
    email:        { 
        required: true, 
        maxLength: 255, 
        label: 'Email',
        pattern: REGEX.EMAIL,
        patternMessage: 'Enter a valid email address' 
    },
    sex:          { required: true, maxLength: 10, label: 'Gender' },
    dob:          { required: true, label: 'Date of Birth' },
    address:      { required: true, maxLength: 255, label: 'Address' },
    telephone_no: { 
        required: true, 
        maxLength: 50, 
        label: 'Telephone Number',
        pattern: REGEX.PH_PHONE_FAX,
        patternMessage: 'Enter a valid PH phone number (e.g. 0912-345-6789 or 02-8123-4567)' 
    },
    nin:          { required: true, maxLength: 50, label: 'National Insurance Number', pattern: REGEX.ID_NUMBER, patternMessage: "Only letters, numbers, and hyphens allowed" },
    position:     { required: true, maxLength: 50, label: 'Position' },
    salary:       { required: true, label: 'Salary', pattern: REGEX.MONEY, patternMessage: "Salary must be a valid amount" },
    date_joined:  { required: true, label: 'Date Joined' },
    branch:       { required: true, label: 'Branch' }
};

/**
 * 🏘️ Property Validation Rules
 */
export const propertyValidators = {
    street:        { required: true, maxLength: 255, label: 'Street Address' },
    city:          { required: true, maxLength: 100, label: 'City' },
    postcode:      { required: true, maxLength: 20, label: 'Postcode' },
    property_type: { required: true, maxLength: 50, label: 'Property Type' },
    no_of_rooms:   {
        required: true,
        label: 'No. of Rooms',
        pattern: REGEX.WHOLE_NUMBER,
        patternMessage: 'No. of rooms must be between 1 and 999'
    },
    monthly_rent:  {
        required: true,
        label: 'Monthly Rent',
        pattern: REGEX.MONEY,
        patternMessage: 'Monthly rent must be a valid amount'
    },
    status:        { required: true, maxLength: 50, label: 'Status' },
    owner:         { required: true, label: 'Owner' },
    branch:        { required: true, label: 'Branch' }
};

/**
 * 📄 Lease Validation Rules (Ready for when you build the Lease form!)
 */
export const leaseValidators = {
    property:     { required: true, label: 'Property' },
    renter:       { required: true, label: 'Renter' },
    rent_start:   { required: true, label: 'Start Date' },
    rent_finish:  { required: true, label: 'End Date' },
    duration:     { required: true, label: 'Duration', pattern: REGEX.WHOLE_NUMBER, patternMessage: 'Duration must be a valid whole number' },
    monthly_rent: { required: true, label: 'Monthly Rent', pattern: REGEX.MONEY, patternMessage: 'Monthly rent must be a valid amount' },
    payment_method:{ required: true, label: 'Payment Method' },
    deposit:      { required: true, label: 'Deposit Amount', pattern: REGEX.MONEY, patternMessage: 'Deposit must be a valid amount' }
};

