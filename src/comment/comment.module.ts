import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { AuthModule } from 'src/auth/auth.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { Comment } from './entities/comment.entity';

@Module({
  imports: [
    AuthModule,
    SequelizeModule.forFeature([Comment])
  ],
  controllers: [CommentController],
  providers: [CommentService],
  exports: [
    SequelizeModule.forFeature([Comment]),
    CommentService
  ]
})
export class CommentModule {}
