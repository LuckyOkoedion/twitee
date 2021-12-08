import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { RequestWithUser } from 'src/request.interface';
import { CreateLikeDto } from './dto/create-like.dto';
import { UpdateLikeDto } from './dto/update-like.dto';
import { Like } from './entities/like.entity';

@Injectable()
export class LikeService {

  constructor(
    @InjectModel(Like)
    private readonly theModel: typeof Like,
  ) { }

  async create(theDto: CreateLikeDto, req: RequestWithUser): Promise<Like> {
    const theObject = new Like();

    theObject.postId = theDto.postId;
    theObject.userWhoLiked = req.user.userId;

    try {
      return await theObject.save();

    } catch (error) {
      throw new BadRequestException(error.message, "Creation failed ! check the request body content or the backend server.")
    }

  }

  async findAll(): Promise<Like[]> {

    try {
      return await this.theModel.findAll();
    } catch (error) {
      throw new NotFoundException()
    }

  }

  async findOne(id: number): Promise<Like> {
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

  async update(id: number, theUpdateDto: UpdateLikeDto, req: RequestWithUser): Promise<Like> {
    try {
      const record = await this.findOne(id);
      if(record.userWhoLiked === req.user.userId) {
        await record.update(theUpdateDto);
        return record;
      } else {
        throw new BadRequestException("You do not have the permission to hit this endpoint");
      }
    } catch (error) {
      throw new BadRequestException(error.message, "Update operation failed ! Check the request body parameters or check backend server")
    }
  }

  async remove(id: number, req: RequestWithUser): Promise<void> {
    const record = await this.findOne(id);
    if(record.userWhoLiked === req.user.userId) {
      await record.destroy();
    } else {
      throw new BadRequestException("You do not have the permission to undo this like");
    }
  }

}
