import React from "react";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { AccountCircle } from "@mui/icons-material";
import { Link } from "react-router-dom";

function NavBar() {
  const isLoggedIn = false; // غيّرها حسب حالة المستخدم

  return (
    <Navbar bg="light" expand="lg" className="px-3 shadow-sm">
      <Container fluid className="d-flex justify-content-between align-items-center">
        
        {/* الجملة على الشمال */}
        <Navbar.Brand className="fw-bold">Welcome to Drop Store</Navbar.Brand>

        {/* الجزء اليمين */}
        <Nav className="d-flex align-items-center">
          {isLoggedIn ? (
            <Button variant="outline-dark" className="d-flex align-items-center gap-2">
              <AccountCircle fontSize="medium" />
              <span>My Account</span>
            </Button>
          ) : (
            <>
            <Link to="/login">
             
              <Button variant="outline-primary"   className="me-2">
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="primary">Sign Up</Button>
            </Link>
            </>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
}

export default NavBar;
