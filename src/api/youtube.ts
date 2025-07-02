import axios from '../infra/http/client';
import { playlists } from '../config/playlists';

export const getPlaylistItems = async (playlistTitle: string) => {
    const playlistId = getPlaylistIdByTitle(playlistTitle);
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

function getPlaylistIdByTitle(playlistTitle: string) {
    let playlistId = playlists[playlistTitle as keyof typeof playlists];

    if (!playlistId) {
        throw new Error(`Playlist ${playlistTitle} doesn't exist!`);
    }
    
    return playlistId;
}
