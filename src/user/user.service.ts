import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto, LoginDto, UserDataDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

import { google, Auth } from 'googleapis';

import * as nodemailer from "nodemailer";
import { RequestWithUser } from 'src/request.interface';
import { Post } from 'src/post/entities/post.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { Like } from 'src/like/entities/like.entity';

const OAuth2 = google.auth.OAuth2;

@Injectable()
export class UserService {


  constructor(
    @InjectModel(User)
    private readonly theModel: typeof User,
    private readonly jwtService: JwtService
  ) {

  }

  async create(theDto: CreateUserDto) {
    const theObject = new User();
    const noOfSimilarEmail = await this.theModel.count({
      where: {
        email: theDto.email
      }
    });

    if (noOfSimilarEmail == 0) {
      const password = theDto.password;
      const passwordHash = await bcrypt.hash(password, 10);

      theObject.date_created = (+new Date()).toString();
      theObject.name = theDto.name;
      theObject.email = theDto.email;
      theObject.password = passwordHash;

      try {
        const result = await theObject.save();
        if (typeof result !== 'undefined') {
          let theMail = theDto.email;
          let theName = theDto.name;
          this.sendOnboardMail(theMail, theName);
        }

      } catch (error) {
        throw new BadRequestException(error.message, "Creation failed ! check the request body content or the backend server.")
      }

    } else {
      throw new BadRequestException("An account with this email already exists")
    }

  }

  async logIn(login: LoginDto) {
    let payload: { userId: string };
    const email = login.email;
    const plainTextPassword = login.password;
    const user = await this.findUserWithEmail(email);
    if (user) {
      const correctPassword = user.password;
      try {
        payload = { userId: user.id };
        const result = await bcrypt.compare(plainTextPassword, correctPassword);

        if (result) {
          const token = this.jwtService.sign(payload);
          return {
            userId: user.id,
            token: token
          }
        }
      } catch (error) {

      }
    } else {
      throw new BadRequestException("No such user in the database");
    }
  }

  async isTokenOkay(token: { value: string; }) {
    let verificationResult: {
      "userId": number,
      "iat": number,
      "exp": number
    }

    try {
      verificationResult = this.jwtService.verify(token.value);
      if (Date.now() >= verificationResult.exp * 1000) {
        return false
      } else {
        return true
      }
    } catch (error) {
      return false
    }
  }



  async findAll(): Promise<User[]> {

    try {
      const result = await this.theModel.findAll();

      // let serialized = result.map(value => {
      //   let { password, ...clean } = value;
      //   return clean;
      // });
      // return serialized;

      return result;
    } catch (error) {
      throw new NotFoundException()
    }

  }

  async findOne(id: number): Promise<User> {
    try {
      const result = await this.theModel.findOne({
        where: {
          id,
        },
        include: [Post, Comment, Like]
      });

      return result;

      // let { password, ...serialized } = result;
      // return serialized;
    } catch (error) {
      throw new NotFoundException()
    }
  }

  async update(id: number, theUpdateDto: UpdateUserDto, req: RequestWithUser): Promise<User> {
    try {
      const record = await this.findOne(id);
      if (record.id === req.user.userId) {
        await record.update(theUpdateDto);
        return record;
      } else {
        throw new BadRequestException("You do not have the permission to edit this user profile");
      }

    } catch (error) {
      throw new BadRequestException(error.message, "Update operation failed ! Check the request body parameters or check backend server")
    }
  }

  async remove(id: number, req: RequestWithUser): Promise<void> {
    const record = await this.findOne(id);
    if (record.id === req.user.userId) {
      await record.destroy();
    } else {
      throw new BadRequestException("You do not have the permission to delete this user");
    }
  }




  private sendOnboardMail(email: string, name: string) {
    let _gmailTransporter: nodemailer.Transporter;
    let _oauth2Client: Auth.OAuth2Client;

    _oauth2Client = new OAuth2(
      process.env.OAUTH_CLIENT_ID,
      process.env.OAUTH_CLIENT_SECRET,
      process.env.OAUTH_CLIENT_URL,
    );

    _oauth2Client.setCredentials({
      refresh_token: process.env.OAUTH_CLIENT_REFRESH_TOKEN
    });

    const accessToken = _oauth2Client.getAccessToken();

    _gmailTransporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.LUCKYLEAD_EMAIL,
        clientId: process.env.OAUTH_CLIENT_ID,
        clientSecret: process.env.OAUTH_CLIENT_SECRET,
        refreshToken: process.env.OAUTH_CLIENT_REFRESH_TOKEN,
        accessToken: accessToken,
        tls: {
          rejectUnauthorized: false
        }
      }
    });

    _gmailTransporter.sendMail({
      from: process.env.LUCKYLEAD_EMAIL,
      to: email,
      subject: "Welcome to Twitee",
      html: `Hi ${name}, 
      
      Your user account has been created successfully. You can login and begin to twit and interface with others'.`
    })
      .then(res => {
        console.log(`The mail response is ${res}`);
      })
      .catch(error => {
        console.error(error);
      });

    _gmailTransporter.close();


  }


  async findUserWithEmail(email: string) {
    const result = await this.theModel.findOne({
      where: {
        email,
      }
    })
    return result;
  }

  async validateUser(id: number): Promise<boolean> {
    const result = await this.findOne(id)
    return !!result;
  }

  async validateAndConstructUser(id: number): Promise<UserDataDto> {
    const user = await this.findOne(id);
    if (user) {
      const userData: UserDataDto = {
        email: user.email,
        userId: user.id
      };
      return userData;

    }
    throw new BadRequestException('Invalid token');
  }



}
