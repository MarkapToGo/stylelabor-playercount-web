// pages/index.tsx
import React, { useState, useEffect } from 'react';
import ServerStatus from '@/components/ServerStatus';
import LoginForm from '@/components/LoginForm';

const HomePage: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        const authStatus = localStorage.getItem('isAuthenticated');
        if (authStatus === 'true') {
            setIsAuthenticated(true);
        }
    }, []);

    const handleLogin = () => {
        setIsAuthenticated(true);
    };

    return (
        <div>
            {isAuthenticated ? (
                <ServerStatus serverIps={[]} setServerIps={() => {}} setTotalPlayers={() => {}} />
            ) : (
                <LoginForm onLogin={handleLogin} />
            )}
        </div>
    );
};

export default HomePage;