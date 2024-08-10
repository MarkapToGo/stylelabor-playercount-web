import axios from 'axios';

const API_URL = 'https://api.mcsrvstat.us/2/';

export const getServerStatus = async (serverIp: string) => {
    try {
        const response = await axios.get(`${API_URL}${serverIp}`);
        return {
            ...response.data,
            motd: response.data.motd ? response.data.motd.clean.join(' ') : 'No MOTD available'
        };
    } catch (error) {
        console.error('Error fetching server status:', error);
        return null;
    }
};