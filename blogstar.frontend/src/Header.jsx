import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

const Header = () => {
    const [anchorElNav, setAnchorElNav] = useState(null);
    const data = localStorage.getItem('jwtToken');

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const LogOut = () => {
        localStorage.clear();
        window.location.href = '/register';
    };

    const menuItems = data
        ? [
            { label: 'Home', link: '/blog' },
            { label: 'All Articles', link: '/all-articles' },
            { label: 'Profile', link: '/profile' },
            { label: 'LogOut', action: LogOut }
        ]
        : [
            { label: 'Login', link: '/login' },
            { label: 'Register', link: '/register' }
        ];
    const customFontStyle = { fontFamily: 'Roboto, sans-serif' };
    return (
       
        <Navbar bg="light" data-bs-theme="light">
            {data ? (
                <Container>
                    <Navbar.Brand href="#home">BlogStar</Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link href="/profile">Профиль</Nav.Link>
                        <Nav.Link href="/all-articles">Статьи</Nav.Link>
                        <Nav.Link href="/blog">Блог</Nav.Link>
                        <Nav.Link onClick={LogOut}>Выйти</Nav.Link>
                    </Nav>
                </Container>
            ) : (
                    <Container>
                        <Navbar.Brand href="#home">BlogStar</Navbar.Brand>
                        <Nav className="me-auto">
                            <Nav.Link href="/login">Авторизоваться</Nav.Link>
                            <Nav.Link href="/register">Зарегестрироваться</Nav.Link>
                      
                        </Nav>
                    </Container>
            )}

              
            </Navbar>
        
    );
};

export default Header;
