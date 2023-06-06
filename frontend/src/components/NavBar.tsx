import { Container, Navbar, Nav } from 'react-bootstrap';
import React, { useState } from 'react';

export const NavBar = () => {
    const [activeLink, setActiveLink] = useState('home');
    return (
        //     <Navbar expand="md">
        //     <Container>
        //       <Navbar.Brand href="/">
        //         <img src={''} alt="Logo" />
        //       </Navbar.Brand>
        //       <Navbar.Toggle aria-controls="basic-navbar-nav">
        //         <span className="navbar-toggler-icon"></span>
        //       </Navbar.Toggle>
        //       <Navbar.Collapse id="basic-navbar-nav">
        //         <Nav className="ms-auto">
        //           <Nav.Link href="#home" >Home</Nav.Link>
        //           <Nav.Link href="#skills">Skills</Nav.Link>
        //           <Nav.Link href="#projects">Projects</Nav.Link>
        //         </Nav>
        //         <span className="navbar-text">
        //           <div className="social-icon">
        //             <a href="#"><img src={''} alt="" /></a>
        //             <a href="#"><img src={''} alt="" /></a>
        //             <a href="#"><img src={''} alt="" /></a>
        //           </div>
        //         </span>
        //       </Navbar.Collapse>
        //     </Container>
        //   </Navbar>
        <Navbar expand="md" bg="light" variant="light">
            <Container>
                <Navbar.Brand href='/'>
                    <img src={''} alt="logo" />
                </Navbar.Brand>

                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href='/employees'>Employees</Nav.Link>
                        <Nav.Link href='/customer-cards'>Customer Cards</Nav.Link>
                        <Nav.Link href='/categories'>Categories</Nav.Link>
                        <Nav.Link href='/products'>Products</Nav.Link>
                        <Nav.Link href='/products-in-the-store'>Products in the Store</Nav.Link>
                        <Nav.Link href='/checks'>Checks</Nav.Link>
                    </Nav>
                </Navbar.Collapse>

                <Navbar.Collapse className="justify-content-end">
                    <Navbar.Text>
                        Signed in as: <a href='/login'>Mark Otto</a>
                    </Navbar.Text>
                </Navbar.Collapse>

                <Navbar.Toggle />
            </Container>
        </Navbar>
    )
}

export default NavBar;