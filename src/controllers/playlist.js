import PlaylistService from '../services/playlist.js';
import { playlists } from '../config/playlists.js';

function getPlayslistIdByTitle(playlistTitle) {
  if (!playlists[playlistTitle]) {
    throw "Playlist not found";
  }

  return playlists[playlistTitle];
}

class PlaylistController {
  async getRandomPlaylistItem(req, res) {
    const { id } = req.params;

    const playlistService = new PlaylistService();

    try {
      const items = await playlistService.getRandomPlaylistItem(getPlayslistIdByTitle(id));
      res.json({ items });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar item da playlist' });
      console.log(error);
    }
  };
};

export default PlaylistController;