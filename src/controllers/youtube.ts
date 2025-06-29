import { Request, Response } from 'express';
import * as youtubeService from '../services/youtube.ts';

class YoutubeController {

  async getPlaylist(req: Request, res: Response) {
    const { id } = req.params;
    const apiKey = process.env.YOUTUBE_API_KEY!;

    try {
      const items = await youtubeService.fetchPlaylistItems(id);
      res.json({ items });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar playlist' });
      console.log(error);
    }
  };

};

export default YoutubeController;
