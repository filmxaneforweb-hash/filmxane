import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { Video } from '../../entities/video.entity';
import { User } from '../../entities/user.entity';
import { Series } from '../../entities/series.entity';
import { SystemSettings } from '../../entities/settings.entity';
import { AdminGateway } from '../../gateways/admin.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Video, User, Series, SystemSettings])],
  controllers: [AdminController],
  providers: [AdminService, AdminGateway],
  exports: [AdminService],
})
export class AdminModule {}
