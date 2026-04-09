export const staffValidators = {
    first_name:   { required: true, maxLength: 100, label: 'First Name' },
    last_name:    { required: true, maxLength: 100, label: 'Last Name' },
    email:        { required: true, maxLength: 255, label: 'Email',
                    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    patternMessage: 'Enter a valid email address' },
    sex:          { required: true, maxLength: 10, label: 'Gender' },
    dob:          { required: true, label: 'Date of Birth' },
    address:      { required: true, maxLength: 255, label: 'Address' },
    telephone_no: { required: true, maxLength: 50, label: 'Telephone Number',
                    pattern: /^\+?[\d\s\-()]{7,50}$/,
                    patternMessage: 'Enter a valid phone number' },
    nin:          { required: true, maxLength: 50, label: 'National Insurance Number' },
    position:     { required: true, maxLength: 50, label: 'Position' },
    salary:       { required: true, label: 'Salary' },
    date_joined:  { required: true, label: 'Date Joined' },
    branch:       { required: true, label: 'Branch' }
};

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
        
        if (rules.required && !value) {
            errors[field] = `${rules.label} is required.`;
        } else if (value && rules.maxLength && value.length > rules.maxLength) {
            errors[field] = `${rules.label} must be under ${rules.maxLength} characters.`;
        } else if (value && rules.pattern && !rules.pattern.test(value)) {
            errors[field] = rules.patternMessage;
        }
    }
    return errors;
}
