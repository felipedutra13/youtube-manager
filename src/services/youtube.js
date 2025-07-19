import { getPlaylistItems } from "../api/youtube.js";

export const fetchPlaylistItems = async (playlistId) => {
  const response = await getPlaylistItems(playlistId);
  return response.items;
};
