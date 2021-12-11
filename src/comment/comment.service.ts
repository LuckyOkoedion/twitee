import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { RequestWithUser } from 'src/request.interface';
import { User } from 'src/user/entities/user.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentService {

  constructor(
    @InjectModel(Comment)
    private readonly theModel: typeof Comment,
  ) { }

  async create(theDto: CreateCommentDto, req: RequestWithUser): Promise<Comment> {
    const theObject = new Comment();

    theObject.postId = theDto.postId;
    theObject.comment = theDto.comment;
    theObject.userWhoCommented = req.user.userId;

    try {
      return await theObject.save();

    } catch (error) {
      throw new BadRequestException(error.message, "Creation failed ! check the request body content or the backend server.")
    }

  }

  async findAll(): Promise<Comment[]> {

    try {
      return await this.theModel.findAll();
    } catch (error) {
      throw new NotFoundException()
    }

  }

  async findOne(id: number): Promise<Comment> {
    try {
      return await this.theModel.findOne({
        where: {
          id,
        }
      })
    } catch (error) {
      throw new NotFoundException()
    }
  }

  async update(id: number, theUpdateDto: UpdateCommentDto, req: RequestWithUser): Promise<Comment> {
    try {
      const record = await this.findOne(id);

      if (record.userWhoCommented === req.user.userId) {
        await record.update(theUpdateDto);
        return record;
      } else {
        throw new BadRequestException("You do not have the permission to edit this comment");
      }

    } catch (error) {
      throw new BadRequestException(error.message, "Update operation failed ! Check the request body parameters or check backend server")
    }
  }

  async remove(id: number, req: RequestWithUser): Promise<void> {
    const record = await this.findOne(id);
    if (record.userWhoCommented === req.user.userId) {
      await record.destroy();
    } else {
      throw new BadRequestException("You do not have the permission to delelet this comment");
    }

  }


}