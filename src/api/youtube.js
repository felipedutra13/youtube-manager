import axios from '../infra/http/client.js';

export const getPlaylistItems = async (playlistId) => {
    const res = await axios.get('/playlistItems', {
        params: {
            part: 'snippet',
            key: process.env.YOUTUBE_API_KEY,
            playlistId: playlistId,
            maxResults: 50
        },
    });
    return res.data;
};
