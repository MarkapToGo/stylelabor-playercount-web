// components/LoginForm.tsx
import React, { useState } from 'react';
import '../app/globals.css'; // Ensure the CSS file is imported

interface LoginFormProps {
    setIsLoggedIn: (isLoggedIn: boolean) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ setIsLoggedIn }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Add your login logic here
        if (username === 'admin' && password === 'stylelabor1234') {
            setIsLoggedIn(true);
        } else {
            setError('Invalid username or password');
        }
    };

    return (
        <div className="login-form">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="input-black-text"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-black-text"
                />
                <button type="submit">Login</button>
                {error && <p className="error">{error}</p>}
            </form>
        </div>
    );
};

export default LoginForm;