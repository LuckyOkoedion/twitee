import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    AuthModule,
    SequelizeModule.forFeature([User])
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [
    SequelizeModule.forFeature([User]),
    UserService
  ]
})
export class UserModule { }
