import { fetchPlaylistItems } from './youtube.ts';

const YOUTUBE_BASE_URL = "https://www.youtube.com/watch?v=";

function getRandomElementFromPlaylistItems(items: any[]) {
    const randomIndex = Math.floor(Math.random() * items.length);
    return items[randomIndex];
}

function formatOutput(item: any) {
    console.log(item)
    return {
        title: item.snippet.title,
        url: `${YOUTUBE_BASE_URL}${item.snippet.resourceId.videoId}`
    };
}

class PlaylistService {

    async getRandomPlaylistItem(playlistId: string) {
        const items = await fetchPlaylistItems(playlistId);
        const item = getRandomElementFromPlaylistItems(items);
        return formatOutput(item);
    }
};

export default PlaylistService;