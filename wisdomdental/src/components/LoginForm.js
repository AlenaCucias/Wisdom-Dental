import React, { useState } from 'react';
import { Button, Label, Col, FormGroup } from 'reactstrap';
import { Formik, Field, Form, ErrorMessage } from "formik";
import { validateLoginForm } from '../utils/validateLoginForm';
import { useNavigate } from 'react-router-dom';
import { authenticateUser } from '../utils/authService';

const LoginForm = () => {
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const handleSubmit = async (values, { resetForm }) => {
        console.log('form values: ', values);
        console.log('in JSON format: ', JSON.stringify(values));
        try {
            const response = await authenticateUser(values.email, values.password);
            const { success, role, userDetails, sheetName } = response;

            if (success) {
                console.log('Authentication successful:', userDetails);
                sessionStorage.setItem('user', JSON.stringify(userDetails));


                // Route based on the sheet and role
                if (sheetName === "Patient") {
                    // If the user is found on the Patient sheet, navigate to the patient dashboard
                    navigate('/patientDashboard');
                } else if (sheetName === "Staff") {
                    if (role === "admin") {
                        // If the user is found in the Staff sheet and has the admin role, route to admin dashboard
                        navigate('/adminDashboard');
                    } else {
                        // If the user is found in the Staff sheet but is not an admin, route to the staff dashboard
                        navigate('/staffDashboard');
                    }
                }
            } else {
                setError("Authentication failed, please try again");
            }
        } catch (error) {
            console.error('Authentication error: ', error);
            setError("An error occurred, please try again later.");
        }
        resetForm();
    };
    // const handleNav = (values, route) => {
    //     const validationErrors = validateLoginForm(values);
    //     if (Object.keys(validationErrors).length === 0) {
    //         console.log('Form is valid, navigating...');
    //         navigate(route);
    //     } else {
    //         console.log('Validation failed:', validationErrors);
    //     }
    // };
    // const handleLogin = async (email, password) => {
    //     try {
    //         const response = await fetch('http://127.0.0.1:5000/authenticate_patient', {
    //             method: 'POST',
    //             headers: { 'Content-Type': 'application/json' },
    //             body: JSON.stringify({ email, password }),
    //         });
    //         const data = await response.json();
    //         if (data.success) {
    //             localStorage.setItem('user', JSON.stringify(data.user));
    //             window.location.href = '/dashboard'; // Redirect to the dashboard
    //         } else {
    //             alert(data.error || 'Login failed');
    //         }
    //     } catch (error) {
    //         console.error('Error logging in:', error);
    //     }
    // };
    return (
        <div className='login-form'>
            <Formik
                initialValues={{
                    email: '',
                    password: '',
                }}
                onSubmit={handleSubmit}
                validate={validateLoginForm}
            >
                {({ values }) => (
                    <Form>
                        <FormGroup row>
                            <Label htmlFor='email' className='text-start'>Email</Label>
                            <Col>
                                <Field name='email' placeholder='Email' className='form-control mb-4'></Field>
                                <ErrorMessage name='email'>
                                    {(msg) => <p className='text-danger text-start'>{msg}</p>}
                                </ErrorMessage>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label htmlFor='password' className='text-start'>Password</Label>
                            <Col>
                                <Field name='password' placeholder='Password' className='form-control mb-4'></Field>
                                <ErrorMessage name='password'>
                                    {(msg) => <p className='text-danger text-start'>{msg}</p>}
                                </ErrorMessage>
                            </Col>
                        </FormGroup>
                        {error && <p className="text-danger">{error}</p>}
                        <FormGroup row>
                            {/* <Col>
                                <Button
                                    type='submit'
                                    className='btn shadow rounded'
                                    //onClick={() => { handleNav(values, '/patientDashboard') }}
                                >
                                    Patient Login
                                </Button>
                            </Col>
                            <Col>
                                <Button
                                    type='submit'
                                    className='btn shadow rounded'
                                    // onClick={() => { handleNav(values, '/staffDashboard') }}
                                >
                                    Staff Login
                                </Button>
                            </Col> */}
                            <Col>
                                <Button
                                    type='submit'
                                    className='seconday-wrapper btn shadow rounded mb-5 secondary'
                                    style={{ width: '475px'}}
                                >
                                    Login
                                </Button>
                            </Col>
                        </FormGroup>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default LoginForm