import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios'
// import { useNavigate } from "react-router-dom";
import '../css-files/AuthForm.css'; // Custom CSS file for additional styling
import { BsEyeSlash, BsEye } from 'react-icons/bs';

const HOST_NAME = 'http://localhost:8080';

export type AuthFormProps = {
  onLogin: (role: string) => void;
};

const AuthForm: React.FC<AuthFormProps> = ({ onLogin }) => {
  // const navigate = useNavigate();
  const [areSubmittedWrongCredentials, setAreSubmittedWrongCredentials] = useState<Boolean | null>(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const username = e.target.username.value as string;
    const password = e.target.password.value as string;

    axios.post(HOST_NAME + '/login', { username: username, password: password })
      .then(response => {
        const token = response.data.token;
        console.log(token)
        onLogin(token);
        // navigate("/")
        setAreSubmittedWrongCredentials(false);
      })
      .catch(error => {
        setAreSubmittedWrongCredentials(true);
        console.log("Error while receiving JWT token.")
      });

    console.log(localStorage.getItem('jwt'))
  };

  const submittedWrongCredentials = areSubmittedWrongCredentials === true && (
    <Alert variant="danger">Entered wrong password or username</Alert>
  );

  const handleChange = () => {
    setAreSubmittedWrongCredentials(false)
  }

  return (
    <div className="auth-container unselectable">
      <Form onSubmit={handleSubmit} className="auth-form">
        <h2>Welcome to Zlahoda</h2>
        <Form.Group controlId="formUsername" className="form-group">
          <Form.Label>Username</Form.Label>
          <Form.Control
            className='control-username'
            type="text" name="username" onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formPassword" className="form-group">
          <Form.Label>Password</Form.Label>
          <div className="flex" id='password'>
            <Form.Control
              className='control-password'
              type={passwordVisible ? 'text' : 'password'} name="password" onChange={handleChange}
              required
            />
            <Button
              variant="light"
              onClick={togglePasswordVisibility}
              id="password-toggle"
            >
              {passwordVisible ? <BsEyeSlash /> : <BsEye />}
            </Button>
          </div>
        </Form.Group>

        {submittedWrongCredentials}

        <Button type="submit" className='my-button'>
          Sign in
        </Button>
      </Form>
    </div>
  );
};

export default AuthForm;