// app/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import ServerStatus from '../components/ServerStatus';
import LoginForm from '../components/LoginForm';
import Image from 'next/image';

export default function Home() {
    const [serverIps, setServerIps] = useState<string[]>([]);
    const [totalPlayers, setTotalPlayers] = useState(0);
    const [newServerIp, setNewServerIp] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const savedServerIps = localStorage.getItem('serverIps');
        if (savedServerIps) {
            setServerIps(JSON.parse(savedServerIps));
        }
    }, []);

    const handleAddServerIp = () => {
        if (newServerIp) {
            const updatedServerIps = [...serverIps, newServerIp];
            setServerIps(updatedServerIps);
            localStorage.setItem('serverIps', JSON.stringify(updatedServerIps));
            setNewServerIp("");
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleAddServerIp();
        }
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24">
            {isLoggedIn ? (
                <>
                    <div className="flex items-center mb-8">
                        <Image src="/icons/players-2.png" alt="Players Icon" width={48} height={48} className="mr-4" />
                        <h1 className="text-4xl font-bold">Total Online Players: <span className="text-orange">{totalPlayers}</span></h1>
                    </div>
                    <ServerStatus serverIps={serverIps} setServerIps={setServerIps} setTotalPlayers={setTotalPlayers} />
                    <div className="fixed bottom-8 right-8 flex items-center space-x-2">
                        <input
                            type="text"
                            value={newServerIp}
                            onChange={(e) => setNewServerIp(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Enter server IP"
                            className="p-2 border rounded input-light-blue"
                        />
                        <button
                            className="bg-blue-500 text-white w-16 h-16 rounded-full shadow-lg button-hover flex items-center justify-center"
                            onClick={handleAddServerIp}
                        >
                            <span className="plus-icon">+</span>
                        </button>
                    </div>
                </>
            ) : (
                <LoginForm setIsLoggedIn={setIsLoggedIn} />
            )}
        </main>
    );
}