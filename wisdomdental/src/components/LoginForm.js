 import React from 'react';
 import { Button, Label, Col, FormGroup } from 'reactstrap';
import { Formik, Field, Form, ErrorMessage } from "formik";
import { validateLoginForm } from '../utils/validateLoginForm';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
    const navigate = useNavigate();

    const handleLogin = async (email, password, route) => {
        try {
            const response = await fetch('http://127.0.0.1:5000/patients/authenticate_patient', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (data.success) {
                localStorage.setItem('user', JSON.stringify(data.user));
                navigate(route);
            } else {
                alert(data.error || 'Login failed');
            }
        } catch (error) {
            console.error('Error logging in:', error);
        }
    };
    const handleNav = async (values, role) => {
        const validationErrors = validateLoginForm(values);
        if (Object.keys(validationErrors).length === 0) {
            const { email, password } = values;
            await handleLogin(email, password, `/${role}Dashboard`);
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
            onSubmit={() => {}}
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
                                <Field name='password' type='password' placeholder='Password' className='form-control mb-4' />
                                <ErrorMessage name='password'>
                                    {(msg) => <p className='text-danger text-start'>{msg}</p>}
                                </ErrorMessage>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Col>
                                <Button 
                                    type='button' 
                                    className='btn shadow rounded'
                                    onClick={() => handleNav(values, 'patient')}
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