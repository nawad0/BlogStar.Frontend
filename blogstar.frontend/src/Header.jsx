import React from 'react';
import "./header.css"
const Header = () => {
    const data = localStorage.getItem('jwtToken');
    const LogOut = () => {
        localStorage.clear();
        window.location.href = '/register';
    };
    return (
        <header className="main-header">
            <div className="header-container">
                <h1 className="header-title">Your Blog App</h1>
                <nav className="header-nav">
                    {data ? 
                        <ul className="nav-list">
                            <li className="nav-item"><a href="/blog">Home</a></li>
                            <li className="nav-item"><a href="/all-articles">All Articles</a></li>
                            <li className="nav-item"><a href="/create">Create Blog</a></li>
                            <li className="nav-item" onClick={() => LogOut()}><a href="##">LogOut</a></li>
                        </ul>
                        :
                        <ul className="nav-list">
                           <li className="nav-item"><a href="/login">Login</a></li>
                           <li className="nav-item"><a href="/register">Register</a></li>
                        </ul>
                    }
                    
                </nav>
            </div>
        </header>
    );
};

export default Header;
