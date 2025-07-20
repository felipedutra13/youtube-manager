import axios from '../infra/http/client.js';

export const getPlaylistItems = async (playlistId, nextPageToken) => {
    let params = {
        part: 'snippet',
        key: process.env.YOUTUBE_API_KEY,
        playlistId: playlistId,
        maxResults: 50
    };

    if (nextPageToken) {
        params.pageToken = nextPageToken;
    }

    const res = await axios.get('/playlistItems', {
        params: params
    });
    return res.data;
};
