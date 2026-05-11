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
    street:       { required: true, maxLength: 255, label: 'Street Address', pattern: REGEX.ADDRESS, patternMessage: 'Invalid characters in address' },
    city:         { required: true, maxLength: 100, label: 'City', pattern: REGEX.ALPHA_ONLY, patternMessage: 'City name can only contain letters' },
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
    sex:          { required: true, maxLength: 10, label: 'Gender', pattern: REGEX.ALPHA_ONLY, patternMessage: 'Invalid gender format' },
    dob:          { required: true, label: 'Date of Birth', pattern: REGEX.DATE_YYYY_MM_DD, patternMessage: 'Date must be in YYYY-MM-DD format' },
    address:      { required: true, maxLength: 255, label: 'Address', pattern: REGEX.ADDRESS, patternMessage: 'Invalid characters in address' },
    telephone_no: { 
        required: true, 
        maxLength: 50, 
        label: 'Telephone Number',
        pattern: REGEX.PH_PHONE_FAX,
        patternMessage: 'Enter a valid PH phone number (e.g. 0912-345-6789 or 02-8123-4567)' 
    },
    nin:          { required: true, maxLength: 50, label: 'National Insurance Number', pattern: REGEX.ID_NUMBER, patternMessage: "Only letters, numbers, and hyphens allowed" },
    position:     { required: true, maxLength: 50, label: 'Position', pattern: REGEX.ALPHA_ONLY, patternMessage: 'Position can only contain letters' },
    salary:       { required: true, label: 'Salary', pattern: REGEX.MONEY, patternMessage: "Salary must be a valid amount" },
    date_joined:  { required: true, label: 'Date Joined', pattern: REGEX.DATE_YYYY_MM_DD, patternMessage: 'Date must be in YYYY-MM-DD format' },
    branch:       { required: true, label: 'Branch' }
};

/**
 * 🏘️ Property Validation Rules
 */
export const propertyValidators = {
    street:        { required: true, maxLength: 255, label: 'Street Address', pattern: REGEX.ADDRESS, patternMessage: 'Invalid characters in address' },
    city:          { required: true, maxLength: 100, label: 'City', pattern: REGEX.ALPHA_ONLY, patternMessage: 'City name can only contain letters' },
    postcode:      { required: true, maxLength: 20, label: 'Postcode', pattern: REGEX.PH_POSTCODE, patternMessage: 'Enter a valid PH postcode (0400 - 9811)' },
    property_type: { required: true, maxLength: 50, label: 'Property Type', pattern: REGEX.ALPHA_ONLY, patternMessage: 'Property type can only contain letters' },
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
    status:        { required: true, maxLength: 50, label: 'Status', pattern: REGEX.ALPHA_ONLY, patternMessage: 'Status can only contain letters' },
    owner:         { required: true, label: 'Owner' },
    branch:        { required: true, label: 'Branch' }
};

/**
 * 👁️ Property Viewing Validation Rules
 */
export const viewingValidators = {
    property_no: { required: true, label: 'Property' },
    renter_no:   { required: true, label: 'Renter' },
    view_date:   { required: true, label: 'Viewing Date', pattern: REGEX.DATE_YYYY_MM_DD, patternMessage: 'Date must be in YYYY-MM-DD format' },
    status:      { required: true, label: 'Status' },
    comments:    { maxLength: 500, label: 'Comments' }
};

/**
 * 🛠️ Property Inspection Validation Rules
 */
export const inspectionValidators = {
    property_no:      { required: true, label: 'Property' },
    staff_no:         { required: true, label: 'Staff' },
    inspection_date:  { required: true, label: 'Inspection Date', pattern: REGEX.DATE_YYYY_MM_DD, patternMessage: 'Date must be in YYYY-MM-DD format' },
    status:           { required: true, label: 'Status' },
    comments:         { maxLength: 500, label: 'Comments' }
};

/**
 * 📄 Lease Validation Rules (Ready for when you build the Lease form!)
 */
export const leaseValidators = {
    property:     { required: true, label: 'Property' },
    renter:       { required: true, label: 'Renter' },
    rent_start:   { required: true, label: 'Start Date', pattern: REGEX.DATE_YYYY_MM_DD, patternMessage: 'Date must be in YYYY-MM-DD format' },
    rent_finish:  { required: true, label: 'End Date', pattern: REGEX.DATE_YYYY_MM_DD, patternMessage: 'Date must be in YYYY-MM-DD format' },
    duration:     { required: true, label: 'Duration', pattern: REGEX.WHOLE_NUMBER, patternMessage: 'Duration must be a valid whole number' },
    monthly_rent: { required: true, label: 'Monthly Rent', pattern: REGEX.MONEY, patternMessage: 'Monthly rent must be a valid amount' },
    payment_method:{ required: true, label: 'Payment Method' },
    deposit:      { required: true, label: 'Deposit Amount', pattern: REGEX.MONEY, patternMessage: 'Deposit must be a valid amount' }
};

