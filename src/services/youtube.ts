import { getPlaylistItems } from "../api/youtube.ts";

export const fetchPlaylistItems = async (playlistId: string) => {
  const response = await getPlaylistItems(playlistId);
  return response.items;
};
