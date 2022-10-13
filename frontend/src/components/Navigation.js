import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import {Link} from "react-router-dom";

export function Navigation() {
    return (
        <Navbar bg="light" expand="lg" className={'mb-4'}>
            <Container>
                <Link to="/" className={'h4 text-decoration-none text-black'}>{process.env.REACT_APP_PROJECT_NAME}</Link>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto px-2">
                        <Link to="/" className={'text-decoration-none px-2 text-black'}>Hello world</Link>
                        <Link to="/hello_name/" className={'text-decoration-none px-2 text-black'}>Hello name</Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}