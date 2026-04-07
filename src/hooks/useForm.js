import { useState } from 'react';

/**
 * Generic form hook with built-in validation.
 * @param {Object}   initialData  - Default form field values
 * @param {Function} validateFn   - (formData) => errorsObject  (optional)
 * @param {Function} onSubmit     - async (formData) => void
 */
export default function useForm({ initialData, validateFn, onSubmit }) {
    const [formData, setFormData] = useState(initialData);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear the field error when the user edits it
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Run validation if a validate function was provided
        if (validateFn) {
            const validationErrors = validateFn(formData);
            if (Object.keys(validationErrors).length > 0) {
                setErrors(validationErrors);
                return;
            }
        }

        setIsSubmitting(true);
        try {
            await onSubmit(formData);
            setFormData(initialData); // reset on success
            setErrors({});
        } catch (err) {
            // Error is already handled inside onSubmit (e.g. setSubmitError).
            // We catch here to prevent an unhandled promise rejection.
        } finally {
            setIsSubmitting(false);
        }
    };

    const reset = () => {
        setFormData(initialData);
        setErrors({});
    };

    return { formData, errors, isSubmitting, handleChange, handleSubmit, reset };
}
