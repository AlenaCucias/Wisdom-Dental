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
        resetForm();
    };
    const navigate = useNavigate();
    const handleNav = (values, route) => {
        const validationErrors = validateLoginForm(values); 
        if (Object.keys(validationErrors).length === 0) {
            console.log('Form is valid, navigating...');
            navigate(route);
        } else {
            console.log('Validation failed:', validationErrors);
        }
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
                            className='btn shadow rounded'
                            onClick = { () => { handleNav(values, '/patientDashboard')}}
                        >
                            Patient Login
                        </Button>
                    </Col>
                    <Col>
                        <Button 
                            type='submit' 
                            className='btn shadow rounded'
                            onClick = { () => { handleNav(values, '/staffDashboard')}}    
                        >
                            Staff Login
                        </Button>
                    </Col>
                    <Col>
                        <Button 
                            type='submit' 
                            className='btn shadow rounded'
                            onClick = { () => { handleNav(values, '/adminDashboard')}}
                        >
                            Admin Login
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