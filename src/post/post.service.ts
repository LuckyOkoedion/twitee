import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Comment } from 'src/comment/entities/comment.entity';
import { Like } from 'src/like/entities/like.entity';
import { RequestWithUser } from 'src/request.interface';
import { User } from 'src/user/entities/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';



@Injectable()
export class PostService {

  constructor(
    @InjectModel(Post)
    private readonly theModel: typeof Post,
  ) { }

  async create(theDto: CreatePostDto, req: RequestWithUser): Promise<Post> {
    const theObject = new Post();

    theObject.author = req.user.userId;
    theObject.post = theDto.post;

    try {
      return await theObject.save();

    } catch (error) {
      throw new BadRequestException(error.message, "Creation failed ! check the request body content or the backend server.")
    }

  }

  async findAll(): Promise<Post[]> {

    try {
      return await this.theModel.findAll({ include: [Comment, Like, User] });
    } catch (error) {
      throw new NotFoundException()
    }

  }

  async findOne(id: number): Promise<Post> {
    try {
      return await this.theModel.findOne({
        where: {
          id,
        },
        include: [Comment, Like, User]
      })
    } catch (error) {
      throw new NotFoundException()
    }
  }

  async update(id: number, theUpdateDto: UpdatePostDto, req: RequestWithUser): Promise<Post> {
    try {
      const record = await this.findOne(id);
      if (record.author === req.user.userId) {
        await record.update(theUpdateDto);
        return record;
      } else {
        throw new BadRequestException("You do not have the permission to edit this post");
      }
    } catch (error) {
      throw new BadRequestException(error.message, "Update operation failed ! Check the request body parameters or check backend server");
    }
  }

  async remove(id: number, req: RequestWithUser): Promise<void> {
    const record = await this.findOne(id);
    if (record.author === req.user.userId) {
      await record.destroy();
    } else {
      throw new BadRequestException("You do not have the permission to delete this post.");
    }

  }


}
