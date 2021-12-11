import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { RequestWithUser } from 'src/request.interface';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PostDetailResponseDto } from 'src/user/dto/response.dto';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createPostDto: CreatePostDto, @Req() req: RequestWithUser) {
    return this.postService.create(createPostDto, req);
  }


  @Get()
  findAll() {
    return this.postService.findAll();
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id);
    
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto, @Req() req: RequestWithUser) {
    return this.postService.update(+id, updatePostDto, req);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.postService.remove(+id, req);
  }
}
