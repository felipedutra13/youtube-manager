import { getPlaylistItems } from "../api/youtube";

export const fetchPlaylistItems = async (playlistTitle: string) => {
  const response = await getPlaylistItems(playlistTitle);
  return response.items;
};
