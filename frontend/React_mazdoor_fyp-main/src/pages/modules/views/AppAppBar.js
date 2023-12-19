import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import { useNavigate } from "react-router-dom"
import React, { useState } from 'react';
import globalUser from '../../../global-data';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import mapApiDataToUser from '../../../model-mapping-function';
function NavbarComponent() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loginAsPro, setLoginAsPro] = useState(globalUser.userModel?.loginAsPro || false);

  const handleNavigate = (e) => {
    navigate(`${e}`);
  };
  const handleLogout = async () => {
    globalUser.setUserModel(null);
    handleNavigate("/signin");
  };
  const handleSwtich = () => {
    const userType = "labour";
    const mappedUser = mapApiDataToUser(globalUser.userModel, userType);
    globalUser.setUserModel(mappedUser);
    console.log(globalUser.userModel);
    // Redirect to dashboard-labor/app when loginAsPro is true
    if (!loginAsPro) {
      handleNavigate('/dashboard-labor/app');
    }
  };
  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container>
        <Navbar.Brand onClick={() => handleNavigate("/home")}>Bid2Hire</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link onClick={() => handleNavigate("/bidForm")}>Hire</Nav.Link>
            <Nav.Link onClick={() => handleNavigate("/dashboard/app")}>Dashboard</Nav.Link>
          </Nav>
          <Nav>
            {globalUser.userModel && !loginAsPro && (
                <>
                  <Button variant="outline-light" onClick={() => handleSwtich()}>
                    Switch to pro
                  </Button>
                </>
              )}


           <div style={{ marginRight: '10px' }}></div>
           {globalUser.userModel.isPro === false && (
              <>
              <Button variant="outline-light" onClick={() => handleNavigate("/proSignUp")}>
                 Become a Pro
              </Button>
              </>
            )}
              <div style={{ marginRight: '10px' }}></div>
              <Button onClick={handleLogout} variant="outline-light" disabled={loading}>
                  {loading ? 'Logging out...' : 'Logout'}
              </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;