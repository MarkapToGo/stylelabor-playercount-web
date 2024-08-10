// components/LoginForm.tsx
import React, { useState } from 'react';

interface LoginFormProps {
    onLogin: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = () => {
        if (username === 'admin' && password === 'stylelabor123') {
            localStorage.setItem('isAuthenticated', 'true');
            onLogin();
        } else {
            setError('Invalid username or password');
        }
    };

    return (
        <div className="login-form">
            <h2>Login</h2>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>Login</button>
            {error && <p className="error">{error}</p>}
        </div>
    );
};

export default LoginForm;