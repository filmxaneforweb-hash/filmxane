import { Controller, Get, Param, Res, StreamableFile } from '@nestjs/common';
import { Response } from 'express';
import { createReadStream, existsSync } from 'fs';
import { join } from 'path';

@Controller('public')
export class PublicController {
  @Get('video/:filename')
  async getVideo(@Param('filename') filename: string, @Res() res: Response) {
    try {
      const videoPath = join(process.cwd(), 'uploads', 'videos', filename);
      
      if (!existsSync(videoPath)) {
        return res.status(404).json({ error: 'Video not found' });
      }

      // Set CORS headers
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Range, Content-Range, Content-Length, Content-Type');
      res.setHeader('Access-Control-Expose-Headers', 'Content-Range, Content-Length, Accept-Ranges');
      
      // Set video headers
      res.setHeader('Content-Type', 'video/mp4');
      res.setHeader('Accept-Ranges', 'bytes');
      
      // Handle range requests for video streaming
      const range = res.req.headers.range;
      if (range) {
        const fileSize = require('fs').statSync(videoPath).size;
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunksize = (end - start) + 1;
        
        res.status(206);
        res.setHeader('Content-Range', `bytes ${start}-${end}/${fileSize}`);
        res.setHeader('Content-Length', chunksize);
        
        const stream = createReadStream(videoPath, { start, end });
        stream.pipe(res);
      } else {
        const stream = createReadStream(videoPath);
        stream.pipe(res);
      }
    } catch (error) {
      console.error('Error serving video:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  @Get('thumbnail/:filename')
  async getThumbnail(@Param('filename') filename: string, @Res() res: Response) {
    try {
      const thumbnailPath = join(process.cwd(), 'uploads', 'thumbnails', filename);
      
      if (!existsSync(thumbnailPath)) {
        return res.status(404).json({ error: 'Thumbnail not found' });
      }

      // Set CORS headers
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      
      // Set image headers
      res.setHeader('Content-Type', 'image/jpeg');
      
      const stream = createReadStream(thumbnailPath);
      stream.pipe(res);
    } catch (error) {
      console.error('Error serving thumbnail:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  @Get('poster/:filename')
  async getPoster(@Param('filename') filename: string, @Res() res: Response) {
    try {
      const posterPath = join(process.cwd(), 'uploads', 'posters', filename);
      
      if (!existsSync(posterPath)) {
        return res.status(404).json({ error: 'Poster not found' });
      }

      // Set CORS headers
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      
      // Set image headers
      res.setHeader('Content-Type', 'image/jpeg');
      
      const stream = createReadStream(posterPath);
      stream.pipe(res);
    } catch (error) {
      console.error('Error serving poster:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}