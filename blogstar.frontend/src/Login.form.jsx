import React, { useState, useEffect } from 'react';

const Login = () => {
    const [loginData, setLoginData] = useState({
        username: '',
        password: '',
    });
    const [redirectTo, setRedirectTo] = useState(null);

    const [registerData, setRegisterData] = useState({
        username: '',
        email: '',
        password: '',
    });
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

    const handleLogin = async () => {
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
                // Сохранение токена при успешной аутентификации
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

    const handleRegister = async () => {
        try {
            const response = await fetch('auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(registerData),
            });

            if (response.ok) {
                console.log('Registration Success');
            } else {
                console.error('Registration Failed');
            }
        } catch (error) {
            console.error('Registration Error', error);
        }
    };

    const fetchSecureData = async () => {
        try {
            const response = await fetch('api/secure/secure-data', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Secure Data:', data);
            } else {
                console.error('Failed to fetch secure data');
            }
        } catch (error) {
            console.error('Fetch Secure Data Error', error);
        }
    };

    return (
        <div className="login-container">
            <div className="login-section">
                <h2>Login</h2>
                <input
                    type="text"
                    placeholder="Username"
                    value={loginData.username}
                    onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                />
                <button onClick={handleLogin}>Войти</button>
            </div>
            <a href="https://localhost:5173/register">Если вы не зарегистрированы, то зарегестрируетесь</a>
        </div>

    );
};

export default Login;