/**
 * 🧑‍💼 Client Validation Rules (Renters & Owners)
 */
export const clientValidators = {
    role:         { required: true, maxLength: 20, label: 'Role', pattern: REGEX.ALPHA_ONLY, patternMessage: 'Role can only contain letters' },
    first_name:   { required: true, maxLength: 100, label: 'First Name', pattern: REGEX.NAME, patternMessage: "Only letters, spaces, hyphens, and apostrophes allowed" },
    last_name:    { required: true, maxLength: 100, label: 'Last Name', pattern: REGEX.NAME, patternMessage: "Only letters, spaces, hyphens, and apostrophes allowed" },
    middle_name:  { maxLength: 100, label: 'Middle Name', pattern: REGEX.NAME, patternMessage: "Only letters, spaces, hyphens, and apostrophes allowed" },
    suffixes:     { maxLength: 10, label: 'Suffix' },
    address:      { required: true, maxLength: 255, label: 'Address', pattern: REGEX.ADDRESS, patternMessage: 'Invalid characters in address' },
    telephone_no: { 
        required: true, 
        maxLength: 50, 
        label: 'Telephone Number',
        pattern: REGEX.PH_PHONE_FAX,
        patternMessage: 'Enter a valid PH phone number (e.g. 0912-345-6789 or 02-8123-4567)' 
    },
    email:        { 
        required: true, 
        maxLength: 255, 
        label: 'Email',
        pattern: REGEX.EMAIL,
        patternMessage: 'Enter a valid email address' 
    }
};

/**
 * 👪 Next of Kin Validation Rules (Staff Emergency Contacts)
 */
export const nextOfKinValidators = {
    first_name:   { required: true, maxLength: 100, label: 'First Name', pattern: REGEX.NAME, patternMessage: "Only letters, spaces, hyphens, and apostrophes allowed" },
    last_name:    { required: true, maxLength: 100, label: 'Last Name', pattern: REGEX.NAME, patternMessage: "Only letters, spaces, hyphens, and apostrophes allowed" },
    middle_name:  { maxLength: 100, label: 'Middle Name', pattern: REGEX.NAME, patternMessage: "Only letters, spaces, hyphens, and apostrophes allowed" },
    suffixes:     { maxLength: 10, label: 'Suffix' },
    relationship: { required: true, maxLength: 100, label: 'Relationship', pattern: REGEX.ALPHA_ONLY, patternMessage: 'Relationship can only contain letters' },
    address:      { required: true, maxLength: 255, label: 'Address', pattern: REGEX.ADDRESS, patternMessage: 'Invalid characters in address' },
    telephone_no: { 
        required: true, 
        maxLength: 50, 
        label: 'Telephone Number',
        pattern: REGEX.PH_PHONE_FAX,
        patternMessage: 'Enter a valid PH phone number (e.g. 0912-345-6789 or 02-8123-4567)' 
    }
};

/**
 * 📋 Renter Requirement Validation Rules
 */
export const renterRequirementValidators = {
    pref_property_type: { maxLength: 50, label: 'Preferred Property Type', pattern: REGEX.ALPHA_ONLY, patternMessage: 'Property type can only contain letters' },
    max_monthly_rent:   { label: 'Max Monthly Rent', pattern: REGEX.MONEY, patternMessage: 'Must be a valid amount' },
    general_comments:   { label: 'General Comments' }
};

/**
 * 💳 Payment Validation Rules
 */
export const paymentValidators = {
    lease:          { required: true, label: 'Lease' },
    amount_paid:    { required: true, label: 'Amount Paid', pattern: REGEX.MONEY, patternMessage: 'Must be a valid amount' },
    payment_date:   { required: true, label: 'Payment Date', pattern: REGEX.DATE_YYYY_MM_DD, patternMessage: 'Date must be in YYYY-MM-DD format' },
    payment_method: { required: true, label: 'Payment Method' }
};

/**
 * 📢 Advertisement Validation Rules
 */
export const advertisementValidators = {
    property_no: { label: 'Property' },
    title:       { required: true, maxLength: 200, label: 'Title' },
    message:     { required: true, label: 'Message' },
    status:      { required: true, label: 'Status' },
    start_date:  { required: true, label: 'Start Date', pattern: REGEX.DATE_YYYY_MM_DD, patternMessage: 'Date must be in YYYY-MM-DD format' },
    end_date:    { required: true, label: 'End Date', pattern: REGEX.DATE_YYYY_MM_DD, patternMessage: 'Date must be in YYYY-MM-DD format' },
    priority:    { required: true, label: 'Priority', pattern: REGEX.WHOLE_NUMBER, patternMessage: 'Priority must be a valid whole number' },
    placement:   { required: true, label: 'Placement' },
    assigned_by: { label: 'Assigned By' }
};


