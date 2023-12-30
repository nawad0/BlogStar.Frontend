import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './login.css';

const Login = () => {
    const [loginData, setLoginData] = useState({
        username: '',
        password: '',
    });
    const [redirectTo, setRedirectTo] = useState(null);

    useEffect(() => {
        if (redirectTo) {
            window.location.href = redirectTo;
        }
        const storedToken = localStorage.getItem('jwtToken');
        if (storedToken) {
            setJwtToken(storedToken);
        }
    }, [redirectTo]);
    const [jwtToken, setJwtToken] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault(); // prevent the default form submission behavior

        try {
            const response = await fetch('auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData),
            });

            const data = await response.json();

            if (response.ok) {
                // Save the token upon successful authentication
                setJwtToken(data.token);
                localStorage.setItem('jwtToken', data.token);
                console.log(data.token);
                setRedirectTo('/blog');
            } else {
                console.error('Login Failed');
            }
        } catch (error) {
            console.error('Login Error', error);
        }
    };

    return (
        <div className="login-container">
            <div className="login-form">
                <h2 className="form-title">Login</h2>

                <form onSubmit={handleLogin}>
                    <input
                        className="form-input"
                        type="text"
                        placeholder="Username"
                        value={loginData.username}
                        onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                        required
                    />

                    <input
                        className="form-input"
                        type="password"
                        placeholder="Password"
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        required
                    />

                    <button type="submit" className="form-button">
                        Войти
                    </button>
                </form>

                <p className="form-link">
                    <Link to="/register">Если вы не зарегистрированы, то зарегистрируйтесь</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
