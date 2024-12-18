import React from 'react'
import { Navbar, NavbarBrand, Container, NavItem, Nav } from 'reactstrap'
import WisdomLogo from './logo.png';
import { NavLink, useLocation } from 'react-router-dom';


const Header = ({ onLogout }) => {
  const location = useLocation();
  const pagesWithChange = ['/patientDashboard', '/staffDashboard', '/adminDashboard'];
  const textChange = pagesWithChange.includes(location.pathname) ? "Logout" : "Sign In";
  return (
    <div>
        <Navbar className='sticky-top navbar' dark sticky='top' expand='md' style={{color: "#7D9DB6"}}>
                <Container>
                    <Nav>
                        <NavItem>
                          <NavLink className='nav-link' to='/'>
                            <button type="button" className='btn shadow rounded roboto-regular' >Home</button>
                          </NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink className='nav-link' to='/info'>
                            <button type="button" className='btn shadow rounded roboto-regular' >About Us</button>
                          </NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink className='nav-link' to='/feedback'>
                            <button type="button" className='btn shadow rounded roboto-regular' >Feedback/FAQs</button>
                          </NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink className='nav-link' to='/login'>
                            <button 
                              type="button" 
                              className='btn shadow rounded roboto-regular' 
                              onClick = {() => {
                                  if (textChange === "Logout") {
                                    onLogout();
                                  }
                              }}
                            >
                              {textChange}
                            </button>
                          </NavLink>
                        </NavItem>
                    </Nav>
                </Container>
                <Container>
                    <NavbarBrand className='ms-5' href='/'>
                        <img src={ WisdomLogo } alt='wisdom logo' className='float-end' />
                    </NavbarBrand>
                </Container>
            </Navbar>
    </div>
  )
}

export default Header