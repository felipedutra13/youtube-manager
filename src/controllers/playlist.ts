import { Request, Response } from 'express';
import PlaylistService from '../services/playlist';

class PlaylistController {
  async getRandomPlaylistItem(req: Request, res: Response) {
    console.log("TESTE")
    const { playlistTitle } = req.params;
    console.log("Id " + playlistTitle);

    const playlistService = new PlaylistService();

    try {
      const items = await playlistService.getRandomPlaylistItem(playlistTitle);
      res.json({ items });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar item da playlist' });
      console.log(error);
    }
  };
};

export default PlaylistController;