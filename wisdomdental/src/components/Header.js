import React from 'react'
import { Navbar, NavbarBrand, Container, NavItem, Nav } from 'reactstrap'
import WisdomLogo from './logo.png';
import { NavLink } from 'react-router-dom';


const Header = () => {
  return (
    <div>
        <Navbar dark sticky='top' expand='md' style={{color: "#7D9DB6"}}>
                <Container>
                    <Nav>
                        <NavItem>
                          <NavLink className='nav-link' to='/'>
                            <button type="button" className='btn shadow rounded roboto-regular' >Home</button>
                          </NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink className='nav-link' to='/'>
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