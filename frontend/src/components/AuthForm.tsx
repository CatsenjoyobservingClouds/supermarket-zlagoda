import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import axios from 'axios'
import '../css-files/AuthForm.css'; // Custom CSS file for additional styling

const HOST_NAME = 'http://localhost:8080';

const AuthForm: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [accessToken, setAccessToken] = useState(sessionStorage.getItem('accessToken'));

  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  async function loginUser() {
    try {
      const response = await axios.post(HOST_NAME + '/login', { 
        username : "empl_1", 
        password : "empl_1" 
      })
      
      const { accessToken } = response.data.token;
      sessionStorage.setItem('accessToken', accessToken);
      setAccessToken(accessToken);

    } catch (error) {
      console.log("Error while receiving JWT token.")
    }
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // loginUser();
    
    // Handle form submission here
    axios.post(HOST_NAME + '/login', { username : "empl_1", password : "empl_1" })
      .then(res => {
        const { accessToken } = res.data;
        sessionStorage.setItem('accessToken', accessToken);
        setAccessToken(accessToken);
      })
      .catch(error => {
        console.log("Error while receiving JWT token.")
      });

    // Reset the form fields
    console.log(accessToken);
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