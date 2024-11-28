import React, { useState } from 'react';
import { Button, Label, Col, FormGroup } from 'reactstrap';
import { Formik, Field, Form, ErrorMessage } from "formik";
import { validateLoginForm } from '../utils/validateLoginForm';
import { useNavigate } from 'react-router-dom';
import { authenticateUser } from '../utils/authService';

const LoginForm = ({onLogin}) => {
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const handleSubmit = async (values, { resetForm }) => {
        console.log('form values: ', values);
        console.log('in JSON format: ', JSON.stringify(values));
        try {
            const response = await authenticateUser(values.email, values.password);
            const [success, userDetails, sheetName, role] = response;

            if (success) {
                console.log('Authentication successful:', userDetails);
                sessionStorage.setItem('user', JSON.stringify(userDetails));
                onLogin(userDetails);

                // Route based on the sheet and role
                if (sheetName === "Patient") {
                    // If the user is found on the Patient sheet, navigate to the patient dashboard
                    console.log("Navigating to patient dashboard...");
                    navigate('/patientDashboard');
                } else if (sheetName === "Staff") {
                    console.log("user role: ", role)
                    if (role === "Admin") {
                        console.log("Navigating to admin dashboard...");
                        navigate('/adminDashboard');
                    } else {
                        console.log("Navigating to staff dashboard...");
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
   return (
     <div>
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
                <FormGroup row>
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