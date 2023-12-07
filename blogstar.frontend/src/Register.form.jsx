import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './register.css';

const Register = () => {
    const [registerData, setRegisterData] = useState({
        username: '',
        email: '',
        password: '',
    });

    const handleRegister = async (e) => {
        e.preventDefault(); // prevent the default form submission behavior

        // Validation checks

        try {
            const response = await fetch('auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(registerData),
            });

            if (response.ok) {
                window.location.href = '/login';
                console.log('Registration Success');
            } else {
                console.error('Registration Failed');
            }
        } catch (error) {
            console.error('Registration Error', error);
        }
    };

    return (
        <div className="registration-container">
            <div className="registration-form">
                <h2 className="form-title">Register</h2>

                <form onSubmit={handleRegister}>
                    <label htmlFor="username" className="form-label">
                        Username
                    </label>
                    <input
                        id="username"
                        className="form-input"
                        type="text"
                        placeholder="Username"
                        value={registerData.username}
                        onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                        required
                    />

                    <label htmlFor="email" className="form-label">
                        Email
                    </label>
                    <input
                        id="email"
                        className="form-input"
                        type="text"
                        placeholder="Email"
                        value={registerData.email}
                        onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                        required
                    />

                    <label htmlFor="password" className="form-label">
                        Password
                    </label>
                    <input
                        id="password"
                        className="form-input"
                        type="password"
                        placeholder="Password"
                        value={registerData.password}
                        onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                        required
                    />

                    <button type="submit" className="form-button">
                        Register
                    </button>
                </form>

                <p className="form-link">
                    <Link to="/login">If you are registered, log in</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
