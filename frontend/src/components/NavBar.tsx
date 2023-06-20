import { Container, Navbar, Nav } from 'react-bootstrap';
import Logo from './Logo';
import React from 'react';
import "../css-files/NavBar.css"

export const NavBar = () => {
    const href = window.location.href;
    const hrefSplit = href.split("/");
    const isTransparent = hrefSplit[hrefSplit.length - 1] == "" || href.includes("login");
    return (
        <Navbar fixed="top" expand="lg" bg={`${isTransparent ? '' : 'light'}`} variant="light" className={`${isTransparent ? 'half-opacity-background' : ''}`}>
            <Container className='max-width-full'>
                <Navbar.Brand href='/' className="justify-start">
                    <Logo />
                </Navbar.Brand>

                {localStorage.getItem("role") ?
                    (
                        localStorage.getItem("role") == "Manager" ? (
                            <>
                                <Navbar.Collapse id="basic-navbar-nav">
                                    <Nav className="m-auto">
                                        <Nav.Link href='/employees'>Employees</Nav.Link>
                                        <Nav.Link href='/customer-cards'>Customer Cards</Nav.Link>
                                        <Nav.Link href='/categories'>Categories</Nav.Link>
                                        <Nav.Link href='/products'>Products</Nav.Link>
                                        <Nav.Link href='/products-in-the-store'>Products in the Store</Nav.Link>
                                        <Nav.Link href='/receipts'>Receipts</Nav.Link>
                                    </Nav>
                                </Navbar.Collapse>

                                <Navbar.Collapse className="justify-content-end">
                                    <Navbar.Text>
                                        Signed in as: <a href='/user-info' className='ml-2'>{localStorage.getItem("username")}</a>
                                    </Navbar.Text>
                                </Navbar.Collapse>

                                <Navbar.Toggle />
                            </>)
                            :
                            (
                                <>
                                    <Navbar.Collapse id="basic-navbar-nav">
                                        <Nav className="m-auto">
                                            <Nav.Link href='/employees'>Employees</Nav.Link>
                                            <Nav.Link href='/customer-cards'>Customer Cards</Nav.Link>
                                            <Nav.Link href='/products'>Products</Nav.Link>
                                            <Nav.Link href='/products-in-the-store'>Products in the Store</Nav.Link>
                                            <Nav.Link href='/receipts'>Receipts</Nav.Link>
                                        </Nav>
                                    </Navbar.Collapse>

                                    <Navbar.Collapse className="justify-content-end">
                                        <Navbar.Text>
                                            Signed in as: <a href='/user-info' className='ml-2'>{localStorage.getItem("username")}</a>
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