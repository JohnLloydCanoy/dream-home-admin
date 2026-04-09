export const branchValidators = {
    street:       { required: true, maxLength: 100, label: 'Street' },
    area:         { required: false, maxLength: 100, label: 'Area' },
    city:         { required: true, maxLength: 50, label: 'City' },
    postcode:     { required: true, maxLength: 4, label: 'Postal Code',
                    pattern: /^\d{4}$/,
                    patternMessage: 'Enter a valid 4-digit Philippine postal code (e.g. 1000)' },
    telephone_no: { required: true, maxLength: 20, label: 'Telephone',
                    pattern: /^\+?[\d\s\-()]{7,20}$/,
                    patternMessage: 'Enter a valid phone number' },
    fax_no:       { required: false, maxLength: 20, label: 'Fax',
                    pattern: /^\+?[\d\s\-()]{7,20}$/,
                    patternMessage: 'Enter a valid fax number' },
};

export function validateForm(data, validators) {
    const errors = {};
    for (const [field, rules] of Object.entries(validators)) {
        const value = (data[field] || '').trim();
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
