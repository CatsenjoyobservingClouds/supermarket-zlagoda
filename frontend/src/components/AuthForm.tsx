import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import '../css-files/AuthForm.css'; // Custom CSS file for additional styling

const HOST_NAME = 'http://localhost:8080';

export type AuthFormProps = {
  onLogin: (role: string) => void;
};

const AuthForm: React.FC<AuthFormProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [areSubmittedWrongCredentials, setAreSubmittedWrongCredentials] = useState<Boolean | null>(false);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const username = e.target.username.value as string;
    const password = e.target.password.value as string;

    axios.post(HOST_NAME + '/login', { username: username, password: password })
      .then(response => {
        const token = response.data.token;
        console.log(token)
        onLogin(token);
        navigate("/")
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
    <Container className="auth-container unselectable">
      <Form onSubmit={handleSubmit} className="auth-form">
        <h2>Welcome to Zlagoda</h2>
        <Form.Group controlId="formUsername" className="form-group">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text" name="username"  onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formPassword" className="form-group">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password" name="password" onChange={handleChange}
            required
          />
        </Form.Group>

        {submittedWrongCredentials}

        <Button type="submit">
          Sign in
        </Button>
      </Form>
    </Container>
  );
};

export default AuthForm;