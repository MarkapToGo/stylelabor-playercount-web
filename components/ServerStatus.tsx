import React, { useEffect, useState } from 'react';
import { getServerStatus } from '@/services/minecraftService';
import Image from 'next/image';
import PlayerChart from './PlayerChart';

interface ServerStatusProps {
    serverIps: string[];
    setServerIps: (ips: string[]) => void;
    setTotalPlayers: (total: number) => void;
}

const ServerStatus: React.FC<ServerStatusProps> = ({ serverIps, setServerIps, setTotalPlayers }) => {
    const [statuses, setStatuses] = useState<any[]>([]);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
    const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
    const [nextRefresh, setNextRefresh] = useState<Date | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [playerData, setPlayerData] = useState<{ time: string, totalPlayers: number }[]>([]);

    useEffect(() => {
        const savedLastRefresh = localStorage.getItem('lastRefresh');
        const savedNextRefresh = localStorage.getItem('nextRefresh');
        const savedPlayerData = localStorage.getItem('playerData');

        if (savedLastRefresh) {
            setLastRefresh(new Date(savedLastRefresh));
        }

        if (savedNextRefresh) {
            setNextRefresh(new Date(savedNextRefresh));
        }

        if (savedPlayerData) {
            setPlayerData(JSON.parse(savedPlayerData));
        }

        const fetchStatuses = async () => {
            setLoading(true);
            try {
                const data = await Promise.all(serverIps.map(ip => getServerStatus(ip)));
                setStatuses(data);
                const totalPlayers = data.reduce((sum, status) => sum + (status.online ? status.players.online : 0), 0);
                setTotalPlayers(totalPlayers);
                const now = new Date();
                const next = new Date(now.getTime() + 60000); // Next refresh in 1 minute
                setLastRefresh(now);
                setNextRefresh(next);
                localStorage.setItem('lastRefresh', now.toISOString());
                localStorage.setItem('nextRefresh', next.toISOString());

                // Update player data for chart
                setPlayerData(prevData => {
                    const newData = [...prevData, { time: now.toLocaleTimeString(), totalPlayers }];
                    localStorage.setItem('playerData', JSON.stringify(newData));
                    return newData;
                });
            } catch (error) {
                console.error('Error fetching statuses:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStatuses().catch(error => console.error('Error in fetchStatuses:', error));

        const intervalId = setInterval(fetchStatuses, 60000); // Refresh every minute

        return () => clearInterval(intervalId); // Clear interval on component unmount
    }, [serverIps, setTotalPlayers]);

    const copyToClipboard = (serverIp: string, index: number) => {
        navigator.clipboard.writeText(serverIp)
            .then(() => {
                setCopiedIndex(index);
                setTimeout(() => setCopiedIndex(null), 2000); // Reset after 2 seconds
            })
            .catch(error => console.error('Error copying to clipboard:', error));
    };

    const getSubdomain = (serverIp: string) => {
        try {
            if (!serverIp) throw new Error('Server IP is undefined');
            const subdomain = serverIp.split('.')[0];
            return subdomain.charAt(0).toUpperCase() + subdomain.slice(1);
        } catch (error) {
            console.error('Error getting subdomain:', error);
            return 'Unknown';
        }
    };

    const handleDelete = (serverIp: string) => {
        try {
            if (serverIps.length > 0) {
                const updatedServerIps = serverIps.filter(ip => ip !== serverIp);
                setServerIps(updatedServerIps);
                localStorage.setItem('serverIps', JSON.stringify(updatedServerIps));
            }
        } catch (error) {
            console.error('Error deleting server IP:', error);
        }
    };

    if (loading) {
        return <div className="spinner"></div>;
    }

    if (statuses.length === 0) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className="col-span-full mb-4">
                    <p className="text-light-red">Last Refresh: {lastRefresh ? lastRefresh.toLocaleTimeString() : 'Never'}</p>
                    <p className="text-light-green">Next Refresh: {nextRefresh ? nextRefresh.toLocaleTimeString() : 'Calculating...'}</p>
                </div>
                {statuses.map((status, index) => (
                    <div key={index} className="mb-8 relative server-container server-card">
                        {status.icon && <Image src={status.icon} alt="Server Icon" width={192} height={192} className="mx-auto mb-4 rounded-lg server-icon" />}
                        <button className="delete-button" onClick={() => handleDelete(serverIps[index])}>Delete</button>
                        <h1 className="text-3xl font-bold">{getSubdomain(serverIps[index])}</h1>
                        <p className="cursor-pointer" onClick={() => copyToClipboard(serverIps[index], index)}>
                            Server IP: <span className={`underline ${serverIps[index] && serverIps[index].length > 20 ? 'text-small' : ''} ${copiedIndex === index ? 'text-orange' : ''}`}>{copiedIndex === index ? 'Copied!' : serverIps[index]}</span>
                        </p>
                        <p>Status: {status.online ? <span className="font-bold text-green-500">Online</span> : 'Offline'}</p>
                        {status.online && (
                            <>
                                <p>Players: {status.players.online}/{status.players.max}</p>
                                <p>Version: {status.version}</p>
                                <p className="motd-text">MOTD: <span className="motd-small">{status.motd}</span></p>
                            </>
                        )}
                    </div>
                ))}
            </div>
            <PlayerChart data={playerData} />
        </div>
    );
};

export default ServerStatus;