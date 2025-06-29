import axios from '../infra/http/client.ts';
import { playlists } from '../config/playlists.ts';

export const getPlaylistItems = async (query: string) => {
    const res = await axios.get('/playlistItems', {
        params: {
            part: 'snippet',
            key: process.env.YOUTUBE_API_KEY,
            playlistId: playlists.videogame,
            maxResults: 50
        },
    });
    return res.data;
};
