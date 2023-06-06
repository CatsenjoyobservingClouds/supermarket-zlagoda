import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import '../css-files/AuthForm.css'; // Custom CSS file for additional styling

const AuthForm: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Username:', username);
    console.log('Password:', password);
    // Reset the form fields
    setUsername('');
    setPassword('');
  };

  return (
    <Container className="auth-container">
      <Form onSubmit={handleSubmit} className="auth-form">
        <h2>Welcome to Zlagoda</h2>
        <Form.Group controlId="formUsername" className="form-group">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            value={username}
            onChange={handleUsernameChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formPassword" className="form-group">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
        </Form.Group>

        <Button type="submit">
          Sign in
        </Button>
      </Form>
    </Container>
  );
};

export default AuthForm;