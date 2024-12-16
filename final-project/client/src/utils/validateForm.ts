// utils/validateForm.ts
import { FormData } from '../pages/Register';

export const validateField = (fieldName: keyof FormData, formData: FormData) => {
    let error = '';
    switch (fieldName) {
        case 'username':
            if (!formData.username) error = 'Username is required';
            break;
        case 'email':
            if (!formData.email) error = 'Email is required';
            else if (!/\S+@\S+\.\S+/.test(formData.email)) error = 'Email is invalid';
            break;
        case 'address':
            if (!formData.address) error = 'Address is required';
            break;
        case 'password':
            if (!formData.password) error = 'Password is required';
            else if (formData.password.length < 6)
                error = 'Password must be at least 6 characters';
            break;
        case 'confirmPassword':
            if (formData.password !== formData.confirmPassword)
                error = 'Passwords do not match';
            break;
        default:
            break;
    }
    return error;
};

// Refactor ValidateForm to avoid using useState
export const ValidateForm = (formData: FormData) => {
    const newErrors: { [key: string]: string } = {};

    (Object.keys(formData) as (keyof FormData)[]).forEach((field) => {
        const error = validateField(field, formData);
        if (error) newErrors[field] = error;
    });

    return Object.keys(newErrors).length > 0 ? newErrors : null;
};
