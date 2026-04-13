
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
    postcode:     { required: true, maxLength: 20, label: 'Postcode' },
    telephone_no: { 
        required: true, 
        maxLength: 50, 
        label: 'Telephone Number',
        pattern: /^\+?[\d\s\-()]{7,50}$/,
        patternMessage: 'Enter a valid phone number' 
    },
    area:         { required: true, label: 'Barangay/Area' }
};

/**
 * 👥 Staff Validation Rules
 */
export const staffValidators = {
    first_name:   { required: true, maxLength: 100, label: 'First Name' },
    last_name:    { required: true, maxLength: 100, label: 'Last Name' },
    email:        { 
        required: true, 
        maxLength: 255, 
        label: 'Email',
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        patternMessage: 'Enter a valid email address' 
    },
    sex:          { required: true, maxLength: 10, label: 'Gender' },
    dob:          { required: true, label: 'Date of Birth' },
    address:      { required: true, maxLength: 255, label: 'Address' },
    telephone_no: { 
        required: true, 
        maxLength: 50, 
        label: 'Telephone Number',
        pattern: /^\+?[\d\s\-()]{7,50}$/,
        patternMessage: 'Enter a valid phone number' 
    },
    nin:          { required: true, maxLength: 50, label: 'National Insurance Number' },
    position:     { required: true, maxLength: 50, label: 'Position' },
    salary:       { required: true, label: 'Salary' },
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
        pattern: /^[1-9]\d*$/,
        patternMessage: 'No. of rooms must be a whole number greater than 0'
    },
    monthly_rent:  {
        required: true,
        label: 'Monthly Rent',
        pattern: /^\d+(\.\d{1,2})?$/,
        patternMessage: 'Monthly rent must be a valid amount'
    },
    status:        { required: true, maxLength: 50, label: 'Status' },
    owner:         { required: true, label: 'Owner' },
    branch:        { required: true, label: 'Branch' }
};

/**
 * 👀 Property Viewing Validation Rules
 */
export const propertyViewingValidators = {
    property:   { required: true, label: 'Property' },
    renter:     { required: true, label: 'Renter' },
    view_date:  { required: true, label: 'Viewing Date' }
};

/**
 * 📄 Lease Validation Rules (Ready for when you build the Lease form!)
 */
export const leaseValidators = {
    property:     { required: true, label: 'Property' },
    renter:       { required: true, label: 'Renter' },
    rent_start:   { required: true, label: 'Start Date' },
    rent_finish:  { required: true, label: 'End Date' },
    duration:     { required: true, label: 'Duration' },
    monthly_rent: { required: true, label: 'Monthly Rent' },
    payment_method:{ required: true, label: 'Payment Method' },
    deposit:      { required: true, label: 'Deposit Amount' }
};

