export const validatePayroll = (values) => {
    const errors = {};
    if (!values.hours) {
        errors.hours = 'Required';
    } else if (isNaN(values.hours[0]) || isNaN(values.hours[1]) || isNaN(values.hours[3]) || isNaN(values.hours[4])) {
        errors.hours = 'Must enter time in format HH:MM';
    } else if (!values.hours.includes(':')) {
        errors.hours = 'Time should contain a :';
    }
    if (!values.procedure) {
        errors.procedure = 'Required';
    }
    if (!values.performance) {
        errors.performance = 'Required';
    } else if (isNaN(values.performance)) {
        errors.performance = 'Must enter number';
    } else if (values.performance < 1 || values.performance > 5) {
        errors.performance = "Must enter number between 1 and 5"
    }
    if (!values.apptTime) {
        errors.apptTime = 'Required';
    }  else if (isNaN(values.apptTime[0]) || isNaN(values.apptTime[1]) || isNaN(values.apptTime[3]) || isNaN(values.apptTime[4])) {
        errors.apptTime = 'Must enter time in format HH:MM';
    } else if (!values.apptTime.includes(':')) {
        errors.apptTime = 'Time should contain a :';
    }
    return errors;
};