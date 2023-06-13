import React, { useState } from "react";
import { Button, Form, Image, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import "./login.css";
import { auth } from './auth/firebase';

const Login = ({ onLogin }) => {
    const navigate = useNavigate();
    const [isIncorrectCredentials, setIsIncorrectCredentials] = useState(null);

    const onSubmit = async (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const role = user.uid === "jI2p8Ei8PEgxYT5UiTsZ0Gc0zMl1" ? "manager" : "cashier";
            onLogin(role);
            navigate("/");
            setIsIncorrectCredentials(true);
        } catch (error) {
            setIsIncorrectCredentials(false);
        }
    };

    const incorrect = isIncorrectCredentials === false && (
        <Alert variant="danger">Wrong login or password</Alert>
    );

    return (
        <>
            <Image className="bg-image" src={require("../images/background.jpg")} fluid />
            <div className="login-container">
                <div className="login-form">
                    <h4 className="text-center mb-4">SIGN IN</h4>

                    <Form onSubmit={onSubmit}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Control type="email" name="email" placeholder="Email address" />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Control type="password" name="password" placeholder="Password" />
                        </Form.Group>

                        {incorrect}

                        <Button variant="outline-success" type="submit" className="w-100 mb-2">
                            Login
                        </Button>
                    </Form>
                </div>
            </div>
        </>
    );
};

export default Login;
