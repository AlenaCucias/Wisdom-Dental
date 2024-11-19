
export const validateLoginForm = (values) => {
    const errors = {};
    if (!values.email) {
        errors.email = 'Required';
    } else if (!values.email.includes('@')) {
        errors.email = 'Email should contain a @';
    }
    if (!values.password) {
        errors.password = 'Required';
    } else if (values.password.length < 8) {
        errors.password = 'Must be at least 8 characters';
    }
    return errors;
};

