import { Controller, Get } from '@nestjs/common';
import { PublicService } from './public.service';

@Controller('public')
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  @Get('movies')
  getMovies() {
    return this.publicService.getMovies();
  }

  @Get('series')
  getSeries() {
    return this.publicService.getSeries();
  }

  @Get('content')
  getAllContent() {
    return this.publicService.getAllContent();
  }

  @Get('categories')
  getCategories() {
    return this.publicService.getCategories();
  }
}
