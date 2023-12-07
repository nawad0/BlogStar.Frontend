import React from 'react';
import "./header.css"
const Header = () => {
    return (
        <header className="main-header">
            <div className="header-container">
                <h1 className="header-title">Your Blog App</h1>
                <nav className="header-nav">
                    <ul className="nav-list">
                        <li className="nav-item"><a href="/blog">Home</a></li>
                        <li className="nav-item"><a href="/create">Create Blog</a></li>
                        <li className="nav-item"><a href="/login">Login</a></li>
                        {/* Add more navigation items as needed */}
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;
