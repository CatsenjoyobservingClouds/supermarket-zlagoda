import { Container, Navbar, Nav } from 'react-bootstrap';
import React from 'react';

export const NavBar = () => {
    return (
        <Navbar expand="md" bg="light" variant="light">
            <Container>
                <Navbar.Brand href='/'>
                    <h4>ZLAGODA</h4>
                </Navbar.Brand>

                {localStorage.getItem("role") ?
                    (
                        localStorage.getItem("role") == "Manager" ? (
                            <>
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
                                        Signed in as: {localStorage.getItem("username")}
                                    </Navbar.Text>
                                </Navbar.Collapse>

                                <Navbar.Toggle />
                            </>)
                            :
                            (
                                <>
                                    <Navbar.Collapse id="basic-navbar-nav">
                                        <Nav className="me-auto">
                                            <Nav.Link href='/employees'>Employees</Nav.Link>
                                            <Nav.Link href='/customer-cards'>Customer Cards</Nav.Link>
                                            <Nav.Link href='/products'>Products</Nav.Link>                                        <Nav.Link href='/products-in-the-store'>Products in the Store</Nav.Link>
                                            <Nav.Link href='/products-in-the-store'>Products in the Store</Nav.Link>
                                            <Nav.Link href='/checks'>Checks</Nav.Link>
                                        </Nav>
                                    </Navbar.Collapse>

                                    <Navbar.Collapse className="justify-content-end">
                                        <Navbar.Text>
                                            Signed in as: {localStorage.getItem("username")}
                                        </Navbar.Text>
                                    </Navbar.Collapse>

                                    <Navbar.Toggle />
                                </>
                            ))
                    :
                    (<Navbar.Collapse className="justify-content-end">
                        <Nav.Link href='/login'>
                            Sign in
                        </Nav.Link>
                    </Navbar.Collapse>)
                }


            </Container>
        </Navbar>
    )
}

export default NavBar;