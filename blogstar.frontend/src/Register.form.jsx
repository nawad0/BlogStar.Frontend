import React, { useState, useEffect } from 'react';

const Register = () => {
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

    const [jwtToken, setJwtToken] = useState('');
    useEffect(() => {
        if (redirectTo) {
            window.location.href = redirectTo;
        }
       
       
    }, [redirectTo]);
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
                console.log('Login Success');
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
                setRedirectTo('/login'); 
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
           

            <div className="register-section">
                <h2>Register</h2>
                <input
                    type="text"
                    placeholder="Username"
                    value={registerData.username}
                    onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Email"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                />
                <button onClick={handleRegister}>Register</button>
                <a href= "https://localhost:5173/index">Если вы зарегистрированы, то залогиньтесь</a>
            </div>

     
        </div>

    );
};

export default Register;
