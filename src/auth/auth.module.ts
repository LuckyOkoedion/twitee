import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/user/entities/user.entity';
import { ConfigModule } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import JwtStrategy from './passport/jwt.strategy';

@Module({
    imports: [
        ConfigModule,
        SequelizeModule.forFeature([User]),
        PassportModule.register({
            defaultStrategy: "jwt",
            property: "user",
            session: false
        }),
        JwtModule.registerAsync({
            useFactory: async () => ({
                signOptions: {
                    expiresIn: "24h",
                },
                secretOrPrivateKey: process.env.SECRET,
            }),
        })

    ],
    providers: [
        UserService,
        JwtStrategy
    ],
    exports: [
        PassportModule,
        ConfigModule,
        JwtModule,
        SequelizeModule.forFeature([User]),
        UserService,
        JwtStrategy

    ]
})
export class AuthModule { }
