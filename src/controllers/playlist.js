import PlaylistService from '../services/playlist.js';
import { playlists } from '../config/playlists.js';
import VideoCard from '../views/videoCard.js';

function getPlayslistIdByTitle(playlistTitle) {
  if (!playlists[playlistTitle]) {
    throw "Playlist not found";
  }

  return playlists[playlistTitle];
}

class PlaylistController {
  async getRandomPlaylistItem(req, res) {
    const { id, minDuration, maxDuration } = req.query;

    const playlistService = new PlaylistService();

    try {
      const items = await playlistService.getRandomPlaylistItem(getPlayslistIdByTitle(id), minDuration, maxDuration);
      const videoCard = new VideoCard();
      res.send(videoCard.render(items));
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar item da playlist' });
      console.log(error);
    }
  };
};

export default PlaylistController;