import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RequestWithUser } from 'src/request.interface';
import { CommentDetailResponseDto } from 'src/user/dto/response.dto';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createCommentDto: CreateCommentDto, @Req() req: RequestWithUser) {
    return this.commentService.create(createCommentDto, req);
  }


  @Get()
  findAll() {
    return this.commentService.findAll();
    
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.commentService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto, @Req() req: RequestWithUser) {
    return this.commentService.update(+id, updateCommentDto, req);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.commentService.remove(+id, req);
  }
}
