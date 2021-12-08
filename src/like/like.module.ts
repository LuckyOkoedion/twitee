import { Module } from '@nestjs/common';
import { LikeService } from './like.service';
import { LikeController } from './like.controller';
import { AuthModule } from 'src/auth/auth.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { Like } from './entities/like.entity';

@Module({
  imports: [
    AuthModule,
    SequelizeModule.forFeature([Like])
  ],
  controllers: [LikeController],
  providers: [LikeService],
  exports: [
    SequelizeModule.forFeature([Like]),
    LikeService
  ]
})
export class LikeModule {}
