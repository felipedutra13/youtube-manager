import { getPlaylistItems, listVideos } from "../api/youtube.js";

export const fetchPlaylistItems = async (playlistId, nextPageToken) => {
  return await getPlaylistItems(playlistId, nextPageToken);
};

export const fetchVideos = async (videoIds, nextPageToken) => {
  return await listVideos(videoIds, nextPageToken);
}