import { getPlaylistItems } from "../api/youtube.js";

export const fetchPlaylistItems = async (playlistId, nextPageToken) => {
  return await getPlaylistItems(playlistId, nextPageToken);
};
