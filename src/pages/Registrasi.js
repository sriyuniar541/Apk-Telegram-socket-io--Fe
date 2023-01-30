import React, { useState } from 'react';
import { Button, Card, Container, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Router } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';

const Register = () => {
  const Navigate = useNavigate();
  const [user, setUser] = useState({
    fullname: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    if (e) {
      e.preventDefault();
    }
    try {
      const result = await axios.post(
        process.env.REACT_APP_BACKEND_USER + '/users/register',
        user
      );
      localStorage.setItem('otp',result.data.data.otp)
      console.log(result.data.data.otp,'ini data otp')
      Swal.fire('Success', 'Register success', 'success');
      Navigate('/otp');
    } catch (err) {
      Swal.fire('Warning', 'Email Already Registered', 'error');
      Navigate('/');
    }
  };

  return (
    <div style={{backgroundColor:'#fafafa',height:'100vh'}}  className="d-flex align-items-center justify-content-center flex-direction-column ">
      <Card className='border-white p-5'
        style={{
          width: '500px',
          height: 'auto',
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
        }}
      >
        <Card.Body >
          <Card.Title className="text-primary d-flex align-items-center justify-content-center flex-direction-column">
            <h3 style={{ color: '#7E98DF' ,textDecoration:'none'}}>Register</h3>
          </Card.Title>
          <p className="mb-5">Let's create your account</p>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                required
                name="fullname"
                className=""
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                required
                name="email"
                className=""
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                required
                name="password"
                onChange={handleChange}
              />
            </Form.Group>
            <div className="d-grid gap-2">
              <Button variant="white" type="submit" size="lg" style={{ backgroundColor: '#7E98DF' ,textDecoration:'none',color:'white'}}>
                Register
              </Button>
            </div>
          </Form>
          <div className="py-4">
            <p className="text-center">
              Alredy akun?<Link to="/" style={{ color: '#7E98DF' ,textDecoration:'none'}}>Login</Link>
            </p>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Register;
