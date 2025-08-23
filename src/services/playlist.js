import { fetchPlaylistItems, fetchVideos } from './youtube.js';

const YOUTUBE_BASE_URL = "https://www.youtube.com/watch?v=";

function getRandomElementFromPlaylistItems(items) {
    const randomIndex = Math.floor(Math.random() * items.length);
    return items[randomIndex];
}

function formatOutput(item) {
    return {
        title: item.snippet.title,
        url: `${YOUTUBE_BASE_URL}${item.id}`
    };
}

function formatVideoIds(items) {
    return items.map(item => item.snippet.resourceId.videoId);
}

function filterVideosByMaxDuration(videos, maxDuration) {
    if (!maxDuration) {
        return videos;
    }

    return videos.filter(video => {
        let videoDurationInMinutes = youtubeDurationToMinutes(video.contentDetails.duration);
        if (videoDurationInMinutes <= maxDuration) {
            return true;
        } else {
            return false;
        }
    });
}

function youtubeDurationToMinutes(duration) {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);

    const hours = parseInt(match[1] || 0, 10);
    const minutes = parseInt(match[2] || 0, 10);
    const seconds = parseInt(match[3] || 0, 10);

    return hours * 60 + minutes + seconds / 60;
}


class PlaylistService {
    async getAllItems(playlistId) {
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

        return formatVideoIds(items);
    }

    async getAllVideos(videoIds) {
        const items = [];
        const maxResults = 50;
        let finished = false;
        let currentIndex = 0;


        do {
            let response = await fetchVideos(videoIds.slice(currentIndex, currentIndex + maxResults));
            items.push(...response.items);

            if (response.items.length >= maxResults) {
                currentIndex = currentIndex + maxResults;
            } else {
                finished = true;
            }
        } while (!finished);

        return items;
    }

    async getRandomPlaylistItem(playlistId, maxDuration) {
        const videoIds = await this.getAllItems(playlistId);
        const videos = await this.getAllVideos(videoIds);
        const filteredVideos = filterVideosByMaxDuration(videos, maxDuration);

        if (!filteredVideos.length) {
            return '';
        }

        const item = getRandomElementFromPlaylistItems(filteredVideos);
        return formatOutput(item);
    }
};

export default PlaylistService;