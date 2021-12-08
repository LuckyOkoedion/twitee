import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserService } from "src/user/user.service";

@Injectable()
export default class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly userService: UserService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.SECRET,
        });
    }


    async validate(payload: { userId: number }) {
        const user = await this.userService.validateAndConstructUser(payload.userId)
        if (user) {
            return user;
        } else {
            throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
        }

    }



}