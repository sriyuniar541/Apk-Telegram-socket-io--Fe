import React, { useState } from 'react';
import { Button, Card, Container, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Router } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';

const Otp = () => {
  const getOtp = localStorage.getItem('otp')
  const Navigate = useNavigate();
  const [user, setUser] = useState({
    email: '',
    otp: getOtp,
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
        process.env.REACT_APP_BACKEND_USER + '/users/verif/otp',
        user
      );

      Swal.fire('Success', 'verif success', 'success');
      Navigate('/');
    } catch (err) {
      Swal.fire('Warning',  'error');
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
            <h3 style={{ color: '#7E98DF' ,textDecoration:'none'}}>Otp</h3>
          </Card.Title>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                required
                name="email"
                className=""
                value={user.email}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Otp</Form.Label>
              <Form.Control
                type="otp"
                placeholder="otp"
                required
                name="otp"
                value={user.otp}
                onChange={handleChange}
                
              />
            </Form.Group>
            <div className="d-grid gap-2">
              <Button variant="white" type="submit" size="lg" style={{ backgroundColor: '#7E98DF' ,textDecoration:'none',color:'white'}}>
                Verif
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Otp;
