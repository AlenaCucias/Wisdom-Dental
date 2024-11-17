import React from 'react'
import { Navbar, NavbarBrand, Container, NavItem, NavLink, Nav, NavbarToggler, Collapse } from 'reactstrap'
import {Link} from 'react-router-dom';
import WisdomLogo from './logo.png';

const Header = () => {
  return (
    <div>
        <Navbar dark sticky='top' expand='md' style={{color: "#7D9DB6"}}>
                <Container>
                    <Nav>
                        <NavItem>
                          <NavLink>
                            <button type="button" className='btn shadow rounded roboto-regular' >Home</button>
                          </NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink>
                            <button type="button" className='btn shadow rounded roboto-regular' >About Us</button>
                          </NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink>
                            <button type="button" className='btn shadow rounded roboto-regular' >Feedback/FAQs</button>
                          </NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink>
                            <button type="button" className='btn shadow rounded roboto-regular' >Sign In</button>
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