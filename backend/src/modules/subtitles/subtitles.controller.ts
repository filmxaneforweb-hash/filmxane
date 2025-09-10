import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseInterceptors,
  UploadedFile,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { SubtitlesService } from './subtitles.service';
import { SubtitleFormat } from '../../entities/subtitle.entity';
import * as path from 'path';
import * as fs from 'fs';

@Controller('api/subtitles')
export class SubtitlesController {
  constructor(private readonly subtitlesService: SubtitlesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async createSubtitle(
    @Body() body: {
      videoId: string;
      language: string;
      languageName: string;
      format: SubtitleFormat;
      description?: string;
    },
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      return { success: false, error: 'No file uploaded' };
    }

    // Dosya uzantısını kontrol et
    const allowedExtensions = ['.srt', '.vtt', '.ass', '.ssa'];
    const fileExtension = path.extname(file.originalname).toLowerCase();
    
    if (!allowedExtensions.includes(fileExtension)) {
      return { 
        success: false, 
        error: 'Invalid file format. Allowed formats: SRT, VTT, ASS, SSA' 
      };
    }

    // Dosyayı kaydet
    const uploadsDir = path.join(process.cwd(), 'uploads', 'subtitles');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const fileName = `${Date.now()}-${file.originalname}`;
    const filePath = path.join(uploadsDir, fileName);
    const fileUrl = `/uploads/subtitles/${fileName}`;

    fs.writeFileSync(filePath, file.buffer);

    const subtitle = await this.subtitlesService.createSubtitle(
      body.videoId,
      body.language,
      body.languageName,
      body.format,
      fileUrl,
      filePath,
      body.description,
    );

    return {
      success: true,
      data: subtitle,
    };
  }

  @Get('video/:videoId')
  async getSubtitlesByVideoId(@Param('videoId') videoId: string) {
    const subtitles = await this.subtitlesService.getSubtitlesByVideoId(videoId);
    return {
      success: true,
      data: subtitles,
    };
  }

  @Get(':id')
  async getSubtitleById(@Param('id') id: string) {
    const subtitle = await this.subtitlesService.getSubtitleById(id);
    return {
      success: true,
      data: subtitle,
    };
  }

  @Get(':id/content')
  async getSubtitleContent(@Param('id') id: string, @Res() res: Response) {
    try {
      const content = await this.subtitlesService.getSubtitleContent(id);
      const subtitle = await this.subtitlesService.getSubtitleById(id);
      
      // Content-Type'ı altyazı formatına göre ayarla
      let contentType = 'text/plain';
      if (subtitle.format === SubtitleFormat.VTT) {
        contentType = 'text/vtt';
      } else if (subtitle.format === SubtitleFormat.SRT) {
        contentType = 'text/plain';
      }

      res.setHeader('Content-Type', contentType);
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.send(content);
    } catch (error) {
      res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        error: 'Subtitle content not found',
      });
    }
  }

  @Put(':id')
  async updateSubtitle(
    @Param('id') id: string,
    @Body() updates: Partial<any>,
  ) {
    const subtitle = await this.subtitlesService.updateSubtitle(id, updates);
    return {
      success: true,
      data: subtitle,
    };
  }

  @Put(':id/set-default')
  async setDefaultSubtitle(@Param('id') id: string) {
    const subtitle = await this.subtitlesService.setDefaultSubtitle(id);
    return {
      success: true,
      data: subtitle,
    };
  }

  @Delete(':id')
  async deleteSubtitle(@Param('id') id: string) {
    await this.subtitlesService.deleteSubtitle(id);
    return {
      success: true,
      message: 'Subtitle deleted successfully',
    };
  }

  @Get('languages/available')
  async getAvailableLanguages() {
    const languages = await this.subtitlesService.getLanguageNames();
    return {
      success: true,
      data: languages,
    };
  }

  @Post(':id/download')
  async incrementDownloadCount(@Param('id') id: string) {
    await this.subtitlesService.incrementDownloadCount(id);
    return {
      success: true,
      message: 'Download count incremented',
    };
  }
}
