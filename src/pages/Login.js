import React, { useState } from 'react';
import { Button, Card, Container, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useDispatch } from 'react-redux';
import { loginUser } from '../pages/redux/actions/login';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const postData = (e) => {
    e.preventDefault();
    console.log(email);
    console.log(password);
    let data = {
      email,
      password,
    };
    dispatch(loginUser(data, navigate));
  };
  return (
    <div style={{backgroundColor:'#fafafa',height:'100vh'}} className="d-flex align-items-center justify-content-center flex-direction-column " >
      <Card style={{borderRadius: '35px'}} className='border-white py-2'>
        <Card.Body className='p-5 '>
          <Card.Title className="text-primary d-flex align-items-center justify-content-center flex-direction-column ">
            <h3 style={{ color: '#7E98DF' }}>Login</h3>
          </Card.Title>
          <p className="mb-5">Hi, welcome back!</p>
          <Form onSubmit={postData}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                required
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                required
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
            </Form.Group>
            <div
              style={{
                paddingBottom: '20px',
                paddingLeft: '320px',
              }}
            >
              <Link align="right" to="/forgotpassword" style={{ color: '#7E98DF' ,textDecoration:'none'}}>
                Forgot password?
              </Link>
            </div>
            <div className="d-grid gap-2">
              <Button variant="white" type="submit" size="lg" style={{ backgroundColor: '#7E98DF',color:'white' }}>
                Login
              </Button>
            </div>
          </Form>
          <div className="py-4">
            <p className="text-center">
              Don't have an account <Link to="/register" style={{ color: '#7E98DF' ,textDecoration:'none'}}>Sign Up</Link>
            </p>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Login;
