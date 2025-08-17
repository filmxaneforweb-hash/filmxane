import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SeriesService } from './series.service';
import { CreateSeriesDto } from './dto/create-series.dto';
import { SeriesStatus } from '../../entities/series.entity';

@Controller('series')
export class SeriesController {
  constructor(private readonly seriesService: SeriesService) {}

  @Post()
  create(@Body() createSeriesDto: CreateSeriesDto) {
    return this.seriesService.create(createSeriesDto);
  }

  @Get()
  findAll() {
    return this.seriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.seriesService.findOne(id);
  }

  @Get('status/:status')
  findByStatus(@Param('status') status: string) {
    return this.seriesService.findByStatus(status as SeriesStatus);
  }

  @Get('featured/featured')
  findFeatured() {
    return this.seriesService.findFeatured();
  }

  @Get('new/new')
  findNew() {
    return this.seriesService.findNew();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSeriesDto: Partial<CreateSeriesDto>) {
    return this.seriesService.update(id, updateSeriesDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.seriesService.remove(id);
  }

  @Post(':id/views')
  incrementViews(@Param('id') id: string) {
    return this.seriesService.incrementViews(id);
  }
}
