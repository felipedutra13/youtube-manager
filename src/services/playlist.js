import { fetchPlaylistItems } from './youtube.js';

const YOUTUBE_BASE_URL = "https://www.youtube.com/watch?v=";

function getRandomElementFromPlaylistItems(items) {
    const randomIndex = Math.floor(Math.random() * items.length);
    return items[randomIndex];
}

function formatOutput(item) {
    return {
        title: item.snippet.title,
        url: `${YOUTUBE_BASE_URL}${item.snippet.resourceId.videoId}`
    };
}

class PlaylistService {

    async getRandomPlaylistItem(playlistId) {
        const items = [];
        let finished = false;
        let nextPageToken = 0;

        do {
            let response = await fetchPlaylistItems(playlistId, nextPageToken);
            items.push(...response.items);

            if (response.nextPageToken) {
                nextPageToken = response.nextPageToken;
            } else {
                finished = true;
            }
        } while (!finished);

        const item = getRandomElementFromPlaylistItems(items);
        return formatOutput(item);
    }
};

export default PlaylistService;