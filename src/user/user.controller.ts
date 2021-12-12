import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, LoginDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RequestWithUser } from 'src/request.interface';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserDetailResponseDto } from './dto/response.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('/login')
  login(@Body() login: LoginDto) {
    return this.userService.logIn(login);
  }

  @Post('/isTokenOkay')
  isTokenOkay(@Body() token: { value: string }) {
    return this.userService.isTokenOkay(token);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findAll() {
    let result = await this.userService.findAll();
    let structured = result.map(valu => {
      return new UserDetailResponseDto({
        "id": valu.id,
        "name": valu.name,
        "email": valu.email,
        "password": valu.password,
        "date_created": valu.date_created,
        "createdAt": valu.createdAt,
        "updatedAt": valu.updatedAt,
        "posts": valu.posts,
        "comments": valu.comments,
        "likes": valu.likes

      })
    });

    return structured;
  }


  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    let valu = await this.userService.findOne(+id);
    return new UserDetailResponseDto({
      "id": valu.id,
      "name": valu.name,
      "email": valu.email,
      "password": valu.password,
      "date_created": valu.date_created,
      "createdAt": valu.createdAt,
      "updatedAt": valu.updatedAt,
      "posts": valu.posts,
      "comments": valu.comments,
      "likes": valu.likes
    })


  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Req() req: RequestWithUser) {
    return this.userService.update(+id, updateUserDto, req);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.userService.remove(+id, req);
  }
}
