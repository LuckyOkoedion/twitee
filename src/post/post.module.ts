import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { AuthModule } from 'src/auth/auth.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { Post } from './entities/post.entity';

@Module({
  imports: [
    AuthModule,
    SequelizeModule.forFeature([Post])
  ],
  controllers: [PostController],
  providers: [PostService],
  exports: [
    SequelizeModule.forFeature([Post]),
    PostService
  ]
})
export class PostModule { }
